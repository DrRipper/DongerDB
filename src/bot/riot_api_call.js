const 
	request = require('request'),
	builder = require('botbuilder');
	
module.exports = {
	get_best : function(session, region) { 
		
		var url = 'https://'+region+'.api.riotgames.com/api/lol/'+region+'/v2.5/league/challenger?type=RANKED_SOLO_5x5&api_key=ASK'; //TODO
		
		request.get({
			url: url,
			json: true,
			headers: {'User-Agent': 'request'}
		  }, (err, res, data) => {
			if (err) {
				console.log('Error:', err);
			} else if (res.statusCode !== 200) {
				console.log('Status:', res.statusCode);
			} else {
				// data is already parsed as JSON:
				var best = get_best_player(data);
			  
				//var result = data.entries[78].playerOrTeamName;
				session.send(
					"The best player in "+region+" is **"+best.name+"** with a **"+ (100*best.wins/(best.losses+best.wins)).toFixed(2) +" %** winrate and **"+best.point+"** league points."
				);
				var link = "http://www.lolking.net/leaderboards#/"+region+"/1";
				
				var msg = new builder.Message(session)
				.textFormat(builder.TextFormat.xml)
				.attachmentLayout(builder.AttachmentLayout.carousel)
				.attachments([
					new builder.HeroCard(session)
						.title("Show more")
						.text("You can access to the leaderboard by clicking in the link bellow.")
	
						.buttons([
							builder.CardAction.openUrl(session, link, "Show LeaderBoard")
						])
				]);
				session.send(msg);
			}
		});
		
	}
}

get_best_player = function(data) { 
	var maxLP=0;
	var idxBest;
	for (idx in data.entries) {
		if(data.entries[idx].leaguePoints > maxLP) {
			maxLP = data.entries[idx].leaguePoints;
			idxBest = idx;
		}
	}
	
	var wins = data.entries[idxBest].wins;
	var losses = data.entries[idxBest].losses;
	var bestName = data.entries[idxBest].playerOrTeamName;
	
	return {"wins":wins,
			"losses": losses,
			"name": bestName,
			"point": maxLP};
}
