import bot from '../controllers/bot'
import builder from 'botbuilder';
import 'isomorphic-fetch'
import { fetchCurrencies, fetchExchangeRate } from './data.js'

let intents = new builder.IntentDialog();
bot.dialog('/', intents);

let counter = 0
intents.onDefault([
  function (session, args, next) {
    if (!session.userData.name) {
        session.beginDialog('/profile');
    } else {
        next();
    }
  },
  function (session, results) {
    session.send(`Hey ${session.userData.name}!`);
    counter += 1;
    if (counter == 1){
      session.beginDialog('/help');
    }
  }
]);

intents.matches(/help/i, [
  function (session) {
    session.beginDialog('/help');
  }
]);

intents.matches(/^list currencies/i, [
  function (session) {
    fetchCurrencies()
    .then(response => {
      session.send(response)
    })
  }
]);

intents.matches(/^erb/i,[
  function (session) {
    fetchExchangeRate('USD', 'EUR')
    .then(response => {
      session.send(response)
    })
  }
])

bot.dialog('/profile', [
  function (session) {
      builder.Prompts.text(session, 'Hi! What is your name?');
  },
  function (session, results) {
      session.userData.name = results.response;
      session.endDialog();
  }
]);

bot.dialog('/help',[
  function (session) {
    session.send(
`
Here are a few of the things that I can help you with:
- list currencies
- help
`
    );
    session.endDialog();
  }
])
