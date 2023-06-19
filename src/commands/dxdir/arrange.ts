/* eslint-disable */

import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const OTHER_FILES = 'Other';
const testClassesSoFar = [];

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'dxdir.arrange', [
  'summary',
  'description',
  'examples',
  'flags.name.summary',
  'flags.apex-dir.summary',
]);

export type DxdirArrangeResult = {
  folders: any;
};

export default class DxdirArrange extends SfCommand<DxdirArrangeResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'apex-dir': Flags.directory({
      summary: messages.getMessage('flags.apex-dir.summary'),
      char: 'd',
      exists: true,
      default: 'force-app/main/default/classes',
    }),
  };

  public async run(): Promise<DxdirArrangeResult> {
    const { flags } = await this.parse(DxdirArrange);

    const apexDir = flags['apex-dir'];

    const logs = reoderFiles(apexDir);

    this.log(`Successfully created the following folders: \n`);

    let jsonOutput = {
      folders: [],
    };

    logs.forEach((log) => {
      this.log(`${log.domain} with ${log.getCount()} apex classes and ${log.getTestCount()} test classes\n`);

      jsonOutput.folders.push({
        name: log.domain,
        apexClasses: log.getCount(),
        testClasses: log.getTestCount(),
      });
    });

    return {
      folders: jsonOutput,
    };
  }
}

export function reoderFiles(classesPath = 'force-app/main/default/classes') {
  const logs = [];

  if (!fs.existsSync(classesPath)) {
    throw new Error(`Path ${classesPath} does not exist`);
  }

  const files = fs.readdirSync(classesPath).map((file) => `${classesPath}/${file}`);

  let filesByPrefix = new Map();
  filesByPrefix.set(OTHER_FILES, []);

  //don't parse existing folders, just files
  let allFileDetails = files.filter((file) => fs.statSync(file).isFile()).map((file) => parse(file));

  for (const fileDetails of allFileDetails) {
    if (filesByPrefix.has(fileDetails.prefix)) {
      filesByPrefix.get(fileDetails.prefix).push(fileDetails);
    } else {
      filesByPrefix.set(fileDetails.prefix, [fileDetails]);
    }
  }

  let keys = Array.from(filesByPrefix.keys());

  for (const prefix of keys) {
    const logInfo = new LoggingInfo();
    logInfo.domain = prefix;

    const domainFolder = `${classesPath}/${prefix}`;

    createIfDoesntExist(domainFolder);

    let allFiles = filesByPrefix.get(prefix);

    logInfo.setCount(allFiles.length);
    logInfo.setTestCount(allFiles.filter((file) => file.isTest).length);

    logs.push(logInfo);

    for (const fileDetails of allFiles) {
      let newLocation = '';
      let sourceFolder = '';
      let testFolder = '';

      if (fileDetails.subPrefix !== '') {
        const subFolder = `${domainFolder}/${fileDetails.subPrefix}`;
        sourceFolder = `${subFolder}/src`;
        testFolder = `${subFolder}/__tests__`;

        createIfDoesntExist(subFolder);
      } else {
        sourceFolder = `${domainFolder}/src`;
        testFolder = `${domainFolder}/__tests__`;
      }

      if (fileDetails.isTest) {
        createIfDoesntExist(testFolder);
        newLocation = `${testFolder}/${fileDetails.fileName}`;
      } else {
        createIfDoesntExist(sourceFolder);
        newLocation = `${sourceFolder}/${fileDetails.fileName}`;
      }

      fs.renameSync(fileDetails.originalLocation, newLocation);
    }
  }

  if (process.env.DX_FOLDERS_SHOW_OUTPUT) {
    showPreview(classesPath);
  }

  return logs;
}

function parse(file) {
  const parsedFile = path.parse(file);

  const fileName = parsedFile.base;
  let pureName = removeExtension(fileName);

  let fileDetails = {
    ignorePrefix: false,
    prefix: '',
    subPrefix: '',
    isTest: isTestClass(parsedFile),
    fileName: fileName,
    originalLocation: file,
  };

  if (pureName.includes('_')) {
    let parts = pureName.split('_');
    let prefix = parts[0];
    let lastPart = parts[parts.length - 1];

    //i.e Test_ContactController
    if (prefix.toLowerCase() == 'test') {
      fileDetails.ignorePrefix = true;
    } else {
      //i.e. ContactController_Test[s]
      if ((lastPart.toLowerCase() == 'test' || lastPart.toLowerCase() == 'tests') && parts.length == 2) {
        fileDetails.ignorePrefix = true;
      } else {
        //SRM_deployer_Test
        fileDetails.prefix = prefix;
      }
    }
  }

  let identifier = getMatchingIdentifier(fileDetails.fileName);

  if (identifier) {
    if (fileDetails.prefix === '') {
      //triggerhandler becomes the prefix
      fileDetails.prefix = identifier.dirName;
    } else {
      //SRM/triggerhandler/fileName
      fileDetails.subPrefix = identifier.dirName;
    }
  }

  if (fileDetails.prefix === '' || fileDetails.ignorePrefix) {
    fileDetails.prefix = OTHER_FILES;
  }

  return fileDetails;
}

function getMatchingIdentifier(fileName) {
  let identifiers = [
    {
      identifier: 'triggerhandler',
      dirName: 'trigger_handlers',
    },
    {
      identifier: 'batch',
      dirName: 'batch_apex',
    },
  ];

  let matchingIdentifier = identifiers.find((identifier) => fileName.toLowerCase().includes(identifier.identifier));

  return matchingIdentifier;
}

function isTestClass(parsedFile) {
  const pathToFile = parsedFile.dir + '/' + parsedFile.base;

  const contents = fs.readFileSync(pathToFile, 'utf8');
  const regex = /@istest/i;

  if (regex.test(contents)) {
    testClassesSoFar.push(removeExtension(parsedFile.base));
    return true;
  } else {
    //we add this check for the metadata file of every class i.e SRM_retrieve_Test.cls-meta.xml
    //such file would not have the @istest annotation but it is a test class
    if (testClassesSoFar.includes(removeExtension(parsedFile.base))) {
      return true;
    }
  }

  return false;
}

function removeExtension(fileName) {
  return fileName.split('.')[0];
}

function showPreview(path) {
  glob(path + '/**/*', function (er, files) {
    //console.log(files);
  });
}

function createIfDoesntExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

class LoggingInfo {
  public domain: string;
  count: number;
  testCount: number;

  public setCount(count: number) {
    this.count = this.getCorrectCount(count);
  }

  public getCount() {
    return this.count;
  }

  public setTestCount(count: number) {
    this.testCount = this.getCorrectCount(count);
  }

  public getTestCount() {
    return this.testCount;
  }

  private getCorrectCount(count: number) {
    return count > 0 ? count / 2 : count;
  }

  public printInfo() {
    //console.log(`Creating "${this.domain}" folder with ${this.count} files and ${this.testCount} tests`);
  }
}
