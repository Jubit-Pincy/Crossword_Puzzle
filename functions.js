function coordsToCellNo(X, Y) {
    if (!isFinite(X) || !isFinite(Y) || X < 0 || Y < 0 || X > 450 || Y > 450) {
        console.error('Invalid X or Y coordinates:', X, Y);
        return -1; // Return an invalid cell number
    }
    let column = Math.floor(X / 50);
    let row = Math.floor(Y / 50);
    return row * 10 + column;
}

function cellNoToX(cellNo){
    return(cellNo%10)*50
}

function cellNoToY(cellNo){
    return Math.trunc(cellNo/10)*50
}

function marginLeft(block) {
    let left = Number(block.style.marginLeft.split('px')[0]);
    if (left < 0 || left > 450) {
        console.error('Invalid marginLeft:', left);
        return -1;
    }
    return left;
}

function marginTop(block) {
    let top = Number(block.style.marginTop.split('px')[0]);
    if (top < 0 || top > 450) {
        console.error('Invalid marginTop:', top);
        return -1;
    }
    return top;
}


function invertDirection(direction){
    return direction == 'horizontal' ? 'vertical' : 'horizontal'
}

function blocks(){
    return document.querySelectorAll('.block')
}

function triggerCountdown() {
    clearInterval(countdownID);
    countdown.innerHTML = '300'; // Reset countdown to 5 minutes

    countdownID = setInterval(() => {
        let currentCount = Number(countdown.innerHTML);
        
        // Prevent negative time display and ensure stop at 0
        if (currentCount <= 0) {
            clearInterval(countdownID); // Stop the interval immediately
            countdown.innerHTML = '0';
            gameOver(false); // Call gameOver for timeout
        } else {
            countdown.innerHTML = currentCount - 1;
        }
    }, 1000);
}

// NEW: Function to display instructions
function showInstructions() {
    keysAllowed = false;
    modalOverlay.classList.remove('hidden');
    // Ensure all blocks are hidden initially before game starts
    blocks().forEach(block => block.style.transform = 'scale(0)'); 
}

// NEW: Function to hide instructions and start the game
function hideInstructions() {
    modalOverlay.classList.add('hidden');
    // Game start logic moved from click listener
    gameStarted = true;
    inputString.innerHTML = '';
    triggerCountdown();
    document.querySelectorAll('.alphabetic-key span').forEach(elem => {elem.style.opacity = '1'});
    keysAllowed = true;
}

// MODIFIED BLOCK in functions.js (inside function gameOver)
function gameOver(completed){
    clearInterval(countdownID);
    keysAllowed = false;
    
    inputString.innerHTML = completed ? 'PUZZLE COMPLETE!' : 'TIME\'S UP!';
    
    if (completed) {
        puzzleCompleteSound.play();
        // Fire confetti for puzzle completion
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
        updateScoreBasedOnTime(); // Grant remaining time bonus
        
        // Change button text
        closeModalBtn.innerHTML = 'Next Puzzle (Enter)';
        
        // Ensure keys are allowed ONLY for the next puzzle advance
        keysAllowed = true; // Temporary set to true to enable the keydown listener in the main eventListeners.js file

    } else {
        timesUpSound.play();
        document.querySelectorAll('.alphabetic-key span').forEach(elem => {elem.style.opacity = '0.5'});
        closeModalBtn.innerHTML = 'Try Again (Enter)';
        
        // Ensure keys are allowed ONLY for the next puzzle advance
        keysAllowed = true; // Temporary set to true to enable the keydown listener in the main eventListeners.js file
    }
    
    // Show modal with end message
    instructionModal.querySelector('h2').innerHTML = completed ? 'Congratulations!' : 'Game Over!';
    instructionModal.querySelector('p').innerHTML = `Your final score is: ${scoreValue.innerHTML}. Press Enter to ${completed ? 'continue' : 'try again'}.`;
    modalOverlay.classList.remove('hidden');

    blocks().forEach(block => block.style.transform = 'scale(1)');
    
    // !!! DELETE OR COMMENT OUT THIS LINE - IT'S NO LONGER NEEDED !!!
    // document.addEventListener('keydown', handleGameEndKeys, { once: true });
}

