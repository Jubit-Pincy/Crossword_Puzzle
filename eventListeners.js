window.addEventListener('load', ()=>{
    while(data.length!=10){
        placeResults()
    }

    body.style.filter = 'blur(0px)'
    body.style.backdropFilter = 'blur(0px)'
})

document.addEventListener('click', async()=>{
    if(!gameStarted){
        gameStarted = true
        await new Promise(resolve => setTimeout(resolve,500))
        bgMusic.play()
        inputString.innerHTML = ''
        triggerCountdown()
        document.querySelectorAll('.alphabetic-key span').forEach(elem => {elem.style.opacity = '1'})
        keysAllowed = true
    }
})

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
        gameOver()
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
        
                console.log('Occupied cells:', object.occupied); // Check occupied cells
                object.occupied.forEach((cellNo) => {
                    const blocks = getBlocksAtCellNo(cellNo);
                    console.log('Blocks at cell:', blocks); // Check which blocks are found
                    blocks.forEach((block) => {
                        block.style.transform = 'scale(1)';
                        console.log('Updated block style:', block.style.transform); // Confirm the update
                    });
                });
        
                solved.push(object.result);
                console.log('Correct Answers:', solved);
                console.log('Result:', object.result, 'Occupied cells:', object.occupied);
            }
        })
        !correct && new Audio('wrong.mp3').play()
        inputString.innerHTML = ''
        document.querySelectorAll('.block').forEach(block => console.log(block.style.transform));

    }
    else if(e.key=='Enter' && keysAllowed && (solved.length==10 || skips!=3)){
        solved.length!=10 && skips++
        solved = []
        inputString.innerHTML = ''
        clearInterval(countdownID)
        keysAllowed = false
        body.style.filter = 'blur(200px)'
        body.style.backdropFilter = 'blur(200px)'
        await new Promise(resolve => setTimeout(resolve,500))

        data = []
        while(data.length!=10){
            placeResults()
        }

        body.style.backgroundImage = `url('bg-$(bgNum).jpg')`
        let blockColors = ['linear-gradient(to right, #000000, #434343)','linear-gradient(to right, #0575e6, #021b79']
        blocks().forEach(block => block.style.background = blockColors[bgNum-1])
        bgNum = bgNum==4 ? 1 : bgNum+1

        body.style.filter = 'blur(0px)'
        body.style.backdropFilter = 'blur(0px)'
        await new Promise(resolve => setTimeout(resolve,500))

        triggerCountdown()
        bgMusic.play()
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