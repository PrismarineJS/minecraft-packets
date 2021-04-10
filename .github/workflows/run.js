// This is used by the manual.yml workflow to delete all folders in a parent folder of the current directory that have the same as folders in the current working directory

const fs = require('fs')
const fsP = require('fs').promises
const path = require('path')

const res = fs.readdirSync('.')
  .filter(o => !o.startsWith('.'))
  .forEach(async (o) => {
    try {
      const res1 = await fsP.access(path.join('..', o))
      console.log(path.join('..', o))
      fsP.rmdir(path.join('..', o), { recursive: true })
    } catch (err) {
      console.log(err)
    }
  })
