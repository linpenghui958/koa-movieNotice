import fs from 'fs'
import util from 'util'
import { resolve } from 'path'

const readFileAsync = util.promisify(fs.readFile)

async function init () {
  try {
    let data = await readFileAsync(resolve(__dirname, '../package.json'))
    data = JSON.parse(data)
    console.log(data.name)
  } catch (err) {
    console.log(err)
  }
}
init()