const { 
    Telegraf,
    Markup
} = require('telegraf');
require('dotenv').config();
const text = require('./const');
const {getISOWeek} = require('date-fns');
const bot = new Telegraf(process.env.BOT_TOKEN);
let temp = '101001010010';
let previousDate = new Date();

const http = require('http');
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Ready!\n');
});
server.listen('8080', () => {
    console.log(`Сервер запущен на порту 8080`);
});

const buttonWeek = Markup.button.callback('Следующая неделя', 'callbackButton');
const keyboard = Markup.inlineKeyboard([buttonWeek]);

function checkCar(temp) {
    switch (temp.substring(temp.length - 4, temp.length)) {
        case '1010':
            return false;
        case '0100':
            return true;
        case '1001':
            return false;
        case '0010':
            return true;
    };  
};

function checkWeek(ctx, tempDate) {
        const currentWeek = getISOWeek(tempDate);
        let days = '', tempTable = temp;

        while (getISOWeek(tempDate) == currentWeek) {
            if (checkCar(tempTable)) {
                tempDate.setDate(tempDate.getDate() + 1);
                days += `${tempDate.getDate()}.${tempDate.getMonth() + 1}.${tempDate.getFullYear()}; `;
                tempTable += '1';
            } else {
                tempTable += '0';
                tempDate.setDate(tempDate.getDate() + 1);
            }
            
        }

        return days
};

bot.start((ctx) => ctx.reply(`Здарово, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Привет, ноунейм'}`));

bot.command('today', (ctx) => {
    try {
        const currentDate = new Date();

        if (currentDate.getDate() !== previousDate.getDate()) {
            previousDate = currentDate;
            checkCar(temp) ? temp += '1' : temp += '0';

            if (temp.length > 8) {
                temp = temp.slice(temp.length - 4);
                console.log(temp);
            }
        };
        ctx.reply(`Сегодня ${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} \n${temp.slice(-1) === '1' ? 'Едем на цефире' : 'Едем на пазике'}`);
    } catch(e)  {
        console.error(e);
    }
});

bot.command('week', (ctx) => {
    try {
        const tmpDate = new Date();
        ctx.reply(`На этой неделе едем на цефире в следующие даты: \n${checkWeek(ctx, tmpDate)}`, keyboard);
    } catch(e) {
        console.error(e);
    }
})

bot.help((ctx) => ctx.reply(text.commands));

bot.action('callbackButton', (ctx) => {
    const tempDate = new Date();
    let tempTable = temp;
    
    while (getISOWeek(tempDate) == getISOWeek(previousDate)) {
        if (checkCar(tempTable)) {
            tempTable += '1';
        } else {tempTable += '0'}
        tempDate.setDate(tempDate.getDate() + 1);
    }
    
    ctx.reply(`На следующей неделе едем на цефире в следующие даты: \n${checkWeek(ctx, tempDate)}`);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));