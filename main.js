
const strings = {}

let language = 'pl'

const VERSION = '1.5.0'

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
let menuButton = document.getElementById('menu-button')
let presetsContainer = document.getElementById('presets-container')
let nameInput = document.getElementById('preset-name-input')
let modal = document.getElementById("print-modal");


let presetButtonsList = presetsContainer.children
let leftPanelButtons = []
let rightPanelButtons = []
let presetsData = Array()
let currentPreset = 0

const buttonNormal = 'rgb(240, 240, 240)'
const buttonSelected = 'rgb(214, 214, 214)'
const buttonHandleAttached = 'rgb(145, 85, 2)'

main()

async function main() {
    await loadData()
    generateMainRegisters()
    setupPresets()
    disableRegisters()
    clickedPreset(presetButtonsList[0])
    setMediaListener()
    toggleMenu(menuButton)
    tryLoadingOldSession()
    loadStrings()
    setVersion()
}

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

function loadStrings() {
    for (const [id, val] of Object.entries(strings[language].ids)){
        document.getElementById(id).textContent = val
    }
    for (const [className, val] of Object.entries(strings[language].classes)){
        Array.from(document.getElementsByClassName(className)).forEach(e => {
            e.textContent = val
        })
    }
}

function newPresetTable() {
    let emptyPreset = {
        left: Array.from(Array(7 + 1), () => new Array(6 + 1).fill(false)),
        right: Array.from(Array(7 + 1), () => new Array(6 + 1).fill(false)),
        coples: {
            ow: false,
            rp: false
        }
    }
    for (let i=1; i<6; i++) {
        //ventils
        emptyPreset.left[i][1] = true
        emptyPreset.right[i][6] = true
    }
    emptyPreset.right[5][5] = true //licht
    emptyPreset.right[5][4] = true //motor
    return emptyPreset
}

function disableRegisters() {
    let emptyHandleId = generateButtonId('left', 5, 2)
    let calcantHandleId = generateButtonId('left', 5, 3)
    let paukenHandleId = generateButtonId('right', 4, 4)
    document.getElementById(emptyHandleId).disabled = true;
    document.getElementById(calcantHandleId).disabled = true;
    document.getElementById(paukenHandleId).disabled = true;
}

function setupPresets() {
    presetsData.push(newPresetTable())
    nameInput.addEventListener('change', updatePresetName)
}

function setData(dataNew) {
    stopsData = dataNew
}

function setLanguageData(data) {
    const key = Object.keys(data)[0]
    strings[key] = data[key]
}

async function loadData() {
    await fetch('./stops.json')
    .then(response => response.json())
    .then(data => setData(data))
    .catch(error => console.log(error));

    await fetch('./lang.pl.json')
    .then(response => response.json())
    .then(data => setLanguageData(data))
    .catch(error => console.log(error));

    await fetch('./lang.en.json')
    .then(response => response.json())
    .then(data => setLanguageData(data))
    .catch(error => console.log(error));
}

