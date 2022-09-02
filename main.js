const {play} = require("./game.js");
const Discord = require("discord.js");
require("dotenv").config()

var secret = {
    token: process.env.DISCORD_TOKEN
}

const client = new Discord.Client({ intents: ["DirectMessages"] });

userToInstance = new Map();

client.on('ready', () => {
    client.user.setActivity("LolQuotdle");
    console.log (`Logged in as ${client.user.tag}!`);
    client.users.fetch("180116814863400960").then((user)=>{
        // user.send('type "play" to begin playing and "stop" to quit');
        client.users.createDM(user);
    });
    client.users.fetch("396894949582438401").then((user)=>{
        // user.send('type "play" to begin playing and "stop" to quit');
        client.users.createDM(user);
    });
    
});
client.on('messageCreate',(msg)=>{
    if (msg.author.bot)
        return;

    console.log("Message recieved: "+ msg.content)
    if (userToInstance[msg.author.id]){
        console.log("Message in progress")
        userToInstance[msg.author.id].progress(msg.content);
    }
    else{
        if (msg.content.toLowerCase()=="play"){
            let newInstance = {
                sendMessage:(str)=>{
                    console.log(str);
                    msg.author.send(str)
                },
                stop:()=>{
                    userToInstance[msg.author.id]=null
                    console.log("done");
                }
            }
            
            play(newInstance);
            userToInstance[msg.author.id]=newInstance;
        }
        else{
            msg.author.send('type "play" to begin playing and "stop" to quit');
        }
    }
    
})


client.login(secret.token);

