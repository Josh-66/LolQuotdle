const fs = require('fs-extra');

let allFileNames = fs.readdirSync("VoiceLines",{encoding:'utf-8'});
allFileNames.forEach(fileName => {
    let lines = fs.readFileSync(`VoiceLines/${fileName}`,{encoding:"utf-8"});
    lines = lines.split("\n");

    let prevelement = ""
    let found =false;
    lines.forEach(element => {
        if (found){
            return;
        }
        if (element.match(/["]\W*["]/)){
            console.log(fileName + " " + prevelement);
            found=true;
        }
        prevelement=element;
    });
});