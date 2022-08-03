let presetsData = Array()
let presetNames = Array()
const PRESETS_DATA_KEY = 'presetsData'
const PRESETS_NAMES_KEY = 'presetNames'
main()

async function terribleImport(){
    const response = await fetch('./html2pdf.js')
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

}

function setFieldValue(cell, value) {
    let label = document.createElement('div')
    label.textContent = value
    label.className = 'handle-label'
    cell.appendChild(label)
}

function setEmptyValue(cell) {
    let label = document.createElement('div')
    label.textContent = ''
    label.className = 'handle-label'
    cell.appendChild(label)
}

function fillMainPanel(side, preset)
{
    let container = document.getElementById(`container-${preset}`)

    const sideMainPanel = container.querySelector(`#${side}-side-panel`)
    let rows = sideMainPanel.children[0].children

    for (let row=0; row < rows.length; row++) {
        let cells = rows[row].children

        for (let column=0; column < cells.length; column++) {
            if (presetsData[preset][side][row+1][column+1]){
                setFieldValue(cells[column], 'X')
            }
            else {
                setEmptyValue(cells[column])
            }
        }
    }
}

function fillCopels(preset){
    let container = document.getElementById(`container-${preset}`)

    const ow = container.querySelector('#ow')
    const rp = container.querySelector('#rp')
    if (presetsData[preset].coples.ow){

        setFieldValue(ow, 'X')
    }
    else {
        setEmptyValue(ow)
    }
    if (presetsData[preset].coples.rp){
            setFieldValue(rp, 'X')
    }
    else {
        setEmptyValue(rp)
    }
}

function fillPositiv(side, preset){
    let container = document.getElementById(`container-${preset}`)

    let delta = side === 'left' ? 1 : 2
    const sidePositivPanel = container.querySelector(`#${side}-side-positiv`)
    let row = sidePositivPanel.children[0].children[0]

    let cells = row.children

    for (let column=0; column < cells.length; column++) {
        if (presetsData[preset][side][7][column+delta]){
            setFieldValue(cells[column], 'X')
        }
        else {
            setEmptyValue(cells[column])
        }
    }

}

function fillPresetName(preset){
    let container = document.getElementById(`container-${preset}`)
    const label = container.querySelector('.preset-name')
    label.textContent = presetNames[preset]

}

function generateHTML() {
    let presetCount = presetsData.length
    if (!presetCount || presetCount < 1) {
        alert('Problem with data, clear browser localstorage and try again.')
        return
    }
    if (presetCount > 1) {
        let container = document.getElementById('container-0')
        for (let i=1; i< presetCount; i++){
            let newContainer = container.cloneNode(true)
            newContainer.setAttribute('id', `container-${i}`)
            if (i % 3 === 2 && presetCount - 1 !== i){
                let divPageBreak = document.createElement('div')
                divPageBreak.className = 'html2pdf__page-break'
                newContainer.appendChild(divPageBreak)
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

    var element = document.body
    html2pdf().set({
      pagebreak: { mode: 'legacy'}
    });
    html2pdf(element, {html2canvas:  { scale: 4 }})

}