const express = require("express")
const TelegramBot = require('node-telegram-bot-api');

const fs = require("fs");
require("dotenv").config()
const app = express()
app.use(express.json());
var post_data = {}

const PORT = process.env.PORT ||5000;

const token = process.env.token
const bot = new TelegramBot(token, {polling: true});


var users_details = JSON.parse(fs.readFileSync("./data/details.json","utf-8"))

var calculate = (number_text)=>{
    var user =number_text
        var ListOfElement = [];
        var number = '';
        var opration = '';
        var True = false;
        var ListOfElementop=['**','/','*','-','+']
        var i = 0;
        while (i<user.length){
            if (user[i] == '*' && user[i+1] == '*'){
                opration += user[i];
            }else if ((user[i] == '-' || user[i] == '+' || user[i] == '*' || user[i] == '/') && True){
                opration += user[i]
                ListOfElement.push(Number(number));
                console.log(number);
                ListOfElement.push(opration);
                number ='';
                opration ='';
                True = false;
            }else{
                number += user[i];
                True = true;
            }
            i++
        }
        
        ListOfElement.push(Number(number))
        var OprationConditions = false;
        var NewNumber
        while (true){
            if (ListOfElement.length==1){
                break
            }
            
            var j=0
            while (j < ListOfElementop.length){
                i=0
                while(i<ListOfElement.length){
                    if (ListOfElement[i]==ListOfElementop[j]){
                        break
                    }
                    i++ 
                    
                }
                if(i<ListOfElement.length){
                break
                }
                j++;
            }
            var oprator = (ListOfElement[i])
            if (oprator == '**'){
                NewNumber = (ListOfElement[i-1]) ** (ListOfElement[i+1])
                OprationConditions = true;
            }else if(oprator == '/'){
                NewNumber = (ListOfElement[i-1]) / (ListOfElement[i+1])
                OprationConditions = true;
            }else if (oprator == '*' ){
                NewNumber = (ListOfElement[i-1]) * (ListOfElement[i+1])
                OprationConditions = true;
            }else if (oprator == '-' ){
                NewNumber = (ListOfElement[i-1]) - (ListOfElement[i+1])
                OprationConditions = true;
            }else if(oprator == '+' ){
                NewNumber = (ListOfElement[i-1]) + (ListOfElement[i+1])
                OprationConditions = true;
            }
            if (OprationConditions){
                    ListOfElement.splice(i-1,3,Number(NewNumber))
                    OprationConditions = false;
                }
            }

        console.log(ListOfElement);
        return ListOfElement[0]
}

var numberOperatorChecker = (num) =>{
    let checker_string = "1234567890*-+/."
    let condition = true
    for (let i of num){
        if (!(checker_string.includes(i))){
            condition = false
            break
        }
    }
    return condition
}

var numberChecker = (num) =>{
    let checker_string = "1234567890"
    let condition = true
    for (let i of num){
        if (!(checker_string.includes(i))){
            condition = false
            break
        }
    }
    return condition  
}


