# summary

Arranges your apex classes based on their prefix

# description

This command goes through all apex class files on a given location and reorganises them based on their prefix (if any).

For example, if you have the following classes:

- `SRM_Deployer.cls`
- `SRM_DeployerTests.cls`
- `Account_Service.cls`
- `Account_ServiceTests.cls`

You will end up with the following folders

- SRM
  - src
  - tests
- Account
  - src
  - tests

And the classes will be moved to those folders, taking into account whether they are tests classes.

# flags.name.summary

Description of a flag.

# examples

- <%= config.bin %> <%= command.id %>

# flags.apex-dir.summary

The directory where your apex class files are located.
