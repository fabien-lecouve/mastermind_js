/***************************** DOM ***********************************/
let colorPalette = [...document.getElementsByClassName('color-palette')]
let section = document.getElementById('tries')
let bottom = document.getElementById('bottom')
let divSolution = document.getElementById('solutions')
let btnValidation = document.getElementById('btn-validation')
let btnRestart = document.getElementById('btn-restart')

/************************** VARIABLES ********************************/
let combinationToFind
let countOfEachColor
let selectedColor = ''
let nbrOfColors = 4

/************************** FUNCTIONS ********************************/
function getRandomCombinationToFind(){
    let colors = ['blue', 'green', 'yellow', 'red', 'cyan', 'magenta', 'pink', 'brown']
    countOfEachColor = {}
    combinationToFind = []

    for(let i=0; i<nbrOfColors; i++){
        let color = colors[getRandomInteger(0, colors.length-1)]
        combinationToFind.push(color)
    }
    combinationToFind.forEach(element => {
        countOfEachColor[element] = (countOfEachColor[element] || 0) + 1
    });
    console.log(combinationToFind)
    console.log(countOfEachColor)
}
function checkCombination(){
    let lastRow = document.getElementById('tries').lastElementChild
    let proposedColors = [...lastRow.getElementsByClassName('choice')]
    let playerCombination = proposedColors.map(element => element.style.backgroundColor)
    let wellPlaced = 0
    let present = 0
    let checkDuplicate = []
    
    for(let i=0; i<proposedColors.length; i++){
        if(combinationToFind[i] === playerCombination[i]){
            checkDuplicate.push(playerCombination[i])
            wellPlaced++
        }
    }
    for(let i=0; i<proposedColors.length; i++){
        if(combinationToFind.includes(playerCombination[i]) && combinationToFind[i] !== playerCombination[i]){
            checkDuplicate.push(playerCombination[i])
            let countOfTheRow = {}
            checkDuplicate.forEach(element => {
                countOfTheRow[element] = (countOfTheRow[element] || 0) + 1
            });
            if(countOfTheRow[playerCombination[i]] <= countOfEachColor[playerCombination[i]]){
                checkDuplicate.push(playerCombination[i])
                present++
            }
        }
    }

    console.log(`Présent(s): ${present} -- Bien placé(s): ${wellPlaced}`)

    if(wellPlaced !== nbrOfColors){
        getClues(lastRow, wellPlaced, present)
        lastRow.classList.add('disabled')
        addNewRow()
    } else {
        getSolution()
    }
}

function getClues(row, wellPlaced, present){
    let clues = [...row.lastElementChild.children]

    for(let i=0; i<clues.length; i++){
        if(wellPlaced > 0){
            clues[i].style.backgroundColor = 'black'
            wellPlaced--
        } else if(present > 0){
            clues[i].style.backgroundColor = 'blue'
            present--
        } else {
            break
        }
    }
}

function getSolution(){
    bottom.style.display = 'inherit'

    for(let i=0; i<nbrOfColors; i++){
        divSolution.appendChild(createElementWithClassAndColor('div', 'solution', combinationToFind[i]))
    }
}

function restartGame(){
    removeAllChildNodes(divSolution)
    removeAllChildNodes(section)
    bottom.style.display = 'none'
    getRandomCombinationToFind()
    addNewRow()
}
function addNewRow(){
    let row = createElementWithClassAndColor('div', 'row')
    let clues = createElementWithClassAndColor('div', 'clues')

    for(let i=0; i<nbrOfColors; i++){
        row.appendChild(createElementWithClassAndColor('div', 'choice', 'white'))
        clues.appendChild(document.createElement('div'))
    }
    row.appendChild(clues)

    section.appendChild(row)
}

function createElementWithClassAndColor(tagName, className, color = null){
    let element = document.createElement(tagName)
    element.classList.add(className)
    if(color !== null){
        element.style.backgroundColor = color
    }
    return element
}

/**************************** CODE ***********************************/
getRandomCombinationToFind()
addNewRow()

document.addEventListener('click', function(event){
    let divSelectedColor = document.getElementById('selected-color')
    if(event.target.classList.contains('color-palette')){
        selectedColor = event.target.style.backgroundColor
        divSelectedColor.style.backgroundColor = selectedColor
    }
    if(event.target.classList.contains('choice') && selectedColor != ''){
        event.target.style.backgroundColor = selectedColor
    }
})

btnValidation.addEventListener('click', checkCombination)
btnRestart.addEventListener('click', restartGame)
