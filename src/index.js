#! /usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import initTemp from './init'
import createTemp from './create'

const argv = require('yargs')
  .demandCommand(1)
  .command('init', 'Initialize templer to the project.')
  .command('create <temp> <name> [vars..]', 'Create templates defined in .temp folders.', yargs => {
    yargs.positional('temp', {
      describe: 'Template folder name in .temp. Folder name is used to define the type of template to be created. e.g.: components, controllers.\n\nCaution: There must be a folder with name same as `temp` variable before using this command.',
      type: 'string',
    })
    yargs.positional('name', {
      describe: 'Name of the template to be created.',
      type: 'string',
    })
    yargs.positional('vars', {
      describe: 'Variables to be replace in template.',
      type: 'string',
    })
    yargs.example('$0 create components SomeComponent foo=bar dar=far', 'Create template while temp file has 2 variables: %%foo%% and %%dar%%')
  })
  .default('r', 'src')
  .alias('r', 'root')
  .describe('r', 'Set base folder of templates to be created.')
  .default('e', 'utf8')
  .alias('e', 'encoding')
  .describe('e', 'Set file encoding.')
  .help()
  .argv

console.log(chalk.blue(
  figlet.textSync('Templer', {
  })
))
switch (argv._[0]) {
  case 'init':
    initTemp()
    break
  case 'create':
    createTemp(argv)
    break
  default:
    process.exit(1)
}
