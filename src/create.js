import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { Transform } from 'stream'

const createInjectName = replaceObj =>
  new Transform({
    transform(chunk, encode, done) {
      this.push( Object.keys(replaceObj).reduce((res, key) =>
          res
          .replace(new RegExp(`%%${key}%%`, 'g'), replaceObj[key])
      , chunk.toString()
      ))
      done()
    }
  })

// using in forEach loop
const createTemp = (srcDir, distDir, abbrs) => dirOrFileName => {
  const srcPath = path.resolve(srcDir, dirOrFileName)

  // case dir
  if (fs.lstatSync(srcPath).isDirectory()) {
    const newDistDir = path.resolve(distDir, dirOrFileName)
    try {
      fs.mkdirSync(newDistDir, {recursive: true})
      fs.readdirSync(srcPath).forEach(
        createTemp(srcPath, newDistDir, abbrs)
      )
    }
    catch(err) {
      if (err.code === 'EEXIST') {
        console.log(chalk.red(`${dirOrFileName} is already exist in ${distDir}. Create of template ${dirOrFileName} is skipped!`))
      }
    }
    finally {
      return
    }
  }

  // case file
  const distFilePath = path.resolve(
    distDir,
    dirOrFileName.slice(0, dirOrFileName.lastIndexOf('.'))
  )
  const inStream = fs.createReadStream(srcPath)
  const outStream = fs.createWriteStream(distFilePath, {
    flags: 'wx+',
    encoding: 'utf8'
  })

  const injectName = createInjectName(abbrs)

  inStream
    .pipe(injectName)
    .pipe(outStream)
    .on('finish', () => console.log(chalk.blue(`${distFilePath} created!`)))
    .on('error', err => {
      console.log(chalk.red(err))
      process.exit(1)
    })
}

export default (argv) => {
  const srcPath = path.resolve(process.cwd(), '.temp', argv.temp)
  const distPath = path.resolve(process.cwd(), argv.root, argv.temp)
  try {
    fs.mkdirSync(distPath)
  }
  catch (err) {
    if (err.code === 'EEXIST') {
      console.log(chalk.red(`Template ${argv.temp} is already exist in '${argv.root}' directory. Creation of template '${argv.temp}' is skipped!`))
      process.exit(0)
    }
  }
  
  const abbrs = argv.vars.reduce((res, keyValue) => {
    const [ key, value ] = keyValue.split('=')
    if (!value || !key) throw new Error('Invalid arguments')
    return {
      ...res,
      [key]: value
    }
  }, {})

  fs.readdirSync(srcPath).forEach(
    createTemp(srcPath, distPath, {
      name: argv.temp,
      ...abbrs,
    })
  )
}
