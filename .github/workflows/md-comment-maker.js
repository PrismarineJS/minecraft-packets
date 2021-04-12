const { join } = require('path')
const mcData = require('minecraft-data') // NEED TO GLOBALLY INSTALL
const { readdirSync, writeFileSync } = require('fs')

const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const makeDropdownStart = (name, arr) => {
  arr.push(`<details><summary>${name}</summary>`)
  arr.push('<p>')
  arr.push('')
}
const makeDropdownEnd = (arr) => {
  arr.push('')
  arr.push('</p>')
  arr.push('</details>')
}

const versionFolders = getDirectories('.')
  .filter(o => o !== 'node_modules')
  .sort((a, b) => {
    if (a === b) {
      return 0
    } else if (mcData(a).isNewerOrEqualTo(b)) {
      return 1
    } else {
      return -1
    }
  })

const data = {}

versionFolders.forEach(x => {
  data[x] = require(join(process.cwd(), x, 'metadata', 'packets_info.json'))
})

const packetNames = new Set()

Object.values(data).forEach(({ collected, missing }) => {
  collected.forEach(x => packetNames.add(x))
  missing.forEach(x => packetNames.add(x))
})

const str = []

makeDropdownStart('Packet Coverage Graph', str)

str.push('| Packet Name |' + (versionFolders.map(x => ` ${x} `).join('|') + '|'))
str.push('| --- |' + versionFolders.map(() => '---').join('|') + '|')

Array.from(packetNames).forEach((packetName) => {
  str.push(`| ${packetName} |` + (Object.values(data).map((packetInfo) => hasPacketMapper(packetInfo, packetName)).map(x => ` ${x} `).join('|')) + '|')
})

function hasPacketMapper ({ collected, missing }, packet) {
  if (collected.includes(packet)) {
    return '✔️'
  } else if (missing.includes(packet)) {
    return '❌'
  }
  return ' '
}

makeDropdownEnd(str)

makeDropdownStart('Packet Coverage Stats', str)
const getPercentage = ver => (data[ver].collected.length / (data[ver].collected.length + data[ver].missing.length)) * 100
const getTotalX = type => Object.values(data).reduce((acc, current) => { return acc + current[type].length }, 0)
const getTotalPercent = `${(getTotalX('collected') / (getTotalX('collected') + getTotalX('missing')) * 100).toFixed(0)}%`

str.push('| Version | Coverage % |')
str.push('| --- | --- |')
const versionPercentages = versionFolders
  .map(x => `| ${x} | ${getPercentage(x).toFixed(0)}% |`)
str.push(...versionPercentages)
// total
str.push('| | |')
str.push(`| Average | ${getTotalPercent} |`)

makeDropdownEnd(str)

writeFileSync('README.md', str.join('\n'))