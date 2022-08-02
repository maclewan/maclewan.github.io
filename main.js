let data = []
let leftPanel = document.getElementById('left-side')
let rightPanel = document.getElementById('right-side')
let leftPanelButtons = []
let rightPanelButtons = []
let currentPreset = 0

let nameInput =

function setData(dataNew) {
    data = dataNew
}

async function loadData() {
    await fetch('./stops.json')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.log(error));
}

function generateCell(i, j, panel, panelButtons, dataSide) {

    let div = document.createElement('div');
    div.className = 'handle-div'
    div.style.gridColumnStart = `${i}`
    div.style.gridRowStart = `${j}`

    let newButton = document.createElement('button');
    newButton.onclick = function() {handleClicked(newButton)}
    newButton.style.gridColumnStart = `${i}`
    newButton.style.gridRowStart = `${j}`

    let buttonText = document.createTextNode('')
    newButton.appendChild(buttonText)

    let label = document.createElement('label');

    label.innerText = dataSide[j][i]

    div.appendChild(newButton)
    div.appendChild(label)

    panel.append(div)
    panelButtons.push(newButton)
}

function generateMainRegisters() {
    // left side
    for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 6; j++){
            generateCell(i, j, leftPanel, leftPanelButtons, data.left)
        }
    }

    // left positiv section
    for (let p = 1; p < 6; p++) {
        generateCell(p, 7, leftPanel, leftPanelButtons, data.left)

    }

    // right side
    for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 6; j++){
            generateCell(i, j, rightPanel, rightPanelButtons, data.right)
        }
    }

    //right positiv section
    for (let p = 2; p < 7; p++) {
        generateCell(p, 7, rightPanel, rightPanelButtons, data.right)
    }

}

async function main() {
    await loadData()
    generateMainRegisters()
    selectPreset(0)
}

main()

function toggleMenu() {
    let id = window.matchMedia('screen and (min-width:1100px)').matches ? "menu_desktop" : "menu_mobile"
    let menu = document.getElementById(id);
    console.log(id)
    if (menu.style.display === "none"){
        menu.style.display = "flex"
    }
    else {
        menu.style.display = "none"
    }
}

function handleClicked(button) {
    if (!document.getElementById('switch').checked){
        // state mode
        if(button.innerText === 'X') {
            button.innerText = ''
        }
        else {
            button.innerText = 'X'
        }
    }
    else {
        // diff mode
        if(button.innerText === '') {
            button.innerText = '+'
        }
        else if (button.innerText === '+') {
            button.innerText = '-'
        }
        else {
            button.innerText = ''
        }
    }
}

function clickedPreset(button) {
    let presetButtonsList = Array.from(document.getElementById('presets-container').children)
    let index = presetButtonsList.indexOf(button)
    currentPreset = index
    return selectPreset(currentPreset)
}

function selectPreset(index) {
    let presetButtonsList = document.getElementById('presets-container').children
    for (let item of presetButtonsList){
        item.style.backgroundColor = 'white'
    }
    presetButtonsList[index].style.backgroundColor = '#B3B3B3'

}