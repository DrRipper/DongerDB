var request = require('request');
var cheerio = require('cheerio');
var builder = require('botbuilder');

function linkChamp(session,name)
{
	var link = "http://gameinfo.euw.leagueoflegends.com/fr/game-info/champions/" + name.toLowerCase() + "/";
	return builder.CardAction.openUrl(session, link, name);
}

module.exports = {
	get_counters : function(session, champion) { 
		var url = 'http://lolcounter.com/champions/' + champion;
		
		request.get({
			url: url,
			json: false,
			headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64; rv:52.0) Gecko/20100101 Firefox/52.0'}
		  }, (err, res, data) => {
			if (err) {
				console.log('Error:', err);
			} else if (res.statusCode !== 200) {
				console.log('Status:', res.statusCode);
			} else {
				
				var $ = cheerio.load(data);
				var result = $('.weak-block > .champ-block > .theinfo > a > .name');
				
				var counter1 = result[0].children[0].data;
				var counter2 = result[1].children[0].data;
				var counter3 = result[2].children[0].data;
				
				var result2 = $('.weak-block > .champ-block > .theinfo > .per-bar > div');
				var percent1 = (result2[0].attribs.style).split(' ')[1];
				var percent2 = (result2[1].attribs.style).split(' ')[1];
				var percent3 = (result2[2].attribs.style).split(' ')[1];
				
				/*var msg = new builder.Message(session)
				.attachments([
					new builder.ReceiptCard(session)
						.title("Top three")
						.items([
							builder.ReceiptItem.create(session, counter1, "1st").image(builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/Teemo.png")),
							builder.ReceiptItem.create(session, counter2, "2nd").image(builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + counter2 + ".png")),
							builder.ReceiptItem.create(session, counter3, "3rd").image(builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + counter3 + ".png"))

						])
						
				]);
				
				session.send(msg);*/
				
				
				var msg = new builder.Message(session)
				.textFormat(builder.TextFormat.plain)
				//.attachmentLayout(builder.AttachmentLayout.carousel)
				.text("**Here are the top three counter picks:**")
				.attachments([
					new builder.HeroCard(session)
						.buttons([ linkChamp(session,counter1) ])
						.text("With a counter rate of : "+percent1)
						.images([ builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + counter1 + ".png" ) ]),
					new builder.HeroCard(session)
						.buttons([ linkChamp(session,counter2) ])
						.text("With a counter rate of : "+percent2)
						.images([ builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + counter2 + ".png" ) ]),
					new builder.HeroCard(session)
						.buttons([ linkChamp(session,counter3) ])
						.text("With a counter rate of : "+percent3)
						.images([ builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + counter3 + ".png" ) ])
				]);
				
				session.send(msg);
				
				
			}
		});
	}
	
	
}