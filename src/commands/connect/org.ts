import { SfCommand, Flags } from '@salesforce/sf-plugins-core';
import { Messages, AuthInfo, Connection } from '@salesforce/core';
import { QueryResult } from 'jsforce';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.load('dxfolders', 'connect.org', [
  'summary',
  'description',
  'examples',
  'flags.username.summary',
]);

export type ConnectOrgResult = QueryResult<{ Name: string; Id: string }>;

export default class ConnectOrg extends SfCommand<ConnectOrgResult> {
  public static readonly summary = messages.getMessage('summary');
  public static readonly description = messages.getMessage('description');
  public static readonly examples = messages.getMessages('examples');

  public static readonly flags = {
    username: Flags.string({
      summary: messages.getMessage('flags.username.summary'),
      char: 'u',
      required: true,
    }),
  };

  public async run(): Promise<ConnectOrgResult> {
    const { flags } = await this.parse(ConnectOrg);

    // this.log(`Connecting to ${flags.username}...`);

    const authInfo = await AuthInfo.create({ username: flags.username });

    const connection = await Connection.create({ authInfo });
    this.log(`Connected to ${flags.username} `);
    this.log(authInfo.getFields().orgId);

    const result = await connection.query<{ Name: string; Id: string }>('SELECT Id, Name FROM Account');

    // Log the results
    if (result.records.length > 0) {
      // this.log('Found the following Accounts:');
      for (const record of result.records) {
        // this.log(`  • ${record.Name}: ${record.Id}`);
      }
    } else {
      // this.log('No Accounts found.');
    }
    return result;
  }
}
