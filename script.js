const board = document.getElementById("board");
const cursor = document.getElementById("newCursor");
let n = 0;
let score = 0;
var player = "";
var highestScores = [];

window.addEventListener('load', (event) => {
  while(player == null || player == "" ){
    player = window.prompt("What's your name?");
}
document.getElementById("player").innerHTML = player;
game();
})



function altCursor(e)
{
  var x = e.clientX;
  var y = e.clientY;
  cursor.style.left = x + 'px';
  cursor.style.top = y + 'px';
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }
  
async function game() {
  cursor.style.display = "block"
  board.style.cursor = "none";
  document.addEventListener('mousemove', altCursor)
    while(true){
        let t= Math.random() * 2000;
        await delay(t);
        if (n<3) {makeZombie();}
    }
    
  }

function makeZombie() {
    const zombie = document.createElement("div");
    zombie.style.backgroundImage = "url('images/walkingdead.png')"
    zombie.classList.add("zombie");
    let vh = window.innerHeight
    const x = Math.floor(Math.random()*64)/64 + 0.5;
    let zwidth = 200*x
    let zheight = 312*x
    let zbottom = Math.random() * vh/5;
    zombie.style.height = zheight + "px";
    zombie.style.width = zwidth + "px";
;   zombie.style.bottom = zbottom + "px";
    zombie.style.zIndex = 1000000-parseInt(zbottom);
    board.appendChild(zombie);
    zombieWalk(zombie, x);
    zombie.addEventListener('click', zombieKilled);
}

function zombieKilled(elem) {
    score += 12;
    document.getElementById("score").innerHTML = "SCORE: " + score;
    this.parentNode.removeChild(this);
}

function zombieLived(elem) {
  n++;
  document.getElementById("hp").innerHTML = "♡ ".repeat(n) + "♥ ".repeat(3-n);
  score -=6;
  document.getElementById("score").innerHTML = "SCORE: " + score;
  elem.parentNode.removeChild(elem); 
  if (n>2) {gameOver();}
}

function zombieWalk(elem, x) {
    let id = null;
    let pos = -300;
    clearInterval(id);
    const speed = Math.floor(Math.random()*5)+1
    id = setInterval(move, speed);
    const step = x*200;
    let frame = 0
    function move() {
      if (elem.offsetLeft < -350) {
        clearInterval(id);
        zombieLived(elem);
      } else {
        pos+= 1;
        elem.style.right = pos + 'px';
        elem.style.backgroundPosition = frame + "px 0px";
        if ((pos+300)%(speed*10)==0)
        frame += step*9;
        frame %= step*10;
      }
    }
}

async function gameOver() {
  for (elem of board.querySelectorAll(".zombie")) {
    elem.parentNode.removeChild(elem);  
  }
  
  var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  await fetch("https://jsonblob.com/api/jsonBlob/919204002651193344", requestOptions)
    .then(response => response.text())
    .then(result => updateScoreBoard(result))
    .catch(error => console.log('error', error));

    var newboard = JSON.stringify({
        "scoreboard": highestScores
    });
    
    requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      body: newboard,
      redirect: 'follow'
    };
    
   await fetch("https://jsonblob.com/api/jsonBlob/919204002651193344", requestOptions)
      .catch(error => console.log('error', error));
    
    endScreen(highestScores);
}

function updateScoreBoard(elem) {
  const wholesb = JSON.parse(elem)
  let sb  = wholesb.scoreboard;
  var obj = new Object();
  obj.name = player;
  obj.score = score;
  const d = new Date;
  const d2 = d.toDateString();
  obj.data = d2;
  sb.push(obj);
  sb.sort((x,y)=>{return y.score-x.score});
  highestScores = sb.slice(0,7);
  console.log(highestScores)
}

function endScreen(highest) {
  cursor.style.display = "none"
  board.style.cursor = "default";
  document.removeEventListener('mousemove', altCursor)

    const frame = document.createElement("div");
    frame.classList.add("frame");
    
    const gameOver = document.createElement("div");
      gameOver.appendChild(document.createTextNode("GAME OVER!"));
      frame.appendChild(gameOver)
    const highScores = document.createElement("div");
      highScores.appendChild(document.createTextNode("HIGHEST SCORES:"));
      frame.appendChild(highScores)

    for (let i in highest){
      let record = document.createElement("div");
        record.classList.add("record");
        frame.appendChild(record)
      let elem = document.createElement("div");
      let t = parseInt(i) + 1
        elem.appendChild(document.createTextNode(t+"."));
        record.appendChild(elem);
      elem = document.createElement("div");
        elem.appendChild(document.createTextNode(highest[i].name));
        record.appendChild(elem);
      elem = document.createElement("div");
        elem.appendChild(document.createTextNode(highest[i].score));
        record.appendChild(elem);
      elem = document.createElement("div");
        elem.appendChild(document.createTextNode(highest[i].data));
        record.appendChild(elem);
    }

    const playAgain = document.createElement("div");
      playAgain.appendChild(document.createTextNode("PLAY AGAIN!"));
      frame.appendChild(playAgain)
      playAgain.classList.add("playagain");
      playAgain.addEventListener('click', restartGame)
    
      board.appendChild(frame)
}

function restartGame(e) {
  for (elem of board.querySelectorAll(".frame")) {
    elem.parentNode.removeChild(elem);  
  }

  document.getElementById("score").innerHTML = "SCORE:";
  document.getElementById("hp").innerHTML = "♥ ♥ ♥ ";
  score = 0;
  n = 0;
  game();
}