/* eslint-disable */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const foldersToDelete = [];

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'dxdir.reset', [
  'summary',
  'description',
  'examples',
  'flags.name.summary',
  'flags.output-dir.summary',
  'flags.apex-dir.summary',
]);

export type DxdirResetResult = {
  path: string;
};

export default class DxdirReset extends SfCommand<DxdirResetResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    'output-dir': Flags.directory({
      summary: messages.getMessage('flags.output-dir.summary'),
      char: 'o',
      required: true,
      exists: true,
      default: 'force-app/main/default/classes',
    }),
    'apex-dir': Flags.directory({
      summary: messages.getMessage('flags.apex-dir.summary'),
      char: 'd',
      required: true,
      exists: true,
      default: 'force-app/main/default/classes',
    }),
  };

  public async run(): Promise<DxdirResetResult> {
    const { flags } = await this.parse(DxdirReset);

    const apexDir = flags['apex-dir'];
    const outputDir = flags['output-dir'];
    reset(apexDir, outputDir);

    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/reset.ts',
    };
  }
}

export function reset(apexDir, outputDir) {
  deleteFiles(apexDir, outputDir);

  if (foldersToDelete.length > 0) {
    foldersToDelete.forEach((folder) => {
      fsExtra.removeSync(folder);
    });
  }
}

function deleteFiles(apexDir, outputDir) {
  const files = fs.readdirSync(apexDir);

  for (let file of files) {
    const filePath = path.join(apexDir, file);

    if (fs.statSync(filePath).isDirectory()) {
      foldersToDelete.push(filePath);
      deleteFiles(filePath, outputDir);
    } else {
      const newFilePath = path.join(outputDir, file);
      fs.renameSync(filePath, newFilePath);
    }
  }
}
