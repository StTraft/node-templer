import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import rimraf from 'rimraf'

export default () => {
  const projectDir = path.resolve(process.cwd())
  const tempDir = path.resolve(projectDir, '.temp')
  fs.mkdir(tempDir, {mode: 0o744}, err => {
    if (err && err.code === 'EEXIST') {
      const question = {
        type: 'confirm',
        name: 'reinit',
        default: false,
        message: 'Template folder `.temp` is already exist in this project. Do you want to re-initialize it?',
      }
      inquirer
        .prompt(question)
        .then(ans => {
          if (ans.reinit) {
            rimraf(tempDir, err => {
              if (err) {
                console.log(err)
                process.exit(1)
              }
              fs.mkdir(tempDir, {mode: 0o744}, err => {
                console.log(err)
                process.exit(1)
              })
              console.log(chalk.white('.temp folder has been re-initialized!'))
              process.exit(0)
            })
          }
          else {
            console.log(chalk.white('.temp remain!'))
          }
        })
    }
    else {
      console.log(chalk.white('.temp folder is created for this project!'))
    }
  })
  
}