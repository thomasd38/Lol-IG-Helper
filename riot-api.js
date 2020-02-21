function $(elem) {
    return document.querySelector(elem);
}

let summoner = "";
let url = new URL(window.location.href);
summoner = url.searchParams.get("summoner");
if (summoner == null) {
    summoner = "razz3ll";
}
getSummoner();
// PARTIE INTERESSANTE ! RIOT API CALL
function getSummoner() {
    let query = "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summoner+"?api_key=RGAPI-faab12bf-3d67-4cf0-a99e-b82ca104dbf1";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { // DO STUFF HERE
            summoner = JSON.parse(this.responseText);
            getCurrentMatch();
        }
    };
    xmlhttp.open("GET", query, true);
    xmlhttp.send();
}

function debugRiotApi(res, query) {
    console.log(query);
    console.log(res.status, res.statusText, JSON.parse(res.responseText).status.message);
}

function getCurrentMatch() {
    let query = "https://euw1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/"+summoner.id+"?api_key=RGAPI-faab12bf-3d67-4cf0-a99e-b82ca104dbf1";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) { // DO STUFF HERE
            summoner = JSON.parse(this.responseText);
            console.log(summoner);
        }
        else if (this.readyState == 4) {
            debugRiotApi(this, query);
        }
    };
    xmlhttp.open("GET", query, true);
    xmlhttp.send();
}
