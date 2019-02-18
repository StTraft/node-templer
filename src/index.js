#! /usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import initTemp from './init'
import createTemp from './create'

const argv = require('yargs')
  .demandCommand(1)
  .command('init', 'Initialize templer to the project.')
  .command('create <temp> [vars..]', 'Create templates defined in .temp folders.', yargs => {
    yargs.positional('temp', {
      describe: 'Template folder name in .temp',
      type: 'string',
    })
    yargs.positional('vars', {
      describe: 'Variables to be replace in template.',
      type: 'string',
    })
    yargs.example('$0 create temp name=bar foo=ok', 'Create template while temp file has 2 variables: %%name%% and %%foo%%')
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
