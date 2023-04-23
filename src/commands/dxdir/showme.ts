import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'dxdir.showme', [
  'summary',
  'description',
  'examples',
  'flags.name.summary',
]);

export type DxdirShowmeResult = {
  path: string;
};

export default class DxdirShowme extends SfCommand<DxdirShowmeResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    name: Flags.string({
      summary: messages.getMessage('flags.name.summary'),
      char: 'n',
      required: false,
    }),
  };

  public async run(): Promise<DxdirShowmeResult> {
    const { flags } = await this.parse(DxdirShowme);

    const name = flags.name ?? 'world';
    this.log(`hello ${name} from /Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/showme.ts`);
    return {
      path: '/Users/pgonzalez/Documents/apps/sfplugin/dxfolders/src/commands/dxdir/showme.ts',
    };
  }
}
