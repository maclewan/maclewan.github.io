Array.prototype.insert = function(index) {
    this.splice.apply(this, [index, 0].concat(
        Array.prototype.slice.call(arguments, 1)));
    return this;
};

let stopsData = []
let leftPanel = document.getElementById('left-side')
let rightPanel = document.getElementById('right-side')
let coplesButtons = {
    ow: document.getElementById('ow-copel'),
    rp: document.getElementById('rp-copel')
}
let presetsContainer = document.getElementById('presets-container')
let presetButtonsList = presetsContainer.children
let leftPanelButtons = []
let rightPanelButtons = []
let presetsData = Array()
let currentPreset = 0

function newPresetTable() {
    return {
        left: Array.from(Array(7 + 1), () => new Array(6 + 1).fill(false)),
        right: Array.from(Array(7 + 1), () => new Array(6 + 1).fill(false)),
        coples: {
            ow: false,
            rp: false
        }
    }
}

presetsData.push(newPresetTable())

let nameInput = document.getElementById('preset-name-input')
nameInput.addEventListener('change', updatePresetName)

function setData(dataNew) {
    stopsData = dataNew
}

async function loadData() {
    await fetch('./stops.json')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.log(error));
}

function generateButtonId(side, j, i) {
    return `handle-${side}-${j}-${i}`
}

function generateCell(i, j, panel, panelButtons, dataSide) {

    let side = (panel === leftPanel) ? 'left' : 'right'
    let div = document.createElement('div');
    div.className = 'handle-div'
    div.style.gridColumnStart = `${i}`
    div.style.gridRowStart = `${j}`

    let newButton = document.createElement('button');
    newButton.onclick = function() {handleClicked(newButton, side, j, i)}
    newButton.id = generateButtonId(side, j, i)

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
            generateCell(i, j, leftPanel, leftPanelButtons, stopsData.left)
        }
    }

    // left positiv section
    for (let p = 1; p < 6; p++) {
        generateCell(p, 7, leftPanel, leftPanelButtons, stopsData.left)

    }

    // right side
    for (let i = 1; i < 7; i++) {
        for (let j = 1; j < 6; j++){
            generateCell(i, j, rightPanel, rightPanelButtons, stopsData.right)
        }
    }

    //right positiv section
    for (let p = 2; p < 7; p++) {
        generateCell(p, 7, rightPanel, rightPanelButtons, stopsData.right)
    }

}

async function main() {
    await loadData()
    generateMainRegisters()
    selectPreset(0)
    await toggleMenu()
}

main()

async function toggleMenu(menuButton) {
    let id = window.matchMedia('screen and (min-width:1100px)').matches ? "menu_desktop" : "menu_mobile"
    let menu = document.getElementById(id);
    console.log(id)
    if (menu.style.display === "none"){
        menu.style.display = "flex"
        menuButton.textContent = 'Hide Menu'
    }
    else {
        menu.style.display = "none"
        menuButton.textContent = 'Show Menu'
    }
}

function handleClicked(button, side, row, column) {
    if (!document.getElementById('switch').checked){
        // state mode
        if(button.innerText === 'X') {
            button.innerText = ''
            presetsData[currentPreset][side][row][column] = false
        }
        else {
            button.innerText = 'X'
            presetsData[currentPreset][side][row][column] = true

        }
    }

    // else {
    //     // todo or maybe not, see below
    //     return none
    //     // diff mode
    //     if(button.innerText === '') {
    //         button.innerText = '+'
    //     }
    //     else if (button.innerText === '+') {
    //         button.innerText = '-'
    //     }
    //     else {
    //         button.innerText = ''
    //     }
    // }
}

function copelClicked(button, name) {
    if (!document.getElementById('switch').checked){
        // state mode
        if(button.innerText === 'X') {
            button.innerText = ''
            presetsData[currentPreset].coples[name] = false
        }
        else {
            button.innerText = 'X'
            presetsData[currentPreset].coples[name] = true

        }
    }
    // else {
    //     // todo or maybe not, as it will complicate usage a lot
    //     return null
    //     // diff mode
    //     if(button.innerText === '') {
    //         button.innerText = '+'
    //     }
    //     else if (button.innerText === '+') {
    //         button.innerText = '-'
    //     }
    //     else {
    //         button.innerText = ''
    //     }
    // }
}

function clickedPreset(button) {
    currentPreset = Array.from(presetButtonsList).indexOf(button)
    updateBoxesState(currentPreset)
    selectPreset(currentPreset)

}

