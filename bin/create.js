"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _chalk = _interopRequireDefault(require("chalk"));

var _stream = require("stream");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var createInjectName = function createInjectName(replaceObj) {
  return new _stream.Transform({
    transform: function transform(chunk, encode, done) {
      console.log('replacement obj', replaceObj);
      this.push(Object.keys(replaceObj).reduce(function (res, key) {
        return res.replace(new RegExp("%%".concat(key, "%%"), 'g'), replaceObj[key]);
      }, chunk.toString())); // console.log('replacement:', replacement)
      // this.push(replacement)

      done();
    }
  });
}; // using in forEach loop


var createTemp = function createTemp(srcDir, distDir, abbrs) {
  return function (dirOrFileName) {
    var srcPath = _path.default.resolve(srcDir, dirOrFileName); // case dir


    if (_fs.default.lstatSync(srcPath).isDirectory()) {
      var newDistDir = _path.default.resolve(distDir, dirOrFileName);

      try {
        _fs.default.mkdirSync(newDistDir, {
          recursive: true
        });

        _fs.default.readdirSync(srcPath).forEach(createTemp(srcPath, newDistDir, abbrs));
      } catch (err) {
        if (err.code === 'EEXIST') {
          console.log(_chalk.default.red("".concat(dirOrFileName, " is already exist in ").concat(distDir, ". Create of template ").concat(dirOrFileName, " is skipped!")));
        }
      } finally {
        return;
      }
    } // case file


    var distFilePath = _path.default.resolve(distDir, dirOrFileName.slice(0, dirOrFileName.lastIndexOf('.')));

    var inStream = _fs.default.createReadStream(srcPath);

    var outStream = _fs.default.createWriteStream(distFilePath, {
      flags: 'wx+',
      encoding: 'utf8'
    });

    var injectName = createInjectName(abbrs);
    inStream.pipe(injectName).pipe(outStream).on('finish', function () {
      return console.log(_chalk.default.blue("".concat(distFilePath, " created!")));
    }).on('error', function (err) {
      console.log(_chalk.default.red(err));
      process.exit(1);
    });
  };
};

var _default = function _default(argv) {
  var srcPath = _path.default.resolve(process.cwd(), '.temp');

  var distPath = _path.default.resolve(process.cwd(), argv.root);

  var abbrs = argv.vars.reduce(function (res, keyValue) {
    var _keyValue$split = keyValue.split('='),
        _keyValue$split2 = _slicedToArray(_keyValue$split, 2),
        key = _keyValue$split2[0],
        value = _keyValue$split2[1];

    if (!value || !key) throw new Error('Invalid arguments');
    return _objectSpread({}, res, _defineProperty({}, key, value));
  }, {});
  console.log('abbrs', abbrs);
  console.log('argv pass in create:', argv);

  _fs.default.readdirSync(srcPath).forEach(createTemp(srcPath, distPath, _objectSpread({
    name: argv.temp
  }, abbrs)));
};

exports.default = _default;