function updateScoreBasedOnTime() {
    let remainingTime = parseInt(countdown.innerHTML); // Get the remaining time from the countdown element
    let pointsToAdd = Math.floor(remainingTime / 10) * 10; // Round down to the nearest multiple of 10
    
    // Add points to score
    scoreValue.innerHTML = Number(scoreValue.innerHTML) + pointsToAdd;
    console.log(`Remaining time: ${remainingTime}s, Points added: ${pointsToAdd}`);
}


function placeResult(result, direction, X, Y) {
    let html = ' ';
    let occupied = [];
    let cellNo = coordsToCellNo(X, Y);
    console.log('Initial cell number:', cellNo); // Add this log

    if (cellNo === -1) { // Check if invalid cellNo
        console.error('Invalid cellNo:', cellNo);
        return [];
    }

    for (let i = 0; i < result.length; i++) {
        occupied.push(direction == 'horizontal' ? cellNo + i : cellNo + (i * 10));
        console.log('Occupied cell:', occupied[i]); // Log each occupied cell number

        let style = `margin-left:${direction == 'horizontal' ? X + (i * 50) : X}px; margin-top:${direction == 'vertical' ? Y + (i * 50) : Y}px; transform:scale(0);`;
        html += `<div class='block' style='${style}'>${result[i].toUpperCase()}</div>`;
    }

    container.insertAdjacentHTML('beforeend', html);
    return occupied;
}


function getResults(){
    let results
    let alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s', 't','u','v','w','x','y','z']

    do{
    sample =''
    results = []
    let toBeSelectedFrom = [...alphabets]

    for(let i=0; i<6; i++){
        let randomAlphabet = toBeSelectedFrom[Math.floor(Math.random()* toBeSelectedFrom.length)]
        sample = sample + randomAlphabet
        toBeSelectedFrom.splice(toBeSelectedFrom.indexOf(randomAlphabet),1)
    }

    sample = sample.split('').sort().join('')

    alphaKeys.forEach((elem,index)=>{
    elem.querySelector('b').innerHTML = sample[index].toUpperCase()
    })
    
    dictionary.forEach((word)=>{
    let test = true
    alphabets.forEach((alphabet)=>{
        if(word.includes(alphabet) && !sample.includes(alphabet)){
            test = false
        }
    })

    if(test){
        if(word.length>2 && word.length<7){
            results.push(word)
            
        }
    }
    })
}
while((results.length<=15) || results.filter(result=>result.length>=5).length>3)

    results.sort((a,b)=>b.length-a.length)
    results= results.slice(0,15)
    return results
}

function placeFirstResult(results){
    let X = 150
    let Y = 150
    let direction = ['horizontal','vertical'][Math.floor(Math.random()*2)]
    
    data.push({result:results[0], direction:direction, occupied: placeResult(results[0],direction,X,Y)})
}

function placeResults(){
    data = []
    blocks().forEach(block => block.remove())
    cells.forEach(cell => cell.style.opacity = '1')

    let results = getResults()
    placeFirstResult(results)
    let remaining = results.slice(1)

    for(let iterations = 0; iterations<15; iterations++){
        if(data.length==10){
            break;
        }

        let placements = []
        Array.from(remaining[0]).forEach((alphabet_A,index_A)=>{
            data.forEach((object)=>{
                Array.from(object.result).forEach((alphabet_B, index_B)=>{
                    if(alphabet_A==alphabet_B){
                        let intersectCellNo = object.occupied[index_B]
                        let direction = invertDirection(object.direction)
                        let firstAlphabetCellNo = direction=='horizontal' ? intersectCellNo-index_A : intersectCellNo-(index_A*10)
                        placements.push({result:remaining[0], direction, firstAlphabetCellNo})
                    }
                })
            })
            
        })

        let validPlacement = false
        for(let i=0; i<placements.length; i++){
            let X = cellNoToX(placements[i].firstAlphabetCellNo)
            let Y = cellNoToY(placements[i].firstAlphabetCellNo)
            delete placements[i].firstAlphabetCellNo
            placements[i].occupied = placeResult(remaining[0], placements[i].direction, X, Y)

            let outOfGrid = false
            blocks().forEach((block)=>{
                if(marginLeft(block)<0 || marginLeft(block)>450 || marginTop(block)<0 || marginTop(block)>450){
                    outOfGrid = true
                }
            })

            let test = true
            if(!outOfGrid){
                let gridWords = getGridWords()
                gridWords.forEach((word)=>{
                    if(!results.slice(0,data.length+1).includes(word)){
                        test = false
                    }
                })

                if(new Set(gridWords).size!=gridWords.length || gridWords.length!=results.slice(0,data.length+1).length){
                    test = false
                }
            }

            if(test && !outOfGrid){
                validPlacement = true
                data.push(placements[i])
                remaining.shift()
                break
            }
            else{
                for(let j=0; j<remaining[0].length; j++){
                    container.lastChild.remove()
                }
            }
        }
        if(!validPlacement){
            results.push(results.splice(results.indexOf(remaining[0]), 1)[0])
            remaining.push(remaining.shift())
        }
    }

    arrangeBlocks()
    cells.forEach((cell,cellNo)=>{
        if(!data.find(object => object.occupied.includes(cellNo))){
            cell.style.opacity = '0'
        }
    })
}

