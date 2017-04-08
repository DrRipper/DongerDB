var request = require('request');
var cheerio = require('cheerio');
var builder = require('botbuilder');

var plotly = require('plotly')("dongerdb", "eVIZfCpnnrqlj6qSS2G8");

function plotWinrate(winrate)
{
	var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
	var layout = {fileopt : "overwrite", filename : "simple-node-example"};

	plotly.plot(data, layout, function (err, msg) {
		if (err) return console.log(err);
		console.log(msg);
	});
}


function linkChamp(session,name)
{
	var link = "http://gameinfo.euw.leagueoflegends.com/fr/game-info/champions/" + name.toLowerCase() + "/";
	return builder.CardAction.openUrl(session, link, "Learn more about this champion");
}

module.exports = {
	get_winrate : function(session, champion) { 
		var url = 'http://champion.gg/champion/' + champion;
		//console.log(url);
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
				var result = $('#statistics-win-rate-row td:nth-child(2)');
				
				var winrate = result[0].children[0].data.trim();
				
				var msg = new builder.Message(session)
				.textFormat(builder.TextFormat.xml)
				.attachmentLayout(builder.AttachmentLayout.carousel)
				.attachments([
					new builder.HeroCard(session)
						.buttons([ linkChamp(session,champion) ])
						.images([ builder.CardImage.create(session, "http://ddragon.leagueoflegends.com/cdn/7.6.1/img/champion/" + champion + ".png" ) ])
				]);
				
				session.send(msg);
				
				session.send(
					champion+"'s winrate is **"+winrate+"**"
				);
				
				session.send(
					plotWinrate(12)
				);
			}
		});
	}
	
	
	
	
}