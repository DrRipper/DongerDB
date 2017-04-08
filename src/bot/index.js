const 
	builder = require('botbuilder'),
	request = require('request'),
	restify = require('restify'),
	apiCall = require('./riot_api_call.js'),
	winrate = require('./scrap_winrate.js'),
	counters = require('./scrap_counters.js');
	
const server = restify.createServer();

server.listen(3978, () => {
   console.log('Listening on port 3978'); 
});


/* 
	Bot framework connection
*/
const connector = new builder.ChatConnector({
    appId: '8b6d5d5d-bd23-4988-b58b-631a9ce0d91b',
    appPassword: 'ASK' //TODO
});

const bot = new builder.UniversalBot(connector);
server.post('/', connector.listen());

class ApiAiRecognizer {
  constructor(token) { this._token = token; }

  recognize(context, done) {
    const opts = {
      url: 'https://api.api.ai/v1/query?v=20150910',
      headers: { Authorization: `Bearer ${this._token}` },
      json: {
        query: context.message.text,
        lang: 'en',
        sessionId: '0000',
      },
    };

    request.post(opts, (err, res, body) => {
      if (err) return done(err);

      return done(null, {
        score: body.result.score,
        intent: body.result.metadata.intentName,
        entities: body.result.parameters,
		response: body.result.fulfillment.speech,
      });
    });
  }
}

const recognizer = new   ApiAiRecognizer('dbf752852e5b485187b497f361822525');

const intents = new builder.IntentDialog({
  recognizers: [recognizer],
});

bot.dialog('/', intents);

/*
	Message then the bot doen't understand the question
*/
intents.onDefault([
  (session) => {
    session.send(
      'I\'m not train enought to help you with this question.'
    );
	var msg = new builder.Message(session)
	.textFormat(builder.TextFormat.xml)
	.attachmentLayout(builder.AttachmentLayout.carousel)
	.attachments([
		new builder.HeroCard(session)
			.buttons([
				builder.CardAction.imBack(session, "help", "Help")
			])
	]);
	session.send(msg);
  }
]);

/*
	list what the user can ask to the bot
*/
intents.matches('help', [
  (session, args) => {
    session.send(
		args.response
    );
  }
]);

intents.matches('welcome', [
  (session, args) => {
    session.send(
		args.response
    );
  }
]);

/*
	return the best player of a given region 
*/
intents.matches('get_best_player', [
  (session, args) => {
    session.send(
		args.response
    );
	var result = apiCall.get_best(session, args.entities.region);
  }
]);

intents.matches('ask_winrate', [
  (session, args) => {
    session.send(
		args.response
    );
	winrate.get_winrate(session, args.entities.champion);
  }
]);

intents.matches('ask_counter', [
  (session, args) => {
    session.send(
		args.response
    );
	counters.get_counters(session, args.entities.champion);
  }
]);

intents.matches('player_information', [
  (session, args) => {
	var name;
	session.send(
		 name = builder.Prompts.text(session,"Which player would you like information on?")
	);
	session.send(
		name
		);
  }
]);

/*intents.matches('get_winrate', [
  (session, args) => {
    session.send(
		args.response
      //'You want to order a pizza %s',    
      //args.entities.pizza_type
    );
  }
]);*/