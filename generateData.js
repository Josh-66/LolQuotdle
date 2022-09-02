const fs = require('fs-extra');
const { argv } = require('process');

let allChampNames = fs.readdirSync("RawData",{encoding:'utf-8'});

allChampNames.forEach(champName => {
    let rawData = fs.readFileSync(`RawData/${champName}`,{encoding:"utf-8"});

    let cSelInd = rawData.indexOf("Champion Select");
    let tInd = rawData.indexOf("Trivia")
    rawData = rawData.slice(cSelInd>0 ? cSelInd : 0, tInd!=-1 ? tInd : rawData.length)
    fs.outputFileSync(`FilteredData/${champName}`,rawData)

    if (champName=="rakan"){
        rawData = rawData.replace(/(Xayah: ).+["].+["]/g,"")
    }
    if (champName=="xayah"){
        rawData = rawData.replace(/(Rakan: ).+["].+["]/g,"")
    }
    
    rawData = rawData.replace(/(\s\s+)/g,"");

    
    let lines = rawData.match(/["](\w|\s|[.,?!'\-():*;…—/$<éÁïñ])*["]/g);
    
    
    
    
    if (!lines){    
        lines = []
    }
    else{
        let dotFilter = /(\w+[.]\w+)/g; 
        lines = lines.filter((a)=>!a.match(dotFilter));
    }
    fs.outputFileSync(`VoiceLines/${champName}`,lines.join("\n"))
}); 


let gameData = {champNames:allChampNames}
let lengthFilter = parseInt(argv[2])

gameData.champNames.forEach(name => {

    let validLines = fs.readFileSync(`VoiceLines/${name}`,{encoding:'utf-8'}).split("\n");

    validLines = validLines.filter((s)=>s.length>    lengthFilter);    


    gameData[name]=validLines
});
fs.writeJsonSync("gameData.json",gameData);


console.log(argv);