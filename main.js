let data = []
let leftPanel = document.getElementById('left-side')
let rightPanel = document.getElementById('right-side')
let leftPanelButtons = []
let rightPanelButtons = []

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
    newButton.style.gridColumnStart = `${i}`
    newButton.style.gridRowStart = `${j}`

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
    console.log(data)
}

main()

function toggleMenu() {
    let menu = document.getElementById("menu");
    if (menu.style.display === "none"){
        menu.style.display = "flex"
    }
    else {
        menu.style.display = "none"
    }
}