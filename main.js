function $(elem) {
    return document.querySelector(elem);
}

function getSum(name) {
    for (let index = 0; index < summs.length; index++) {
        const element = summs[index];
        if (element.name == name) {
            return element;
        }
    }
}

let summs = [
    {
        name: "flash",      // 0
        cd: 300,
        shortName: "f"
    },
    {
        name: "heal",       // 1
        cd: 240,
        shortName: "heal"
    },
    {
        name: "ghost",      // 2
        cd: 180,
        shortName: "ghost"
    },
    {
        name: "teleport",   // 3
        cd: 360,
        shortName: "tp"
    },
    {
        name: "ignite",     // 4
        cd: 180,
        shortName: "ig"
    },
    {
        name: "barrier",      // 5
        cd: 180,
        shortName: "barrier"
    },
    {
        name: "cleanse",      // 6
        cd: 210,
        shortName: "cleanse"
    },
    {
        name: "exhaust",      // 7
        cd: 210,
        shortName: "exhaust"
    },
    {
        name: "smite",      // 7
        cd: 15,
        shortName: "smite"
    }
]
let players = [
    {
        pos: "top",
        sum1: "teleport",
        cd1: 360,
        sum2: "flash",
        cd2: 300
    },
    {
        pos: "jungle",
        sum1: "smite",
        cd1: 15,
        sum2: "flash",
        cd2: 300
    },
    {
        pos: "mid",
        sum1: "ignite",
        cd1: 180,
        sum2: "flash",
        cd2: 300
    },
    {
        pos: "adc",
        sum1: "heal",
        cd1: 240,
        sum2: "flash",
        cd2: 300
    },
    {
        pos: "support",
        sum1: "ignite",
        cd1: 180,
        sum2: "flash",
        cd2: 300
    }
]
let timer = 14;
let lastClick = 0;
let summsStr = "";

let globalPlayer = "";
let globalSum = 1;
let game;

function refreshTimer() {
    timer++;
    $('#timer').innerHTML = displaySecToMinSec(timer);
    players.forEach(element => {
        if (element.cd1 < getSum(element.sum1).cd) {
            if (element.cd1 == 0) {
                element.cd1 = getSum(element.sum1).cd;
                $('#'+element.pos+"SumHidder1").style.display = 'none';
            }
            else {
                $('#'+element.pos+"SumHidder1").style.display = 'block';
                $('#'+element.pos+"SumHidder1").innerHTML = secToMinSec(element.cd1);
                useSumm(element.pos, 1);
            }
        }
        if (element.cd2 < getSum(element.sum2).cd) {
            if (element.cd2 == 0) {
                element.cd2 = getSum(element.sum2).cd;
                $('#'+element.pos+"SumHidder2").style.display = 'none';
            }
            else {
                $('#'+element.pos+"SumHidder2").style.display = 'block';
                $('#'+element.pos+"SumHidder2").innerHTML = secToMinSec(element.cd2);
                useSumm(element.pos, 2);
            }
        }
    });
}

function getPlayer(pos) {
    for (let index = 0; index < players.length; index++) {
        const element = players[index];
        if (element.pos == pos) {
            return element;
        }
    }
}

function secToMinSec(s) {
    var minutes = Math.floor(s / 60);
    var seconds = s - minutes * 60;
    if (minutes == 0)
        return seconds;
    else
        return minutes+":"+seconds;
}

function displaySecToMinSec(s) {
    var minutes = Math.floor(s / 60);
    var seconds = s - minutes * 60;
    if (minutes == 0)
        return seconds+"s";
    else
        return minutes + "m "+seconds+"s";
}

function toggleSumm(pos, sum, id) {
    useSumm(pos, id);
    if (timer - lastClick > 2)
        summsStr = "";
    lastClick = timer;
    let summ = getSum(sum);
    let player = getPlayer(pos);
    summsStr += "" + pos + " " + summ.shortName + " " + secToMinSec(timer+summ.cd, true) + " ";
    copyStringToClipboard(summsStr);
}

function useSumm(pos, id) {
    for (let index = 0; index < players.length; index++) {
        const element = players[index];
        if (element.pos == pos) {
            if (id == 1) {
                players[index].cd1--;
            }
            else {
                players[index].cd2--;
            }
        }
    }
}

function changeSum(e, pos, sum) {
    e.preventDefault();
    let x = e.clientX;
    let y = e.clientY;
    globalPlayer = pos;
    globalSum = sum;
    $('#summs-menu').style.top = y+"px";
    $('#summs-menu').style.left = x+"px";
}

function closeSumMenu() {
    $('#summs-menu').style.left = "-999px";
}

function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

function switchSum(s) {
    let sum = getSum(s);
    let summNb = globalSum;
    $('#'+globalPlayer+"Sum"+summNb).src = "./img/"+sum.name+".png";
    $('#'+globalPlayer+"Sum"+summNb).setAttribute("onclick", "toggleSumm(\""+globalPlayer+"\",\""+sum.name+"\","+summNb+");");
    if (summNb == 1)
        setPlayerSum(globalPlayer,sum,1);
    else
        setPlayerSum(globalPlayer,sum,2);
    closeSumMenu();
}

function setPlayerSum(pos, sum, id) {
    for (let index = 0; index < players.length; index++) {
        const element = players[index];
        if (element.pos == pos) {
            if (id == 1) {
                players[index].sum1 = sum.name;
                players[index].cd1 = sum.cd;
            }
            else {
                players[index].sum2 = sum.name;
                players[index].cd2 = sum.cd;
            }
        }
    }
}

function startGame() {
    timer = parseInt($('#timerInputM').value, 10) * 60 + parseInt($('#timerInput').value, 10) - 1;
    refreshTimer();
    clearInterval(game);
    game = setInterval(() => {
        refreshTimer()
    }, 1000);
}

let HTML = "";
summs.forEach(element => {
    HTML += "<img onclick='switchSum(\""+element.name+"\")' src='./img/"+element.name+".png' class='summ'></div>";
});
$('#summs-menu').innerHTML = HTML;

HTML = "";
players.forEach(element => {
    HTML += "<div class='summs-container'>";
    HTML += "<div class='player-pos'>"+element.pos+"</div>";
    HTML += "<img id='"+element.pos+"Sum1' oncontextmenu='changeSum(event, \""+element.pos+"\",\"1\")' class='sum sum1' src='./img/"+element.sum1+".png' onclick='toggleSumm(\""+element.pos+"\",\""+element.sum1+"\",1);'>";
    HTML += "<img id='"+element.pos+"Sum2' oncontextmenu='changeSum(event, \""+element.pos+"\",\"2\")' class='sum sum2' src='./img/"+element.sum2+".png' onclick='toggleSumm(\""+element.pos+"\",\""+element.sum2+"\",2);'><br>";
    HTML += "<div class='summ-hidder sum1' oncontextmenu='changeSum(event, \""+element.pos+"\",\"1\")' id='"+element.pos+"SumHidder1'></div>";
    HTML += "<div class='summ-hidder sum2' oncontextmenu='changeSum(event, \""+element.pos+"\",\"2\")' id='"+element.pos+"SumHidder2'></div>";
    HTML += "</div>";
});
$('#container').innerHTML = HTML;

$('#timerInputM').value = 0;
$('#timerInput').value = 0;

startGame();

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == 27) {
        closeSumMenu();
    }
});
