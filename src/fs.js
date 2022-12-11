const fs = require('fs')
const path = require('path')


// debugger
const content =  fs.readFileSync(path.resolve(__dirname, '../files/test/gbk/8.txt'))
console.log(content)
// debugger