const init = async(bot) =>{
    bot.on('message', (msg) => {
        var message = msg.text
    // starting bot
    id = msg.from.id.toString()
    // console.log(typeof(id),id,users_details);

    if (!(users_details.hasOwnProperty(id))){
        users_details[id]=Object.assign({}, msg.from);
        users_details[id].command = "/commands"
        console.log(users_details);
        message = users_details[id].command
        fs.writeFileSync('./data/details.json', JSON.stringify(users_details), 'utf8')
    }
    
    if(message==="/start"){
        users_details[id].command="/start"
        bot.sendMessage(msg.from.id, " Welcome ")
        
       
    }
    if (message==="/commands"){
        users_details[id].command = "/commands"
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
        bot.sendMessage(msg.from.id,"Using this commands your able to connect with bot")
        bot.sendMessage(msg.from.id, "/start /help /add_number /search /maths");

    }

    if(message==="/help"){
        users_details[id].command="/help"
        let help = `
        I can help you create contact number and manage Telegram-bots, please see the manual.
You can control me by sending these commands:
/start - It will start the boat and greet us. ex:- hi, bye, etc (greetings)
/maths - It will solve the mathematical problem and give the result and if the input is invalid then it will tell you the invalid query. (ex. numerical and arthematical like 5%2,2+4)
/add_number - By this, we will add the name and number. (ex:if the number length is not between the 10 12 it will ask again show you invalid )

/search - This will return the list and it will return the number and name, through the name.
/save - This will save the contact into the contact list. (ex:- it's will save the data and if the data already inside it then it will tell you that data already exists.)
        `
        bot.sendMessage(msg.chat.id,help)
    }
    
    // For solving Maths problems
    if(message==="/maths"){
        users_details[id].command="/maths"
        
        bot.sendMessage(msg.chat.id, "Welcome to maths ");
        bot.sendMessage(msg.chat.id, "Let start solving maths problems ");
        bot.sendMessage(msg.chat.id, "Give me a maths Query");
        
          
    }

        // For adding conctact(Name and Number) 
        if(message==="/add_number") {
            users_details[id].command="/add_number"
            bot.sendMessage(msg.chat.id,"Please enter a name" );
            
           
        }
        // For saving contacts 
    if(message==="/save") {
        users_details[id].command="/save"
        var data =fs.readFileSync("./data/file.json","utf-8")
        console.log(String(data).includes(String(post_data.mobile)));
        if(String(data).includes(String(post_data.mobile))){
            bot.sendMessage(msg.chat.id,"Number already exist")
        }else if(post_data.mobile){
            data = JSON.parse(data)
            data.push(post_data)
            data = JSON.stringify(data,null,4);
            fs.writeFile('./data/file.json', data, 'utf8', (err) => {
                if (err) {
                    console.log(`Error writing file: ${err}`);
                    bot.sendMessage(msg.chat.id,"Something want wrong")
                } else {
                    console.log(`File is written successfully!`);
                    bot.sendMessage(msg.chat.id,"Successfully saved!" );
                    bot.sendMessage(msg.chat.id,"press on your desire route" );
                    bot.sendMessage(msg.chat.id,"/start /search /maths /add_number /help")
                }
            })
        }else{
            bot.sendMessage(msg.chat.id,"Please first the fill name and number")
        }
        }


        
    if (message==="/search"){
        users_details[id].command="/search"

        bot.sendMessage(msg.chat.id,"enter a name" );
        
        
        }
    if (users_details[id].command==="/search" && message!=="/search"){
        var name = message
        var data = fs.readFileSync("./data/file.json","utf-8")
        data = JSON.parse(data)

        search_list = "Name    -    Number"
        console.log(name);
        for(let i of data){
            // console.log(i.name,name);
            if (i.name.includes(name.toLowerCase())){
                search_list+=`\n${i.name}   -  ${i.mobile}`
            }
        }
        bot.sendMessage(msg.chat.id,"I find something for you" );
        bot.sendMessage(msg.chat.id, search_list);
    }


    if (users_details[id].command==="/add_number" && message!=="/add_number"){
        if(numberChecker(message)){
            if (message.length>=10 && message.length<= 12){
                post_data.mobile = message
                console.log(post_data);
                bot.sendMessage(msg.chat.id,"If you change some number or name then directly edit  and click on save to save your contact /save")
            }else{
                bot.sendMessage(msg.chat.id,"Please enter a number" )
            }
        }else{
            bot.sendMessage(msg.chat.id,"Please enter a number" )
            post_data.name = message
        }
    }
    //for start
    if(users_details[id].command==="/start" && message!=="/start"){
        var Hi = "hi";
        if (message.toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
            }

        var location = "location";
        if (message.indexOf(location) === 0) {
            bot.sendLocation(msg.chat.id,44.97108, -104.27719);
            bot.sendMessage(msg.chat.id, "Here is the point");
    
        }

        var bye = "bye";
        if (message.toLowerCase().includes(bye)) {
        bot.sendMessage(msg.chat.id, "Have a nice day " + msg.from.first_name);
        }
    
        var robot = "I'm robot";
        if (msg.text.indexOf(robot) === 0) {
            bot.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
        }
    }

    if(users_details[id].command==="/maths" && message!=="/maths"){
        let condition = numberOperatorChecker(message)
        if (condition){

            answer = calculate(message)
            if (isNaN(answer)){
                bot.sendMessage(msg.from.id,"Please send a valid Questions")
            }else{
            bot.sendMessage(msg.from.id, "Your answer is " + answer);
            }
        }else if(users_details[id].command==="/maths"){
            bot.sendMessage(msg.chat.id,"Invalid Query" );
            bot.sendMessage(msg.chat.id,"Please send me a valid query" );       
        }
        
    }
    if (message[0]==="/" && !(["/start","/maths","/add_number","/help","/search","/save", "/commands"].includes(message))){
        bot.sendMessage(msg.chat.id,"Unrecognized command. Say what?" ); 
    }
    
    })
}


app.get('/', async function(req, res, next) {
    res.send({"Success": "Welcome!, we are happy to see you here :)"});
});
 

app.listen(PORT, async () => {
    console.log('app running on port', PORT);
    await init(bot)
})


