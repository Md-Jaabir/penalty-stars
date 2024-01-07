let progress = 0;
let timeout;
let progressBar = document.querySelector(".progress");
let dirSelection = document.querySelector(".direction-select");
let resultText=document.querySelector(".result-text");
let gkSelection = document.querySelector(".gk-select");
let logoConts=document.querySelectorAll(".scoreboard .row .logo")
let powerMeter = document.querySelector(".power-meter");
let ball = document.querySelector(".ball");
let scoreConts=document.querySelectorAll(".row .scores");
let goalkeeper = document.querySelector(".goalkeeper img");
let strikerJersey = document.querySelector(".striker .body");
let gloves=document.querySelector(".gloves");
let scoreboard=[[],[]];
let progressGoing = false;
let progressDone = false;
let direction = "middle";
let gkDirection = "middle";
let mode = "singleplayer";
let currentShot = randBetween(1, 100) % 2;
let currentGk = currentShot == 0 ? 1 : 0;
let currentStrikers = [0, 0];
let height;
let category;
let power;
let gkHeight="middle";
let allHeights=["top","middle","bottom"];
let stage=0;
let winner;
let penalties=[[],[]];
let dirs=["left","middle","right"];
let heights = {
  top: "33%",
  middle: "39%",
  bottom: "45%",
  miss: "26%"
}

let glovesPos={
  heights:{top:"32%",middle:"38%",bottom:"44%"},
  directions:{left:"24%",middle:"49%",right:"78%"}
}

let teams = [international[0], international[1]];

window.onload = () => {
  setAll();
  logoConts[0].src=teams[0].logo;
  logoConts[1].src=teams[1].logo;
  if(mode==="singleplayer"){
    if(currentShot===0){
      powerMeter.classList.remove("hide");
      dirSelection.classList.remove("hide");
    }else if(currentShot==1){
      let [dir,power]=aiDirectionandPower();
      detectBallHeight(power);
      selectDirection(dir);
      gkSelection.classList.remove("hide");
    }
  }else{
    powerMeter.classList.remove("hide");
    dirSelection.classList.remove("hide");
  }
}

function goTo(url){
  window.open(url,"_self");
}

function setAll() {
  goalkeeper.src = teams[currentGk].gk.jersey;
  strikerJersey.src = teams[currentShot].jersey;
  document.querySelector(".jersey-texts .name").innerHTML = teams[currentShot].players[currentStrikers[currentShot]].jersey_name;
  document.querySelector(".jersey-texts .jersey-number").innerHTML = teams[currentShot].players[currentStrikers[currentShot]].jersey_number;
  ball.style.top = "84%";
  ball.style.left = "41%";
  ball.style.height = "35px";
  ball.style.width = "35px";
  goalkeeper.style.opacity = "1";
  gloves.style.top="38%";
  gloves.style.left="49%";
}

function setBall(){
  ball.style.left = directions[direction];
  ball.style.top = heights[height];
  ball.style.height = "20px";
  ball.style.width = "20px";
}

function setGloves(){
  gloves.style.top=glovesPos.heights[gkHeight];
  gloves.style.left=glovesPos.directions[gkDirection];
}

function nextShot() {
  currentStrikers[currentShot]++;
  currentShot = currentShot == 0 ? 1 : 0;
  currentGk = currentShot == 0 ? 1 : 0;
  setAll();
}

let directions = {
  left: "20%",
  middle: "46%",
  right: "77%",
}

function randBetween(min, max) {
  return Math.floor(Math.random() * max + min);
}

function randomElement(arr) {
  return arr[randBetween(0, arr.length)];
}

function progressStart() {
  if (!progressGoing) {
    progressBar.classList.add("progress-anim");
    progressGoing = true;
    setTimeout(() => {
      if (!progressDone) {
        direction = "middle";
        progress = 100;
        progressBar.style.width = "100%";
        progressBar.classList.remove("progress-anim");
        progressDone = true;
        detectBallHeight(progress);
        hideDirectionSelect();
      }
    }, 1000);
  }
}



function hideDirectionSelect() {
  setTimeout(() => {
    dirSelection.classList.add("hide");
    powerMeter.classList.add("hide");
    progressBar.style.width = "0px";
    progressDone = false;
    progressGoing = false;
    if (direction && progress && mode == "multiplayer") {
      openGkSelection()
    }else if(direction && progress && mode == "singleplayer"){
      let gkDirection=aiGkDirection();
      gkSelect(gkDirection);
    }
  }, 1000);

}

