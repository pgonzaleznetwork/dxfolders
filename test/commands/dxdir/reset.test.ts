/* eslint-disable */

const mock = require('mock-fs');
const fs = require('fs');
const reset = require('../../../src/commands/dxdir/reset').reset;

describe('All reset tests', () => {
  const DEFAULT_PATH = 'force-app/main/default/classes/';

  beforeEach(async () => {
    mock(project);
    reset(DEFAULT_PATH, DEFAULT_PATH);
  });

  test('All files are added to the same target dir', async () => {
    let files = [
      `${DEFAULT_PATH}SRM_deployer.cls`,
      `${DEFAULT_PATH}SRM_deployer.cls-meta.xml`,
      `${DEFAULT_PATH}SRM_deployerTest.cls`,
      `${DEFAULT_PATH}SRM_deployerTest.cls-meta.xml`,
      `${DEFAULT_PATH}Domain_AccountService.cls`,
      `${DEFAULT_PATH}Domain_AccountService.cls-meta.xml`,
      `${DEFAULT_PATH}Domain_AccountService_Test.cls`,
      `${DEFAULT_PATH}Domain_AccountService_Test.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist at specified location`).toEqual(true);
    });
  });

  afterEach(() => {
    mock.restore();
  });
});

const project = {
  'force-app': {
    main: {
      default: {
        classes: {
          SRM: {
            src: {
              'SRM_deployer.cls': '',
              'SRM_deployer.cls-meta.xml': '',
            },
            __tests__: {
              'SRM_deployerTest.cls': '',
              'SRM_deployerTest.cls-meta.xml': '',
            },
          },
          Domain: {
            src: {
              'Domain_AccountService.cls': '',
              'Domain_AccountService.cls-meta.xml': '',
            },
            __tests__: {
              'Domain_AccountService_Test.cls': '',
              'Domain_AccountService_Test.cls-meta.xml': '',
            },
          },
        },
      },
    },
  },
};
