import path from 'path'
import fs from 'fs'
import xlsx from 'node-xlsx'
import axios from 'axios'

interface item {
  hfc: string
  name: string
}

const workSheetsFromFile = xlsx.parse(path.join(__dirname, '../assets/data.xlsx'))
const HFCs = Array.from(new Set(workSheetsFromFile[0].data.slice(1).flat()))

run()

function generateExcels(data: item[]) {
  const header = ['HFC', '标签']
  const data2 = [header, ...data.map(item => ([item.hfc, item.name]))]

  const buffer = xlsx.build([{ name: 'mySheetName', data: data2 }])
  fs.writeFileSync('./myFile.xlsx', Buffer.from(buffer))
}

async function run() {
  const data = await axios.get('http://172.20.31.55:8080/data/getresult', {
    data: HFCs,
  })
  generateExcels(data.data)
}
