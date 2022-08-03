let presetsData = Array()
let presetNames = Array()
const PRESETS_DATA_KEY = 'presetsData'
const PRESETS_NAMES_KEY = 'presetNames'
main()

async function main() {
    loadData()
    generateHTML()
}

function loadData() {
    presetsData = JSON.parse(localStorage.getItem(PRESETS_DATA_KEY))
    presetNames = JSON.parse(localStorage.getItem(PRESETS_NAMES_KEY))

}

function setFieldValue(cell, value) {
    let label = document.createElement('div')
    label.textContent = 'X'
    label.className = 'handle-label'
    // cell.style.backgroundColor = "grey"
    cell.appendChild(label)
}

function setEmptyValue(cell, value) {
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
                setFieldValue(cells[column], null)
            }
            else {
                setEmptyValue(cells[column], null)
            }
        }
    }
}

function fillCopels(preset){
    let container = document.getElementById(`container-${preset}`)

    const ow = container.querySelector('#ow')
    const rp = container.querySelector('#rp')
    if (presetsData[preset].coples.ow){

            setFieldValue(ow, null)
    }
    if (presetsData[preset].coples.rp){
            setFieldValue(rp, null)
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
            setFieldValue(cells[column], null)
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



    // fillMainPanel('left')
    // fillMainPanel('right')
    // fillPositiv('left')
    // fillPositiv('right')
    // fillCopels()

    // const data = presetsData[0].left.slice(1,6)

    // console.log(data)
    // data.forEach(rowData => {
    //     const rowElement = document.createElement('tr')
    //     leftMainRegisterTable.appendChild(rowElement)
    //
    //     rowData.slice(1,7).forEach(cellData => {
    //         const cellElement = document.createElement('td')
    //         const dataTextNode = document.createTextNode(cellData)
    //         cellElement.appendChild(dataTextNode)
    //         rowElement.appendChild(cellElement)
    //     })
    // })
}