function selectPreset(index) {
    for (let item of presetButtonsList){
        item.style.backgroundColor = 'buttonface'
    }
    let button = presetButtonsList[index]
    button.style.backgroundColor = '#d6d6d6'
    nameInput.value = button.textContent
}

function clearPresetClicked(){
    presetsData[currentPreset] = newPresetTable()
    presetButtonsList[currentPreset].click()
}

function updateBoxesState(index){
    let data = presetsData[index]
    setButtonState(coplesButtons.ow, data.coples.ow)
    setButtonState(coplesButtons.rp, data.coples.rp)

    leftPanelButtons.forEach(x => setButtonState(x, false))
    rightPanelButtons.forEach(x => setButtonState(x, false))

    Array('left', 'right').forEach(side => data[side].forEach((x, j) => x.forEach((y, i) => {
         if (y===true){
            let button = document.getElementById(generateButtonId(side, j, i))
            if (!button) {
                console.log('Error!')
            }
            else {
                setButtonState(button, true)
            }
        }
    })))
}

function updatePresetName(e) {
    if (e.target.value === ''){
        e.target.value = 'Empty Name'
    }
    presetButtonsList[currentPreset].textContent = e.target.value
}

function setButtonState(button, bool) {
    button.textContent = bool ? 'X' : ''
}

function addPresetClicked(above) {
    let newPresetNames = Array.from(presetButtonsList).map(x => x.textContent).filter(x => x.startsWith('New preset '))
    let newName = 'New preset'
    for (let i = 1; i < 50; i++) {
        if(!newPresetNames.includes(`New preset ${i}`)){
            newName = `New preset ${i}`
            break
        }
    }

    let button = document.createElement('button')
    button.innerText = newName
    button.onclick = function() {clickedPreset(this)}
    if (above) {
        presetButtonsList[currentPreset].before(button)
        presetsData.insert(currentPreset, newPresetTable())
        currentPreset ++;
    }
    else {
        presetButtonsList[currentPreset].after(button)
        presetsData.insert(currentPreset + 1, newPresetTable())
    }
}

function deletePresetClicked() {
    let oldIndex = currentPreset
    if (presetButtonsList.length === 1) {
        alert('Cannot delete only remaining preset!')
        return null;
    }
    let delta = oldIndex === 0 ? 1 : -1
    presetButtonsList[oldIndex + delta].click()
    presetsData = presetsData.filter((e, i) => i !== oldIndex)
    presetButtonsList[oldIndex].parentNode.removeChild(presetButtonsList[oldIndex])
}

function saveConfigClicked() {
    // prepare data
    let preparedData = {
        meta: {configVersion: '1.0',},
        presets: {},
    }
    presetsData.forEach((x, index) => {
        let presetName = presetButtonsList[index].textContent
        preparedData.presets[presetName] = x
    })
    // download data
    let fname = prompt("Provide file name:")
    const file = new File([JSON.stringify(preparedData, null, '  ')], `${fname}.englerjson`, {
            type: 'text/plain',
        })
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
}


function loadConfigClicked() {
    const input = document.createElement('input');
    input.addEventListener('change', loadSelectedFile)
    input.type = 'file'
    input.accept = '.englerjson'
    input.click()

}

function loadSelectedFile(e) {
    const fileReader = new FileReader(); // initialize the object
    const file = e.target.files[0]
    console.log(file)
    fileReader.readAsText(file); // read file as array buffer

    fileReader.onload = () => {
        let loadedData = JSON.parse(fileReader.result)
        // validate version
        if (loadedData.meta.configVersion !== '1.0') {
            alert('Cannot load this file, as config version is different as current!')
            return
        }

        // remove all buttons except first
        let parent = presetButtonsList[0].parentNode
        let existingPresetsCount = presetButtonsList.length
        for (let i=existingPresetsCount-1; i>0; i--) {
            parent.removeChild(presetButtonsList[i])
        }
        presetsData = Array()
        currentPreset = 0
        for (const [presetName, value] of Object.entries(loadedData.presets)) {

            presetsData.push(value);

            let button = document.createElement('button');
            button.innerText = presetName;
            button.onclick = function() {clickedPreset(this)};
            presetButtonsList[currentPreset].after(button);
            currentPreset ++;
        }
        // remove first node
        parent.removeChild(presetButtonsList[0]);
        currentPreset = 0;
        presetButtonsList[0].click()

    }


}