function selectDirection(dir) {
  if (progressDone || !progressGoing) return;
  direction = dir;
  console.log(direction);
  let width = parseFloat(window.getComputedStyle(progressBar).getPropertyValue("width"));
  progressBar.style.width = width + "px";
  let powerMeterWidth=parseFloat(window.getComputedStyle(document.querySelector(".power-meter .meter")).getPropertyValue("width"));
  progress = Math.floor((width / powerMeterWidth * 100));
  progressBar.classList.remove("progress-anim");
  progressDone = true;
  detectBallHeight(progress);
  hideDirectionSelect();
}

function openGkSelection() {
  gkSelection.classList.remove("hide");
}

function gkSelect(dir) {
  gkDirection = dir;
  gkSelection.classList.add("hide");
  let ratingDiff=teams[currentGk].gk.goalkeeping_skill-teams[currentShot].players[currentStrikers[currentShot]].fc_24_penalty_rating;
  category= selectCategory(ratingDiff);
  let gkGuess=randomElement(categories[category]);
  if(gkGuess=="c"){
    gkHeight=height;
  }else{
    gkHeight=randomElement(allHeights);
  }
  if((gkDirection===direction && height===gkHeight) || height=="miss"){
    console.log("Directions --- gk:"+gkDirection+" striker:"+direction);
    console.log("Heights --- gk:"+gkHeight+" striker:"+height);
    penalties[currentShot].push("save");
    if(scoreboard[0].length==5 && scoreboard[1].length==4){
      scoreboard[currentShot].push("save");
      stage=1;
      clearScoreboard();
    }else{
      scoreboard[currentShot].push("save");
    }
    setTimeout(()=>{
      resultText.innerHTML="SAVE!!!";
      resultText.classList.remove("hide");
    },2000)
  }else{
    console.log("Directions --- gk:"+gkDirection+" striker:"+direction);
    console.log("Heights --- gk:"+gkHeight+" striker:"+height);
    penalties[currentShot].push("goal");
    if(scoreboard[currentGk].length==5 && scoreboard[currentShot].length==4){
      scoreboard[currentShot].push("goal");
      stage=1;
      clearScoreboard();
    }else{
      scoreboard[currentShot].push("goal");
    }
    setTimeout(()=>{
      resultText.innerHTML="GOAL!!!";
      resultText.classList.remove("hide");
    },2000)
  }
  
  setTimeout(() => {
    shootBall();
  }, 500);
}

function fetchScoreboard(){
  
  scoreConts[0].innerHTML=scoreboard[0].map((score)=>`<div class="${score}"></div>`).join("");
  scoreConts[1].innerHTML=scoreboard[1].map((score)=>`<div class="${score}"></div>`).join("");
}

function clearScoreboard(){
  scoreboard=[[],[]];
  
}

function detectBallHeight(progress) {
  if (progress <= 30) {
    height = "bottom";
  } else if (progress <= 60) {
    height = "middle";
  } else if (progress <= 90) {
    height = "top";
  } else {
    height = randomElement(wrong);
  }
}



function shootBall() {
  document.querySelector(".striker .leg-2").classList.add("shoot-animation");
  setTimeout(() => {
    document.querySelector(".striker .leg-2").classList.remove("shoot-animation");
    goalkeeper.style.opacity = ".3";
  }, 500);

  setTimeout(() => {
    setBall();
    setGloves();
  }, 350);
  setTimeout(() => {
    fetchScoreboard();
    checkWinner();
    if(winner===0 || winner===1){
      goTo(`./win.html?winner${winner}`);
      return;
    }
    nextShot();
    if(mode==="multiplayer"){
      dirSelection.classList.remove("hide");
      powerMeter.classList.remove("hide");
    }else{
      if(currentShot===0){
        powerMeter.classList.remove("hide");
        dirSelection.classList.remove("hide");
      }else if(currentShot==1){
        let [dir,power]=aiDirectionandPower();
        detectBallHeight(power);
        direction=dir;
        gkSelection.classList.remove("hide");
      }
    }
    resultText.classList.add("hide");
  }, 3000);

}

function aiDirectionandPower(){
  return [randomElement(dirs),randBetween(1,100)];
}

function aiGkDirection(){
  return randomElement(dirs);
}


function checkWinner(){
  let goals=[0,0];
  let shots=[penalties[0].length,penalties[1].length];
  penalties[0].forEach(penalty=>{
    penalty === "goal" && goals[0]++;
  });
  penalties[1].forEach(penalty=>{
    penalty === "goal" && goals[1]++;
  });

  if(stage===0){
    if(goals[0]>goals[1]+(5-shots[1])){
      winner=0;
    }else if(goals[1]>goals[0]+(5-shots[0])){
      winner=1;
    }

  }else{
    if(shots[0]===shots[1]){
      if(goals[0]>goals[1]){
        winner=0;
      }else if(goals[1]>goals[0]){
        winner=1;
      }
    }
  }
}