function getGridWords(){
    let gridWords = []
    for (let row = 0; row<=9; row++){
        let word = ''
        for(let column = 0; column<=9; column++){
            if(getBlocksAtCellNo((row*10)+column).length){
                word = word + getBlocksAtCellNo((row*10)+column)[0].innerHTML
                if(word.length>1 && column==9){
                    gridWords.push(word.toLowerCase())
                }
            }
            else{
                word.length>1 && gridWords.push(word.toLowerCase())
                word = ''
            }
        }
    }
    for (let column=0; column<=9; column++){
        let word = ''
        for(row=0; row<=9; row++){
            if(getBlocksAtCellNo((row*10)+column).length){
                word = word + getBlocksAtCellNo((row*10)+column)[0].innerHTML
                if(word.length>1 && row==9){
                    gridWords.push(word.toLowerCase())
                }
            }
            else{
                word.length>1 && gridWords.push(word.toLowerCase())
                word = ''
            }
        }
    }
    return gridWords
}

function getBlocksAtCellNo(cellNo) {
    if (!isFinite(cellNo)) {
        console.error('Invalid cell number:', cellNo);
        return [];
    }
    let blocksFound = [];
    blocks().forEach((block) => {
        let blockX = marginLeft(block);
        let blockY = marginTop(block);
        
        // Ensure the X and Y are within grid bounds
        blockX = Math.max(0, Math.min(blockX, 450)); // Clamp to 450px max
        blockY = Math.max(0, Math.min(blockY, 450)); // Clamp to 450px max

        if (blockX === cellNoToX(cellNo) && blockY === cellNoToY(cellNo)) {
            blocksFound.push(block);
        }
    });
    return blocksFound;
}


function arrangeBlocks() {
    let min_X = +Infinity;
    let max_X = -Infinity;
    let min_Y = +Infinity;
    let max_Y = -Infinity;

    blocks().forEach((block) => {
        min_X = Math.min(min_X, marginLeft(block));
        max_X = Math.max(max_X, marginLeft(block)); // Fixed the comparison logic
        min_Y = Math.min(min_Y, marginTop(block));
        max_Y = Math.max(max_Y, marginTop(block)); // Fixed the comparison logic
    });

    let emptyColumnsOnLS = min_X / 50;
    let emptyColumnsOnRS = (450 - max_X) / 50;

    data.forEach((object) => {
        object.occupied = object.occupied.map(
            (cellNo) => cellNo + Math.trunc((emptyColumnsOnRS - emptyColumnsOnLS) / 2)
        );
    });

    blocks().forEach((block) => {
        let newMarginLeft = marginLeft(block) + Math.trunc((emptyColumnsOnRS - emptyColumnsOnLS) / 2) * 50;
        newMarginLeft = Math.max(0, Math.min(newMarginLeft, 450)); // Ensure marginLeft stays within bounds
        block.style.marginLeft = `${newMarginLeft}px`;
    });

    let emptyRowsOnUS = min_Y / 50;
    let emptyRowsOnBS = (450 - max_Y) / 50;

    data.forEach((object) => {
        object.occupied = object.occupied.map(
            (cellNo) => cellNo + Math.trunc((emptyRowsOnBS - emptyRowsOnUS) / 2) * 10
        );
    });

    blocks().forEach((block) => {
        let newMarginTop = marginTop(block) + Math.trunc((emptyRowsOnBS - emptyRowsOnUS) / 2) * 50;
        newMarginTop = Math.max(0, Math.min(newMarginTop, 450)); // Ensure marginTop stays within bounds
        block.style.marginTop = `${newMarginTop}px`;
    });
}