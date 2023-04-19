import { SfCommand } from '@salesforce/sf-plugins-core';
import { Messages } from '@salesforce/core';
import got from 'got';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'call.external.service', ['summary', 'description', 'examples']);

export type CallExternalServiceResult = {
  text: string;
  number: number;
  found: boolean;
  type: string;
};

export default class CallExternalService extends SfCommand<CallExternalServiceResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public async run(): Promise<CallExternalServiceResult> {
    const result = await got<CallExternalServiceResult>(
      'http://numbersapi.com/random/trivia?json'
    ).json<CallExternalServiceResult>();

    this.log(result.text);

    return result;
  }
}
