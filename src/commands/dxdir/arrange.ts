import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

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

    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/arrange.ts',
    };
  }
}
