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
  path: string;
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
    this.log(`apexDir: ${apexDir}`);

    reoderFiles(apexDir);

    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/arrange.ts',
    };
  }
}

function reoderFiles(classesPath = 'force-app/main/default/classes') {
  const files = fs.readdirSync(classesPath).map((file) => `${classesPath}/${file}`);

  let filesByPrefix = new Map();
  filesByPrefix.set(OTHER_FILES, []);

  let allFileDetails = files.map((file) => parse(file));

  for (const fileDetails of allFileDetails) {
    if (filesByPrefix.has(fileDetails.prefix)) {
      filesByPrefix.get(fileDetails.prefix).push(fileDetails);
    } else {
      filesByPrefix.set(fileDetails.prefix, [fileDetails]);
    }
  }

  let keys = Array.from(filesByPrefix.keys());

  for (const prefix of keys) {
    const domainFolder = `${classesPath}/${prefix}`;

    createIfDoesntExist(domainFolder);

    let allFiles = filesByPrefix.get(prefix);

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

      if (process.env.DX_FOLDERS_SHOW_OUTPUT) {
        // logger.info(newLocation);
      }

      fs.renameSync(fileDetails.originalLocation, newLocation);
    }
  }

  if (process.env.DX_FOLDERS_SHOW_OUTPUT) {
    showPreview(classesPath);
  }
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
    if (prefix.toLowerCase().includes('test')) {
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
    console.log(files);
  });
}

function createIfDoesntExist(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}
