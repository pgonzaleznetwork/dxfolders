/* eslint-disable */
//import { expect, test } from '@oclif/test';
import { expect as oExpect } from '@oclif/test';
import { test as oTest } from '@oclif/test';

const mock = require('mock-fs');
const fs = require('fs');
const reoderFiles = require('../../../src/commands/dxdir/arrange').reoderFiles;

describe('All tests', () => {
  const DEFAULT_PATH = 'force-app/main/default/classes/';

  beforeAll(async () => {
    mock(project);
    await reoderFiles();
  });

  test('Top-level folders are created from prefixes', async () => {
    let stat = await fs.promises.stat(`${DEFAULT_PATH}SRM`);

    expect(stat.isDirectory()).toEqual(true);
  });

  test('A "src" folder is created under top-level prefix folder', async () => {
    let stat = await fs.promises.stat(`${DEFAULT_PATH}SRM/src`);

    expect(stat.isDirectory()).toEqual(true);
  });

  test(`A "__tests__" folder is created under top-level prefix folder when there are
         prefixed classes that contain the word "test"`, async () => {
    let stat = await fs.promises.stat(`${DEFAULT_PATH}SRM/__tests__`);

    expect(stat.isDirectory()).toEqual(true);
  });

  test(`The "__tests__" folder shouldnt be created if there arent any test classes for that prefix`, async () => {
    expect(fs.existsSync(`${DEFAULT_PATH}Domain/__tests__`), `${DEFAULT_PATH}Domain/__tests__ shouldnt exist`).toEqual(
      false
    );
  });

  test(`Both the .cls and .cls-meta.xml files for non-test classes should be moved
    to the "src" folder under the correct prefix"`, async () => {
    let files = [
      `${DEFAULT_PATH}SRM/src/SRM_deployer.cls`,
      `${DEFAULT_PATH}SRM/src/SRM_deployer.cls-meta.xml`,
      `${DEFAULT_PATH}SRM/src/SRM_retrieve.cls`,
      `${DEFAULT_PATH}SRM/src/SRM_retrieve.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  test(`Classes that have a prefix that contains the word "test" should not be ignored, i.e Testim_AccountSync should create Testim as a domain folder`, async () => {
    let files = [
      `${DEFAULT_PATH}Testim/src/Testim_AccountSync.cls`,
      `${DEFAULT_PATH}Testim/src/Testim_AccountSync.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  test(`Both the .cls and .cls-meta.xml files for test classes should be moved
    to the "__tests__" folder under the correct prefix)"`, async () => {
    let files = [
      `${DEFAULT_PATH}SRM/__tests__/SRM_deployerTest.cls`,
      `${DEFAULT_PATH}SRM/__tests__/SRM_deployerTest.cls-meta.xml`,
      `${DEFAULT_PATH}SRM/__tests__/SRM_retrieve_Test.cls`,
      `${DEFAULT_PATH}SRM/__tests__/SRM_retrieve_Test.cls-meta.xml`,
      `${DEFAULT_PATH}SRM/__tests__/SRM_configure_Tests.cls`,
      `${DEFAULT_PATH}SRM/__tests__/SRM_configure_Tests.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  test(`The Test_ prefix (i.e. Test_PdfCreateService.cls) should not create a Test top-level folder`, async () => {
    expect(fs.existsSync(`${DEFAULT_PATH}Test`), `${DEFAULT_PATH}Test shouldnt exist as a top-level directory`).toEqual(
      false
    );
  });

  test(`The _Test suffix (i.e. AccountService_Test[s].cls) should not create a top-level folder with the string before the suffix (i.e AccountService)`, async () => {
    expect(
      fs.existsSync(`${DEFAULT_PATH}AccountService`),
      `${DEFAULT_PATH}AccountService shouldnt exist as a top-level directory`
    ).toEqual(false);

    expect(
      fs.existsSync(`${DEFAULT_PATH}LeadService`),
      `${DEFAULT_PATH}LeadService shouldnt exist as a top-level directory`
    ).toEqual(false);
  });

  test(`Special identifiers [batch,triggerhandler,etc] should be created as folder inside the top-level domain folder (if it exists)`, async () => {
    let files = [
      `${DEFAULT_PATH}FFL/trigger_handlers/src/FFL_UnitOfWorkTriggerHandler.cls`,
      `${DEFAULT_PATH}FFL/trigger_handlers/src/FFL_UnitOfWorkTriggerHandler.cls-meta.xml`,
      `${DEFAULT_PATH}FFL/trigger_handlers/__tests__/FFL_UnitOfWorkTriggerHandler_Test.cls`,
      `${DEFAULT_PATH}FFL/trigger_handlers/__tests__/FFL_UnitOfWorkTriggerHandler_Test.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  test(`The src and __tests__ dir 
    shouln't be created if the only classes for that prefix are special identifiers.
    The special identifiers should be the only folders inside the top-level domain folder`, async () => {
    let invalidDirs = [`${DEFAULT_PATH}ForceDB/src`, `${DEFAULT_PATH}ForceDB/__tests__`];

    let validFiles = [
      `${DEFAULT_PATH}ForceDB/trigger_handlers/__tests__/ForceDB_AccountTriggerHandler_Test.cls`,
      `${DEFAULT_PATH}ForceDB/trigger_handlers/__tests__/ForceDB_AccountTriggerHandler_Test.cls-meta.xml`,
    ];

    invalidDirs.forEach((dir) => {
      expect(
        fs.existsSync(dir),
        `${dir} should not exist because there are no classes for that prefix that are not special identifiers`
      ).toEqual(false);
    });

    validFiles.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  test(`Special identifiers [batch,triggerhandler,etc] should be created as top-level domain folder if they dont have a prefix`, async () => {
    let files = [
      `${DEFAULT_PATH}trigger_handlers/src/OpportunityTriggerHandler.cls`,
      `${DEFAULT_PATH}trigger_handlers/src/OpportunityTriggerHandler.cls-meta.xml`,
      `${DEFAULT_PATH}trigger_handlers/__tests__/OpportunityTriggerHandlerTests.cls`,
      `${DEFAULT_PATH}trigger_handlers/__tests__/OpportunityTriggerHandlerTests.cls-meta.xml`,
    ];

    files.forEach((file) => {
      expect(fs.existsSync(file), `${file} does not exist`).toEqual(true);
    });
  });

  afterAll(() => {
    mock.restore();
  });
});

const project = {
  'force-app': {
    main: {
      default: {
        classes: {
          'SRM_deployer.cls': '',
          'SRM_deployer.cls-meta.xml': '',

          'SRM_retrieve.cls': '',
          'SRM_retrieve.cls-meta.xml': '',

          'SRM_retrieve_Test.cls': `@IsTest
                                             private class MyTestClass{
                                            
                                            }`,
          'SRM_retrieve_Test.cls-meta.xml': '',

          'AccountService_Test.cls': `@istest
                                                private class MyTestClass{
                                            
                                            }`,
          'AccountService_Test.cls-meta.xml': '',

          'LeadService_Tests.cls': `@isTEST
                                            private class MyTestClass{
                                        
                                            }`,
          'LeadService_Tests.cls-meta.xml': '',

          'FFL_UnitOfWork.cls': '',
          'FFL_UnitOfWork.cls-meta.xml': '',

          'SRM_deployerTest.cls': `@isTEST
                                            private class MyTestClass{
                                        
                                            }`,
          'SRM_deployerTest.cls-meta.xml': '',

          'SRM_configure_Tests.cls': `@isTEST
                                                private class MyTestClass{
                                            
                                                }`,
          'SRM_configure_Tests.cls-meta.xml': '',

          'PdfCreateService.cls': '',
          'PdfCreateService.cls-meta.xml': '',

          'PdfCreateServiceHttpMock.cls': '',
          'PdfCreateServiceHttpMock.cls-meta.xml': '',

          'Test_PdfCreateService.cls': `@isTEST
                                                private class MyTestClass{
                                            
                                                }`,
          'Test_PdfCreateService.cls-meta.xml': '',

          'OpportunityTriggerHandler.cls': '',
          'OpportunityTriggerHandler.cls-meta.xml': '',

          'OpportunityTriggerHandlerTests.cls': `@isTEST
                                                        private class MyTestClass{
                                                    
                                                        }`,
          'OpportunityTriggerHandlerTests.cls-meta.xml': '',

          'FFL_UnitOfWorkTriggerHandler.cls': '',
          'FFL_UnitOfWorkTriggerHandler.cls-meta.xml': '',

          'FFL_UnitOfWorkTriggerHandler_Test.cls': `@isTEST
                                                            private class MyTestClass{
                                                        
                                                            }`,
          'FFL_UnitOfWorkTriggerHandler_Test.cls-meta.xml': '',

          'ForceDB_AccountTriggerHandler_Test.cls': `@isTEST
                                                            private class MyTestClass{
                                                        
                                                            }`,
          'ForceDB_AccountTriggerHandler_Test.cls-meta.xml': '',

          'Domain_Controller.cls': '',
          'Domain_Controller.cls-meta.xml': '',

          'TestimonialController.cls': '',
          'TestimonialController.cls-meta.xml': '',

          'Testim_AccountSync.cls': '',
          'Testim_AccountSync.cls-meta.xml': '',

          ExistingFolder: {
            'ExistingClass.cls': '',
            'ExistingClass.cls-meta.xml': '',
          },
        },
      },
    },
  },
};
