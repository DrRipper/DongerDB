# DongerDB

DongerDB is a chatbot based on League Of Legends

What is the code organisation of the bot ? 
  src : landing page code
  src/bot : bot code with index.js that contains the class ApiAiRecognizer and the bot framework connection

How works DongerDB ? 
  DongerDB works via bot framework and slack. 
  You can ask some questions to the bot and it will retrieve data using scraping and the rio api to answer them. 
  
What you can do with the bot ? 

  - ask who is the best player of a region (used riot api) --> na (north america), jp (japan), kr (korea), euw (europe)
  - ask how to kill a champion (used scraping) --> list of them are available here : http://gameinfo.euw.leagueoflegends.com/fr/game-info/champions/ 
  - ask what is the winrate of a given champion (used scraping)



