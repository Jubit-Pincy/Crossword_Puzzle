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
        document.querySelectorAll('.alphabet-key span').forEach(elem => elem.style.opacity = '1')
    }
})