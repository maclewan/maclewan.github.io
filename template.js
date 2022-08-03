let presetsData = Array()
const PRESETS_DATA_KEY = 'presetsData'
main()

async function main() {
    loadData()
    generateHTML()
}

function loadData() {
    presetsData = JSON.parse(localStorage.getItem(PRESETS_DATA_KEY))
    // localStorage.removeItem(PRESETS_DATA_KEY)
}

function fillMainPanel(side, preset){
    let container = document.getElementById(`container-${preset}`)

    const sideMainPanel = container.querySelector(`#${side}-side-panel`)
    let rows = sideMainPanel.children[0].children

    for (let row=0; row < rows.length; row++) {
        let cells = rows[row].children

        for (let column=0; column < cells.length; column++) {
            if (presetsData[preset][side][row+1][column+1]){
                cells[column].style.backgroundColor = "grey"
            }
        }
    }
}

function fillCopels(preset){
    let container = document.getElementById(`container-${preset}`)

    const ow = container.querySelector('#ow')
    const rp = container.querySelector('#rp')
    if (presetsData[preset].coples.ow){
            ow.style.backgroundColor = "grey"
    }
    if (presetsData[preset].coples.rp){
            rp.style.backgroundColor = "grey"
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
            cells[column].style.backgroundColor = "grey"
        }
    }

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
    }



    fillMainPanel('left')
    fillMainPanel('right')
    fillPositiv('left')
    fillPositiv('right')
    fillCopels()

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