function generateButtonId(side, row, column) {
    return `handle-${side}-${row}-${column}`
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

function toggleMenu(menuButton) {
    const matchMedia = window.matchMedia('screen and (min-width:1100px)')
    let id = matchMedia.matches ? "menu_desktop" : "menu_mobile"

    let menu = document.getElementById(id);
    if (menu.style.display === "none"){
        menu.style.display = "flex"
        menuButton.textContent = strings[language].ids['menu-button']
    }
    else {
        menu.style.display = "none"
        menuButton.textContent = strings[language].extras['menu-button-show']
    }
}

function setMediaListener() {
    const matchMedia = window.matchMedia('(min-width:1100px)')
    let menus = document.getElementsByTagName('menu')

    matchMedia.addEventListener( "change", () => {
        // menuButton.textContent = strings[language].extras['menu-button-show']
        menus[0].style.display = 'none'
        menus[1].style.display = 'none'
        toggleMenu(menuButton)
    })
}

function handleClicked(button, side, row, column) {
    if (!document.getElementById('switch').checked){
        if(getButtonState(button)) {
            setButtonState(button, false)
            presetsData[currentPreset][side][row][column] = false
        }
        else {
            setButtonState(button, true)
            presetsData[currentPreset][side][row][column] = true

        }
    }
}

function copelClicked(button, name) {
    if (!document.getElementById('switch').checked){
        // state mode
        if(getButtonState(button)) {
            setButtonState(button, false)
            presetsData[currentPreset].coples[name] = false
        }
        else {
            setButtonState(button, true)
            presetsData[currentPreset].coples[name] = true

        }
    }
}

function clickedPreset(button) {
    currentPreset = Array.from(presetButtonsList).indexOf(button)
    updateBoxesState(currentPreset)
    selectPreset(currentPreset)

}

function selectPreset(index) {
    for (let item of presetButtonsList){
        item.style.backgroundColor = buttonNormal
    }
    let button = presetButtonsList[index]
    button.style.backgroundColor = buttonSelected
    nameInput.value = button.textContent
}

function clearPresetClicked(){
    if (!confirm(strings[language].extras['clear-preset'])) {
        return;
    }
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
    button.style.backgroundColor = bool ? buttonHandleAttached : buttonNormal
}

function getButtonState(button) {
    return button.style.backgroundColor === buttonHandleAttached
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

function copyPreviousClicked() {
    if (!confirm(strings[language].extras['copy-previous'])) {
        return;
    }
    if (currentPreset === 0) {
        return;
    }
    presetsData[currentPreset] = deepCopy(presetsData[currentPreset - 1])
    clickedPreset(presetButtonsList[currentPreset])
}

function deepCopy(obj){
    return JSON.parse(JSON.stringify(obj))
}

function deletePresetClicked() {
    let oldIndex = currentPreset
    if (presetButtonsList.length === 1) {
        alert(strings[language].extras['delete-last-preset'])
        return null;
    }
    if (!confirm(strings[language].extras['delete-preset'])) {
        return;
    }

    let delta = oldIndex === 0 ? 0 : -1
    presetButtonsList[oldIndex].parentNode.removeChild(presetButtonsList[oldIndex])
    presetsData = presetsData.filter((e, i) => i !== oldIndex)
    presetButtonsList[oldIndex + delta].click()
}

function saveConfigClicked() {
    // prepare data
    let preparedData = generateEnglerJsonData()
    // download data
    let fname = prompt(strings[language].extras['provide-filename'])
    if (!fname) {
        return
    }
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

function generateEnglerJsonData() {
    let preparedData = {
        meta: {configVersion: '1.0',},
        presets: {},
    }
    presetsData.forEach((x, index) => {
        let presetName = presetButtonsList[index].textContent
        preparedData.presets[presetName] = x
    })
    return preparedData
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
    fileReader.readAsText(file); // read file as array buffer

    fileReader.onload = () => {
        let loadedData = JSON.parse(fileReader.result)
        parseEnglerJsonData(loadedData)
    }
}

function parseEnglerJsonData(loadedData){
    // validate version
    if (loadedData.meta.configVersion !== '1.0') {
        alert(strings[language].extras['config-version-wrong'])
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

function aboutClicked() {
    alert("Created by Maciej Lewandowicz. " +
        "Simple web app to simplify and potentially unify registration process " +
        "for reconstructed Engler organ in Wroclaw. Main purpose is to make organist's and assistant's lives easier, " +
        "and also learn little bit of JavaScript in real live case.")
}



function generatePDFClicked() {
    // if(iOS()){
    //     alert('PDF generating is currently disabled on IOS platform. Please save config file, and open' +
    //         'it on other platform, and than generate pdf.')
    //     return
    // }
    displayModal()
}

function confirmPrintClicked() {
    let names = Array()
    let diffModes = Array()
    presetsData.forEach((x, index) => {
        let presetName = presetButtonsList[index].textContent
        names.push(presetName)
        diffModes.push(document.getElementById(`mode-checkbox-${index}`).checked)
    })

    localStorage.setItem('presetsData', JSON.stringify(presetsData));
    localStorage.setItem('presetNames', JSON.stringify(names))
    localStorage.setItem('diffModes', JSON.stringify(diffModes))

    hideModal()

    if (!iOS()){
        window.location.href = "./template.html";
    } else {
        window.open("./template.html")
    }
}

window.onunload = () => {
    let preparedData = generateEnglerJsonData()
    localStorage.setItem('sessionData', JSON.stringify(preparedData));
    localStorage.setItem('language', language)
    setTimeout(null, 10000)
}

function tryLoadingOldSession() {
    let oldLanguage = localStorage.getItem('language')
    if (oldLanguage === null){
        console.log('No language in storage')
    }
    else {
        language = oldLanguage
    }

    let oldSessionData = localStorage.getItem('sessionData')
    if (oldSessionData === null){
        console.log('No data in storage')
        return
    }
    let objectData = JSON.parse(oldSessionData)
    if (Object.keys(objectData.presets).length === 0) {
        console.log('Faulty old session data')
        return
    }
    parseEnglerJsonData(objectData)

}

function setVersion() {
    let versionLabel = document.getElementById('version')
    versionLabel.innerText = `Version ${VERSION}`
}

function tutorialClicked(){
    if (language === 'pl'){
        window.open("https://github.com/maclewan/maclewan.github.io/blob/main/instruction/INSTRUKCJA.md#poradniczek")
    }
    else {
        window.open("https://github.com/maclewan/maclewan.github.io/blob/main/instruction/INSTRUCTION.md#tutorial")
    }

}

// Get the modal


function displayModal() {
    let rowsContainer = document.getElementById('modal-rows')

    let first = rowsContainer.firstElementChild
    while (first) {
        first.remove()
        first = rowsContainer.firstElementChild
    }

    let modalTitleRow = document.createElement('div')
    modalTitleRow.className = 'modal-row'
    let label1 = document.createElement('label')
    let label2 = document.createElement('label')
    label1.textContent = strings[language].extras['preset-name-label']
    label2.textContent = strings[language].extras['diff-mode-label']
    modalTitleRow.appendChild(label1)
    modalTitleRow.appendChild(label2)
    rowsContainer.appendChild(modalTitleRow)
    rowsContainer.appendChild(document.createElement('hr'))

    Array.from(presetButtonsList).forEach((button, index) => {
        let modalRow = document.createElement('div')
        modalRow.className = 'modal-row'
        let label = document.createElement('label')
        label.className = 'modal-row-label'
        label.textContent = button.textContent
        let modeCheckBox = document.createElement('input')
        modeCheckBox.type = 'checkbox'
        modeCheckBox.className = 'modal-row-checkbox'
        modeCheckBox.id = `mode-checkbox-${index}`

        modalRow.appendChild(label)
        modalRow.appendChild(modeCheckBox)

        rowsContainer.appendChild(modalRow)
    })
    modal.style.display = "block";

}

function hideModal() {
    modal.style.display = "none";
}

function languageClicked(lang) {
    language = lang
    loadStrings()
}