const { readJsonSync } = require("fs-extra");
const readline = require("readline");

const {findBestMatch} = require("string-similarity");

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}




function play(instance){
    

    let gameData = readJsonSync("gameData.json");
    let champName;
    while (gameData[champName]==null || gameData[champName].length==0){
        champName=gameData.champNames.random();
    }

    let quote = gameData[champName].random()
    // console.log(champName);
    // console.log(quote);


    // console.log("------------");

    let quoteArr = quote.split(" ");
    let words = 1;
    let guesses=0;
    let remainingChamps = gameData.champNames.slice(0,gameData.champNames.length);
    let win = false;
    let donequotes = []

    ask();

    function ask(){
        
        if (words>quoteArr.length){
            donequotes.push(quote);
            quote=gameData[champName].random();
            quoteArr = quote.split(" ");
            words=1;
        }
        let currentQuote = quoteArr.slice(0,words).join(" ")

        let doneQuoteString = ""
        if (donequotes.length>0){
            doneQuoteString+="Done Quotes:\n"
            donequotes.forEach(element => {
                doneQuoteString+=`> ${element}\n` 
            });
        }
        instance.sendMessage(`${doneQuoteString} Current quote: ${currentQuote}\nType your guess:`)
        
        instance.progress=(guess)=>{
            if(guess=="stop"||guess =="quit"){
                instance.sendMessage(`You Lose! the quote was:\n> ${quote}\nAnd the champion was\n> ${champName}\nGuesses: ${guesses}`)
                instance.stop();
                return;
            }

            let match = findBestMatch(guess,remainingChamps)
            if (match.bestMatch.rating<0){
                instance.sendMessage(`Invalid champion, ${match.bestMatch.target} is closest (rating ${match.bestMatch.rating}).`);
                ask();
            }
            else if (match.bestMatch.target==champName){
                guesses++
                instance.sendMessage(`You win! the quote was:\n> ${quote}\nAnd the champion was\n> ${champName}\nGuesses: ${guesses}`)
                instance.stop();
                
            }
            else{
                instance.sendMessage(`${match.bestMatch.target} is wrong`);
                guesses++
                words++
                remainingChamps.splice(match.bestMatchIndex,1)
                ask();
            }
        }
    }
    
}

exports.play = play;
