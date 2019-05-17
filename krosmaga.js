
const request = require("request")


module.exports.getUser = async function(pseudo,callback){
	const json = {global:{},lastSeason:{}}
	const result = await Promise.all([
		requestBody(`https://account.ankama.com/fr/profil-ankama/${pseudo}`),
		requestBody(`https://www.krosmaga.com/fr/communaute/ladder/eternel?search=${pseudo}#jt_list`),
		requestBody(`https://www.krosmaga.com/fr/communaute/ladder/saisonnier?season=&search=${pseudo}#jt_list`)
	])
	if(result.includes(false)) throw Error("request error")
	const [account,userGlobal,userSeason] = result
	Object.assign(json,parseAccount(account))
	Object.assign(json.global,parsePosition(userGlobal))
	Object.assign(json.lastSeason,parsePosition(userSeason))
	if(callback){
		callback(json)
	}
	return json
}

module.exports.getUserSeason = async function(pseudo,season,callback){
	const json = {}
	const userSeason = await requestBody(`https://www.krosmaga.com/fr/communaute/ladder/saisonnier?season=${season?season:""}&search=${pseudo}#jt_list`)
	Object.assign(json,parsePosition(userSeason))
	if(callback){
		callback(json)
	}
	return json
}

function requestBody(url){
	return new Promise(function(resolve,reject){
		request(url,function(error,response,body){
			if(error) return resolve(false)
			resolve(body)
		})
	})
}

function parseAccount(body){
	const json = {}
	if(!body.includes("est indisponible ou n'existe pas")){
		const lines = body.split(/(<\/div>|<div )/g)
		json.pseudo = lines.find(line=>line.includes('<h1>Profil ankama de')).replace('class="ak-panel-content">\n<h1>Profil ankama de',"").replace('</h1>\n',"").trim()
		json.image = lines.find(line=>line.includes('class="img-responsive ak-thumb"')).replace('class="ak-avatar">\n<img src="',"")
		json.image = json.image.slice(0,json.image.indexOf('"'))
		json.description = lines.find(line=>line.includes('class="ak-bbcode-content"')).replace('class="ak-bbcode-content">',"").trim()
		json.connection = lines.find(line=>line.includes('class="ak-last-connection"')).replace('class="ak-last-connection">',"").trim()
		json.inscription = lines.find(line=>line.includes('Inscrit depuis le')).replace('class="ak-infos">\n\n<div>',"").trim()
		json.connectionTimestamp = (new Date(...json.connection.replace('Dernière connexion : ',"").split("/").map(e=>Number(e)).reverse())).getTime()
		json.inscriptionTimestamp = (new Date(...json.inscription.replace('Inscrit depuis le',"").split("/").map(e=>Number(e)).reverse())).getTime()
	}
	return json
}

function parsePosition(body){
	const json = {}
	if(!body.includes("éléments correspondent à vos critères")){
		const lines = body.split(/(<\/td>|<td )/g)
		json.position = lines.find(line=>line.includes('<span class="ak-icon-position ak-position-')).replace(/[^\d]+/g,"").trim()
		json.position = Number(json.position.slice(json.position.length/2))
		if(body.includes('class="ak-elo"')){
			json.elo = Number(lines.find(line=>line.includes('class="ak-elo"')).match(/(\d+)/)[1])
		}else{
			json.rank = lines.find(line=>line.includes('class="ak-rank ak-rank-')).replace(/[^\d]+/g,"").trim()
			json.rank = Number(json.rank.slice(json.rank.length/2))
		}
		json.win = Number(lines.find(line=>line.includes('class="ak-win-lose"')).match(/ak-win">(\d+)/)[1])
		json.lose = Number(lines.find(line=>line.includes('class="ak-win-lose"')).match(/ak-lose">(\d+)/)[1])
	}
	return json
}