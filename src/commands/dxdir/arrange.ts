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
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      char: 'n',
      required: false,
    }),
    'apex-dir': Flags.directory({
      summary: messages.getMessage('flags.apex-dir.summary'),
      char: 'd',
      exists: true,
    }),
  };

  public async run(): Promise<DxdirArrangeResult> {
    const { flags } = await this.parse(DxdirArrange);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from /Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/arrange.ts`);
    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/arrange.ts',
    };
  }
}
