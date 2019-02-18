#! /usr/bin/env node
"use strict";

var _chalk = _interopRequireDefault(require("chalk"));

var _figlet = _interopRequireDefault(require("figlet"));

var _init = _interopRequireDefault(require("./init"));

var _create = _interopRequireDefault(require("./create"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = require('yargs').demandCommand(1).command('init', 'Initialize templer to the project.').command('create <temp> [vars..]', 'Create templates defined in .temp folders.', function (yargs) {
  yargs.positional('temp', {
    describe: 'Template folder name in .temp',
    type: 'string'
  });
}).default('r', 'src').alias('r', 'root').describe('r', 'Set base folder of templates to be created.').default('e', 'utf8').alias('r', 'encoding').describe('e', 'Set file encoding.').help().argv;

console.log(_chalk.default.blue(_figlet.default.textSync('Templer', {})));

switch (argv._[0]) {
  case 'init':
    (0, _init.default)();
    break;

  case 'create':
    (0, _create.default)(argv);
    break;

  default:
    process.exit(1);
}