# summary

Undoes the results of the previews command, i.e it flattens whatever structure you have in the target directory.

# description

This command goes through any subfolder in the target directory, and moves recursively moves the files to a target directory, thus undoing the result of the `sf dxdir arrange` command.

You should use this is you want to revert to having all apex classes in a single directory.

# flags.name.summary

Description of a flag.

# examples

- <%= config.bin %> <%= command.id %>

# flags.output-dir.summary

The desired location of the flattened apex files.

# flags.apex-dir.summary

The current location of the apex folders and subfolders.
