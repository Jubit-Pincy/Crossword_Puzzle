function coordsToCellNo(X,Y){
    return ((Y/50)*10) + (X/50)
}

function cellNoToX(cellNo){
    return(cellNo%10)*50
}

function cellNoToY(cellNo){
    return Math.trunc(cellNo/10)*50
}

function marginLeft(block){
    return Number(block.style.marginLeft.split('px')[0])
}

function marginTop(block){
    return Number(block.style.marginTop.split('px')[0])
}

function invertDirection(direction){
    return direction == 'horizontal' ? 'vertical' : 'horizontal'
}

function blocks(){
    return document.querySelectorAll('.block')
}

function placeResult(result,direction,X,Y)
    let html=' '
    let occupied = []
    let cellNo = coordsToCellNo(X,Y)

    for(let i=0;i<result.length;i++){
        occupied.push(direction=='horizontal'? cellNo+i : cellNo+(i*10))
        let style ='margin-left:${direction=='horizontal'?X+(i*50):X}px; margin-top:${direction=='vertical'?Y+(i*50):Y}px;'
        html += '<div class='block'style='${style}'>${result[i].toUpperCase()}</div>'
     }
     
     ContainerRule.insertAdjacentHTML('beforeend',html)

    return occupied
}

function getResults(){
    let  results
    let alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
do{
    sample =''
    results = []
    let toBeSelectedForm = [...alphabets]

    for(let i=0; i<6; i++){
        let randomAlphabet = toBeSelectedFrom[Math.floor(Math.random()* toBeSelectedFrom.length)]
        sample = sample + randomAlphabet
        toBeSelectedFrom.splice(toBeSelectedFrom.indexOf(randomAlphabet),1)
    }

    sample = sample.split('').sort().join(''

    alphaKeys.forEach((elem,index)=>{
    elem.querySelector('b').innerHTML = sample[index].toUpperCase()
    })
    
    dictionary.forEach((word)={
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
while(results.length<=15) || results.filter(result=>result.length>=5).length>3)

    results.sort((a,b)=>b.length-a.length)
    results= results.slice(0,15)
    return results
}
