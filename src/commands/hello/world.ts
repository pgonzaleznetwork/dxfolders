import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'hello.world', [
  'summary',
  'description',
  'examples',
  'flags.name.summary',
  'info.hello',
]);

export type HelloWorldResult = {
  name: string;
  time: string;
};

export default class World extends SfCommand<HelloWorldResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static flags = {
    name: Flags.string({
      char: 'n',
      summary: messages.getMessage('flags.name.summary'),
      default: 'World',
    }),
  };

  public async run(): Promise<HelloWorldResult> {
    const { flags } = await this.parse(World);
    const time = new Date().toDateString();
    this.log(messages.getMessage('info.hello', [flags.name, time]));
    return {
      name: flags.name,
      time,
    };
  }
}
