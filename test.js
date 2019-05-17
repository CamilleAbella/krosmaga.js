
const krosmaga = require("./krosmaga.js")

krosmaga.getUserSeason("ghom",20)
	.then(json=>console.log(JSON.stringify(json,null,"\t")))
	.catch(console.error)