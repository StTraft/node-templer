#! /usr/bin/env node
import chalk from 'chalk'
import figlet from 'figlet'
import initTemp from './init'

const argv = require('yargs')
  .demandCommand(1)
  .command('init', 'Initialize templer to the project.')
  .command('create <temp>', 'Create templates defined in .temp folders.')
  .default('r', 'src')
  .alias('r', 'root')
  .describe('r', 'Set base folder of templates to be created.')
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
    break
  default:
    process.exit(1)
}
