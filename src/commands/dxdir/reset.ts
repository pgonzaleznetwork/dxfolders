/* eslint-disable */
import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
const path = require('path');
const fs = require('fs');

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
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      char: 'n',
      required: false,
    }),
    'output-dir': Flags.directory({
      summary: messages.getMessage('flags.output-dir.summary'),
      char: 'o',
      required: true,
      exists: true,
    }),
    'apex-dir': Flags.directory({
      summary: messages.getMessage('flags.apex-dir.summary'),
      char: 'd',
      required: true,
      exists: true,
    }),
  };

  public async run(): Promise<DxdirResetResult> {
    const { flags } = await this.parse(DxdirReset);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from /Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/reset.ts`);
    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/reset.ts',
    };
  }
}

export function reset(apexDir, outputDir) {
  const files = fs.readdirSync(apexDir);

  // Loop through the files
  for (let file of files) {
    const filePath = path.join(apexDir, file);

    if (fs.statSync(filePath).isDirectory()) {
      reset(filePath, outputDir);
    } else {
      const newFilePath = path.join(outputDir, file);
      fs.renameSync(filePath, newFilePath);
    }
  }
}
