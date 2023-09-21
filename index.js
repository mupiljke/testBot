const { 
    Telegraf,
    Markup
} = require('telegraf');
require('dotenv').config();
const text = require('./const');
const bot = new Telegraf(process.env.BOT_TOKEN);
let temp = '10100';
let previousDate = new Date();

function checkDate() {
    let currentDate = new Date();

    if (currentDate.getDate() !== previousDate.getDate()) {
        previousDate = currentDate;
        checkCar() ? temp += '1' : temp += '0';
    };

    setTimeout(checkDate, 3600000);
};
checkDate();

function checkCar() {
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

bot.start((ctx) => ctx.reply(`Здарово, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'Привет, ноунейм'}`));
bot.command('today', async (ctx) => {
    try {
        await ctx.reply(`Сегодня ${previousDate.getDate()}.${previousDate.getMonth()}.${previousDate.getFullYear()} \n${temp.slice(-1) === '1' ? 'Едем на цефире' : 'Едем на пазике'}`);
        //await ctx.replyWithPhoto({source: './img/jan.jpg'}, {caption: 'qwe'})
        //await ctx.reply(`Сегодня ${day}.${text.day.getMonth()}.${text.day.getFullYear()} \n${(day % 4 === 0 || (day - 2) % 4 === 0) ? ('Едем на цефире') : ('Едем на автобусе')}`)
        /*if (day % 4 === 0 || (day - 2) % 4 === 0) {
            await ctx.reply(`Сегодня ${day}.${text.day.getMonth()}.${text.day.getFullYear()} \nЕдем на цефире`)
        } else await ctx.reply(`Сегодня ${day}.${text.day.getMonth()}.${text.day.getFullYear()} \nЕдем на автобусе`)*/
    } catch(e)  {
        console.error(e);
    }
})

/*(bot.command('week', async (ctx) => {
    try {
        await ctx.reply
    } catch(e) {
        console.error(e);
    }
})*/

bot.help((ctx) => ctx.reply(text.commands.commands));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));