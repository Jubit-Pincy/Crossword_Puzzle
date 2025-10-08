window.addEventListener('load', ()=>{
    // This loop should run first to generate the puzzle structure
    while(data.length!=10){
        placeResults()
    }
    
    // Remove the blur right after puzzle generation
    body.style.filter = 'blur(0px)'
    body.style.backdropFilter = 'blur(0px)'
    
    // Ensure all blocks are hidden before showing instructions
    blocks().forEach(block => block.style.transform = 'scale(0)');
    
    // Show instructions modal to formally start the game
    showInstructions()
})

// NEW: Handle modal closure to start the game
closeModalBtn.addEventListener('click', async()=>{
    if (!gameStarted) {
        // Hide the overlay and start the game (function defined in functions.js)
        await new Promise(resolve => setTimeout(resolve, 500));
        hideInstructions();
    } else {
        // If the game has ended (completed or timed out), the button acts as an "Enter" press
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter' }));
    }
});


// // MODIFIED: Only handles user clicks/taps *after* the game has started via the modal button
// document.addEventListener('click', async(e)=>{
//     // The previous game start logic has been moved to hideInstructions()
//     if(!gameStarted && e.target !== closeModalBtn){
//         // Optional: Provide a visual cue that they need to press the button
//         console.log('Press "Start Game" to begin.')
//     }
// })


document.addEventListener('keydown', async(e)=>{
    if(keysAllowed && sample.includes(e.key.toLowerCase()) && inputString.innerHTML.length!=6 && !e.repeat){
        inputString.innerHTML = inputString.innerHTML + e.key.toUpperCase()
        alphaKeys[sample.indexOf(e.key.toLowerCase())].querySelector('img').style.filter = 'brightness(50%)'
        new Audio('keyPress.mp3').play()
    }
    else if(e.key=='Backspace' && keysAllowed && inputString.innerHTML.length>0 && !e.repeat){
        inputString.innerHTML = inputString.innerHTML.slice(0, inputString.innerHTML.length-1)
        backspaceKeyImg.style.filter = 'brightness(50%)'
        new Audio('backspace.mp3').play()
    }
    else if(e.key=='Escape' && keysAllowed){
        // MODIFIED: Use gameOver with 'false' for premature exit (Escape)
        gameOver(false) 
    }
    else if(keysAllowed && e.code=='Space' && !e.repeat && inputString.innerHTML.length>=3){
        spaceKeyImg.style.filter = 'brightness(50%)'
        let correct = false

        data.forEach((object) => {
            if (object.result == inputString.innerHTML.toLowerCase() && !solved.includes(inputString.innerHTML.toLowerCase())) {
                correct = true;
                new Audio('correct.mp3').play();
                scoreValue.innerHTML = Number(scoreValue.innerHTML) + (object.result.length * 10);
                scoreText.style.color = 'lime';
                scoreText.animate(
                    [{ color: 'lime' }, { color: 'white' }],
                    { duration: 3000, easing: 'linear', fill: 'forwards' }
                );
        
                console.log('Occupied cells:', object.occupied); 
                object.occupied.forEach((cellNo) => {
                    const blocks = getBlocksAtCellNo(cellNo);
                    console.log('Blocks at cell:', blocks); 
                    blocks.forEach((block) => {
                        block.style.transform = 'scale(1)';
                        console.log('Updated block style:', block.style.transform); 
                    });
                });
        
                solved.push(object.result);
                console.log('Correct Answers:', solved);
                console.log('Result:', object.result, 'Occupied cells:', object.occupied);
                
                // NEW: Check for puzzle completion here
                if (solved.length === 10) {
                    gameOver(true); // Call gameOver with 'true' for completion
                    return; // Stop further processing in forEach
                }
            }
        })
        !correct && new Audio('wrong.mp3').play()
        inputString.innerHTML = ''
        document.querySelectorAll('.block').forEach(block => console.log(block.style.transform));

    }
    // MODIFIED: Enter key handler for skipping / advancing to next puzzle
    else if(e.key=='Enter' && keysAllowed && (solved.length==10 || skips!=3)){
        // The logic for skipping/advancing is the same
        solved.length!=10 && skips++
        solved = []
        inputString.innerHTML = ''
        clearInterval(countdownID)
        keysAllowed = false
        
        // Hide the modal if it was visible (only relevant if triggered from modal)
        modalOverlay.classList.add('hidden');
        
        body.style.filter = 'blur(200px)'
        body.style.backdropFilter = 'blur(200px)'
        await new Promise(resolve => setTimeout(resolve,500))

        data = []
        while(data.length!=10){
            placeResults()
        }

        body.style.backgroundImage = `url('bg-${bgNum}.jpg')`
        let blockColors = ['linear-gradient(to right, #000000, #434343)','linear-gradient(to right, #0575e6, #021b79']
        blocks().forEach(block => block.style.background = blockColors[bgNum-1])
        bgNum = bgNum==4 ? 1 : bgNum+1

        body.style.filter = 'blur(0px)'
        body.style.backdropFilter = 'blur(0px)'
        await new Promise(resolve => setTimeout(resolve,500))

        triggerCountdown()
        keysAllowed = true
    }
})


document.addEventListener('keyup', (e)=>{
    if(keysAllowed && sample.includes(e.key.toLowerCase())){
        setTimeout(()=>{
            alphaKeys[sample.indexOf(e.key.toLowerCase())].querySelector('img').style.filter = 'brightness(100%)'
        },100)
    }
    else if(keysAllowed && e.code=='Space'){
        setTimeout(()=>{
            spaceKeyImg.style.filter = 'brightness(100%)'
        },100)
    }
    else if(keysAllowed && e.key=='Backspace'){
        setTimeout(()=>{
            backspaceKeyImg.style.filter = 'brightness(100%)'
        },100)
    }
})