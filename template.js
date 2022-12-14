let presetsData = Array()
let presetNames = Array()
let diffModes = Array()
let pdfName = ''
const PRESETS_DATA_KEY = 'presetsData'
const PRESETS_NAMES_KEY = 'presetNames'
const DIFFMODES_NAMES_KEY = 'diffModes'
const PDF_NAME = 'pdfName'

main()

function iOS() {
  return [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)
  || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

async function terribleImport(){
    const response = await fetch('./html2pdf/html2pdf.js')
    const text = await response.text()
    eval(text)
}

async function main() {
    terribleImport()
    loadData()
    generateHTML()
}

function loadData() {
    presetsData = JSON.parse(localStorage.getItem(PRESETS_DATA_KEY))
    presetNames = JSON.parse(localStorage.getItem(PRESETS_NAMES_KEY))
    diffModes = JSON.parse(localStorage.getItem(DIFFMODES_NAMES_KEY))
    pdfName = JSON.parse(localStorage.getItem(PDF_NAME))
    pdfName = pdfName.endsWith('.pdf') ? `${pdfName}` : `${pdfName}.pdf`
}

function setFieldValue(cell, value) {
    let label = document.createElement('div')
    label.textContent = value
    label.className = 'handle-label'
    cell.appendChild(label)
}

function getValue(preset, side, y, x) {
    let current = x? presetsData[preset][side][y][x] : presetsData[preset][side][y]

    if (!diffModes[preset]) {
        return current ? '✖' : ''
    }
    else {
        if (preset === 0) {
            return current ? '➕' : ''
        }

        let previous = x? presetsData[preset-1][side][y][x] : presetsData[preset-1][side][y]
        if (previous === current) {
            return ''
        }
        return previous ? '➖' : '➕'
    }
}

function fillMainPanel(side, preset)
{
    let container = document.getElementById(`container-${preset}`)

    const sideMainPanel = container.querySelector(`#${side}-side-panel`)
    let rows = sideMainPanel.children[0].children

    for (let row=0; row < rows.length; row++) {
        let cells = rows[row].children

        for (let column=0; column < cells.length; column++) {
            let value = getValue(preset, side, row+1, column+1)
            setFieldValue(cells[column], value)

        }
    }
}

function fillCopels(preset){
    let container = document.getElementById(`container-${preset}`)

    const ow = container.querySelector('#ow')
    const rp = container.querySelector('#rp')

    setFieldValue(ow, getValue(preset, 'coples', 'ow', null))
    setFieldValue(rp, getValue(preset, 'coples', 'rp', null))
}

function fillPositiv(side, preset){
    let container = document.getElementById(`container-${preset}`)

    let delta = side === 'left' ? 1 : 2
    const sidePositivPanel = container.querySelector(`#${side}-side-positiv`)
    let row = sidePositivPanel.children[0].children[0]

    let cells = row.children

    for (let column=0; column < cells.length; column++) {
        let value = getValue(preset, side, 7, column+delta)
        setFieldValue(cells[column], value)
    }
}

function fillPresetName(preset){
    let container = document.getElementById(`container-${preset}`)
    const label = container.querySelector('.preset-name')
    let name = presetNames[preset] + (diffModes[preset] ? ' (+/-)' : '')
    label.textContent = name
}

async function generateHTML() {
    let presetCount = presetsData.length
    if (!presetCount || presetCount < 1) {
        alert('Problem with data, clear browser localstorage and try again.')
        return
    }
    if (presetCount > 1) {
        let container = document.getElementById('container-0')
        let page_num = 1
        for (let i=1; i< presetCount; i++){
            let newContainer = container.cloneNode(true)
            newContainer.setAttribute('id', `container-${i}`)
            if (i % 3 === 2 && presetCount - 1 !== i){
                let divPageBreak = document.createElement('div')
                divPageBreak.className = 'html2pdf__page-break'
                let page_num_h2 = document.createElement('h2')
                page_num_h2.innerHTML = `${pdfName}: Page ${page_num}.`
                page_num++
                newContainer.appendChild(page_num_h2)
                newContainer.appendChild(divPageBreak)
            }
            if (presetCount - 1 === i){
                let page_num_h2 = document.createElement('h2')
                page_num_h2.innerHTML = `${pdfName}: Page ${page_num}.`
                page_num++
                newContainer.appendChild(page_num_h2)
            }

            container.parentNode.appendChild(newContainer)
        }
    }

    for (let i=0; i< presetCount; i++){
        fillMainPanel('left', i)
        fillMainPanel('right', i)
        fillPositiv('left', i)
        fillPositiv('right', i)
        fillCopels(i)
        fillPresetName(i)
    }

    //const fileName = `Registration-presets-${new Date().toLocaleString().replace(',', '').replace(' ', '-')}.pdf`
    let fileName = pdfName

    const optIOS = {
        image: {
          type: "jpeg",
          quality: 1.0,
        },
        html2canvas: {
          scale: 1.5,
          dpi: 192,
          letterRendering: true,
          allowTaint: true,
        },
        jsPDF: {
          unit: "mm",
          format: [297, 210],
          orientation: "portrait",
          compress: true,
        },
        pagebreak: { mode: 'legacy'},
        filename: fileName,
    }
    const optNonIOS = {
        pagebreak: { mode: 'legacy'},
        html2canvas:  { scale: 4 },
        filename: fileName,
    }
    const opt = iOS() ? optIOS : optNonIOS;
    const element = document.body

    const downloadPdf = (pdf) => {
        let link = document.createElement('a');
        link.target = '_blank';
        link.href = pdf.output('bloburl');
        link.download = fileName;
        link.click();
        link.remove();
    }

    await html2pdf().from(element)
          .set(opt)
          .toPdf()
          .get('pdf')
          .then((pdf) => downloadPdf(pdf));

    if (!iOS()){
        window.location.href = "./index.html"
    }
}