# Warning !

> ⚠️ This library no longer works !  
> Use [Krosmap](https://github.com/CamilleAbella/Krosmap) instead.

<hr>

![Transparent Krosmaga](https://upload.wikimedia.org/wikipedia/fr/e/e7/Krosmaga_Logo.png)

# Krosmaga Wrapper

Rank view of players from Krosmaga for Node JS !

## Install

`npm install krosmaga`

## Syntaxe

```javascript
krosmaga.getUser( pseudo [, callback ])
krosmaga.getUserSeason( pseudo [, season [, callback ]])
```

## Examples

```javascript
const krosmaga = require("krosmaga")

// With callback
krosmaga.getUser("Ghom",console.log)

// With promise
krosmaga.getUser("Ghom")
	.then(console.log)
	.catch(console.error)
```

## Return

```json
{
    "global": {
        "position": 686,
        "elo": 1508,
        "win": 2519,
        "lose": 3108
    },
    "lastSeason": {
        "position": 180,
        "rank": 21,
        "win": 27,
        "lose": 4
    },
    "pseudo": "Ghom",
    "image": "https://s.ankama.com/www/static.ankama.com/web-avatar/1127.png",
    "description": "Ghom n'a pas encore rédigé de description personnalisée",
    "connection": "Dernière connexion : 17/05/2019",
    "inscription": "Inscrit depuis le 22/06/2013",
    "connectionTimestamp": 1560722400000,
    "inscriptionTimestamp": 1374444000000
}
```
