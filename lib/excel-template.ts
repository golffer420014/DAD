import ExcelJS from 'exceljs'

const TEMPLATE_URL = '/templates/forward-template.xlsx'

// Layout of public/templates/forward-template.xlsx (see scripts that built it):
// row 1 = header, row 2 = one blank data row kept as a style reference,
// row 3 = the "ยอดรวม" label, row 4 = the "Total/ รวม" totals row.
const DATA_START_ROW = 2

// Mirrors the layout every ลูกข่าย โพย file already uses (see docs/*.xlsx):
// เลข / บน / ล่าง / โต๊ด header, then a "ยอดรวม" label row followed by a
// "Total/ รวม" row with the summed totals — so the forwarded file reads
// the same way any โพย the upline already gets does. Formatting (colors,
// borders) lives entirely in the template file, not in this code — edit
// public/templates/forward-template.xlsx directly to restyle it.
export const downloadForwardExcel = async (
  rows: { number: string; top: number; bottom: number; tod: number }[],
  filename = 'ส่งต่อ.xlsx',
) => {
  const templateBuffer = await fetch(TEMPLATE_URL).then((res) => res.arrayBuffer())
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(templateBuffer)
  const sheet = workbook.getWorksheet(1)
  if (!sheet) throw new Error('forward-template.xlsx has no worksheet')

  if (rows.length > 1) sheet.duplicateRow(DATA_START_ROW, rows.length - 1, true)

  rows.forEach((row, index) => {
    const sheetRow = sheet.getRow(DATA_START_ROW + index)
    sheetRow.getCell(1).value = row.number
    sheetRow.getCell(2).value = row.top
    sheetRow.getCell(3).value = row.bottom
    sheetRow.getCell(4).value = row.tod
  })

  const totalRow = sheet.getRow(DATA_START_ROW + rows.length + 1)
  const sumTop = rows.reduce((sum, r) => sum + r.top, 0)
  const sumBottom = rows.reduce((sum, r) => sum + r.bottom, 0)
  const sumTod = rows.reduce((sum, r) => sum + r.tod, 0)
  totalRow.getCell(2).value = sumTop
  totalRow.getCell(3).value = sumBottom
  totalRow.getCell(4).value = sumTod
  totalRow.getCell(5).value = sumTop + sumBottom + sumTod

  const buffer = await workbook.xlsx.writeBuffer()
  const url = URL.createObjectURL(
    new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
  )
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
