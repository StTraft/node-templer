"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _rimraf = _interopRequireDefault(require("rimraf"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  var projectDir = _path.default.resolve(process.cwd());

  var tempDir = _path.default.resolve(projectDir, '.temp');

  _fs.default.mkdir(tempDir, {
    mode: 484
  }, function (err) {
    if (err && err.code === 'EEXIST') {
      var question = {
        type: 'confirm',
        name: 'reinit',
        default: false,
        message: 'Template folder `.temp` is already exist in this project. Do you want to re-initialize it?'
      };

      _inquirer.default.prompt(question).then(function (ans) {
        if (ans.reinit) {
          (0, _rimraf.default)(tempDir, function (err) {
            if (err) {
              console.log(err);
              process.exit(1);
            }

            _fs.default.mkdir(tempDir, {
              mode: 484
            }, function (err) {
              console.log(err);
              process.exit(1);
            });

            console.log(_chalk.default.white('.temp folder has been re-initialized!'));
            process.exit(0);
          });
        } else {
          console.log(_chalk.default.white('.temp remain!'));
        }
      });
    } else {
      console.log(_chalk.default.white('.temp folder is created for this project!'));
    }
  });
};

exports.default = _default;