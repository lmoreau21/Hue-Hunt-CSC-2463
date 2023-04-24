/*https://youtu.be/ZAcpYT4nm6E
* the output on the ardunio is the rgb light
  * its greenish during the main menu (it has a little bit of randomness)
  * its off during the game
  * it flashed red whenever you smash a bug
* the input is the joystick
  * moving the joystick moves the red dot which is the cursor
  * pressing down on the joystick is like right clicking to smash a bug
  * it also allows you to start the game by clicking
*/

let port;
let writer, reader;
const encoder = new TextEncoder();
const decorder = new TextDecoder();
let xValue = 00;
let yValue = 00;
let isPressedButton = 1;
let isPressed = false;

let redC = [250,0,0];
let orangeC = [255,140,0];
let yellowC = [255,255,0];
let greenC = [0,255,0];
let lBlueC = [0,255,255];
let dBlueC = [0,0,255];
let purpleC = [188,0,241];
let pinkC = [255,105,180];
let organgeLED = [255,30,0];
let pinkLED = [150,20,20];
let yellowLED = [200,100,0];
let colorList=[redC,orangeC,yellowC,greenC,lBlueC,dBlueC,purpleC,pinkC];
let map = [];
let mapColor = [];
let roundColor;
let ledRoundColor;
//images
let charactersheet;
let characterdata;
let animation = [];
//let death = [];
let character;

//timers and counters
const startTime = 10;
let mainTime = startTime;
let timer = startTime;
//let nextChange = timer;
let gameDelay = 0;

//controls game starting or not
let gameOver = true;
let roundOver = true;


//score/round variables
let score = 0;
let highScore = score;
let gamesPlayed = 0;
//Tone.Transport.start();
let soundsOn = false;
let dAni = [];
let rAni = [];
let lAni = []; 
let uAni = [];
let stand = [];
// create a new Tone.js synth1
let synth;
// define the notes of the Gravity Falls theme song
const notes =  [
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "E3", "D3", "E3", "F3", "G3", "E3", "C3", "D3", "E3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "G3", "F3", "G3", "A3", "B3", "G3", "E3", "F3", "G3",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "C4", "B3", "C4", "D4", "E4", "C4", "A3", "B3", "C4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4",
  "E4", "D4", "E4", "F4", "G4", "E4", "C4", "D4", "E4"
];
const bugSound = ["C4", "D#4", "F#4", "A4"];
const titleScreenNotes = [
  "C3", "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5",
  "C3", "F3", "A3", "C4", "F4", "A4", "C5", "F5", "A5",
  "Bb2", "D3", "F3", "Bb3", "D4", "F4", "Bb4", "D5", "F5",
  "Bb2", "Db3", "F3", "Bb3", "Db4", "F4", "Bb4", "Db5", "F5"
];

let gameOverSound = new Tone.Player("level.mp3").toDestination();
gameOverSound.volume.value = 13;
let levelUp = new Tone.Player("nextLevel.mp3").toDestination();
levelUp.volume.value = 5;

const distortion = new Tone.Distortion(0.8).toDestination();
const reverb = new Tone.Reverb(1.5).toDestination();

// define the duration for each note
let durationS = .22;
let curSound, gamesynth;
let index = 0;
// let bugSeq =  new Tone.Sequence((time, note) => {
//   index++;
//   gamesynth.triggerAttackRelease(note, ".1", time);
//   if(index>=bugSound.length){
//     index=0;
//     bugSeq.stop();
//   }
// }, bugSound, ".1");

const playNotes = () => {
  // schedule the notes to be played

  let index = 0;
  curSound = titleScreenNotes;
  Tone.Transport.scheduleRepeat((time) => {
    if(gameOver) { curSound = titleScreenNotes; }
    else curSound = notes;
    let note = curSound[index];
    synth.triggerAttackRelease(note, durationS, time);
    index = (index + 1) % curSound.length;
  },durationS);
}

// set the tempo and start the transport
function preload() {
  synth = new Tone.Synth({
    oscillator:{
      type:'triangle'
    },
    envelope: { 
      attack: 0.4,
      decay: 0.2,
      sustain: .21,
      release: 14
    }
  }).toDestination();
  synth.volume.value=-3;

  gamesynth = new Tone.Synth({
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: .9,
		decay: .9,
		sustain: 0.5,
		release: 0.3,
    }
  }).chain(distortion, reverb);
  charactersheet = loadImage('dog.png');  

  //if(soundsOn) playNotes();
}

//converts images to animation
function setup() {
  
  createCanvas(1023/2, 1023/2-20);
  //background("lightgray");
  //background("gray")
  
  if ("serial" in navigator) {
    textAlign(CENTER,CENTER);
    textSize(22);
    
    let button = createButton("Ardunio");
    button.position(width/2-20,height+10);
    button.mousePressed(connect);
  }
  
  for (let i = 0; i < 4; i++) {
      dAni.push(charactersheet.get(32*i, 0*32,32, 32));
      rAni.push(charactersheet.get(32*i, 1*32,32, 32));
      uAni.push(charactersheet.get(32*i, 2*32,32, 32));
      lAni.push(charactersheet.get(32*i, 3*32,32, 32));
      stand.push(charactersheet.get(32*i, 4*32,32, 32));
  }
  
  character = new Sprite();
 
  //playNotes();
  let colorIndex = int(random(colorList.length));
  roundColor = colorList[colorIndex];

  newLevel();
  drawMap();

  changeBackgroundColor();

  let ruleButton = createButton("Rules");
  ruleButton.position(20,height+10);
  ruleButton.mousePressed(popUp);

  let soundButton = createButton("Sound");
  soundButton.position(width-50,height+10);
  soundButton.mousePressed(startSound);
}

function startSound(){
  Tone.Transport.start();
  Tone.start(); 
  soundsOn = !soundsOn;
  console.log("Sound: "+soundsOn);
}


//setInterval(changeBackgroundColor, 1000);
function draw() {
  

  if(reader){
    if(isPressedButton==0&&!isPressed){
      buttonPressed();
    }else if(isPressedButton==1){
      isPressed = false;
    }
  }else{
    if(gameOver&&!isPressed&&keyIsDown(ENTER)){
      score = 0;
      gameOver = false;
      roundOver = false;
      //buttonPressed();
      isPressed = true;
      //console.log("Start")
    }else if(!isPressed&&keyIsDown(ENTER)){
      //console.log("press"+timer+isPressed);
      isPressed = true;
      roundOver = true;
    }else if(!keyIsDown(ENTER)){
      isPressed = false;
    }
  }
  if (reader && frameCount%3==0) {
    serialRead();
  }
  if(writer&&gameOver&&frameCount%10==0){
    writer.write(encoder.encode(255+","+255+","+255+"\n"));
  }
  
  textFont('cursive');
  
  
  if(!gameOver){
    
    background("lightgray");
    if(writer&&frameCount%5==0){
      //writer.write(encoder.encode(roundColor[0]+","+roundColor[1]+","+roundColor[2]+"\n"));
      //console.log(encoder.encode(roundColor[0]+","+roundColor[1]+","+roundColor[2]+"\n"));
      writer.write(encoder.encode(ledColorSwap()+"\n"));
      //console.log(roundColor);
    }
    for(let tileC of map){
      tileC.show();
    }
    
    if(reader){
      joystick();
    }else{
    if(keyIsDown(RIGHT_ARROW)){
      character.walk(2,0);
      character.show(rAni);
    }else if(keyIsDown(LEFT_ARROW)){
     character.walk(-2,0);
     character.show(lAni);
    }else if(keyIsDown(UP_ARROW)){
      character.walk(0,-2);
      character.show(uAni);
    }else if(keyIsDown(DOWN_ARROW)){
      character.walk(0,2);
      character.show(dAni);
    } else{
      character.dogSit();
    }
    }
    fill("white")
    rect(0, 0, width-1, 45);
    fill("black");
    if (!reader) {
      fill(roundColor);
      rect(width/2+15,5,35,35)
      fill("black");
      textAlign(CENTER)
      text("Hue Hunt: ", width/2-40, 30);
    }else{
      textAlign(CENTER)
      text("Hue Hunt", width/2, 30);
    }
    textSize(20);
    textAlign(RIGHT)
    text('Score: '+score, width-15, 30);
    textAlign(LEFT)
    text('Time: '+timer, 10, 30);
   
    if(roundOver){
      if(mapColor[character.spritePos()]==roundColor){
        resetRound();
        score++;
        if(soundsOn) levelUp.start();
      }else{
        gameOver=true;
      }      
    }
    if (timer <= 0 || gameOver) {
      if(mapColor[character.spritePos()]==roundColor){
        resetRound();
        score++;
        if(soundsOn) levelUp.start();
      }else{
        gameOver=true;
        gamesPlayed++;
        resetRound();
        changeBackgroundColor();
        if(soundsOn) gameOverSound.start(); 
      }
        
      }          
    
    if (round((millis()-gameDelay)/1000) == mainTime-timer+1 && timer>=0) {
      timer--;
            //synth.envelope.attack -= .01;

    }
  }else{
    
    if(frameCount%60==0) changeBackgroundColor();
    fill("lightgray")
    rect(width/8, height/4, width*3/4, height/2);
    fill("black")
    textAlign("center")
    
    //resets variables
    
    gameDelay = millis();
    
    timer = startTime;
    mainTime = startTime;
    textSize(20);
    durationS = .25;
    synth.envelope.attack = .35;
    //displays if there was a highscore or highest accuracy
    fill("red")
    if(score>=highScore && gamesPlayed != 0){
      highScore = score;
      text("New High Score!", width/2, height/2+20);
    }
  
    //displays gameover if a round just finished
    fill("black")
    if(gamesPlayed!=0){
      textSize(40);
      text("Game Over", width/2, 60)
    }else{
      textSize(20);
      if(!reader)
        text("Move with arrows and \npress enter to lock in color", width/2, height/2);
      else
        text("Move with joystick and \npress it to lock in color", width/2, height/2)
    }

    //Adds score information
    textSize(30);
    if(!reader)
      text("Press enter to start", width/2, height/3+30);
    else 
      text("Press joystick to start", width/2, height/3+30);
    textSize(20);
    text("Score: "+ score, width/2, height/2+50);
    text("Highest Score: "+highScore,width/2, height/2+75);
    textAlign("left")
  }
}

//adds to total for mouse is clicked to modify accuracy score
function buttonPressed() {
  if(gameOver&&!isPressed){
    score = 0;
    gameOver = false;
    roundOver = false;
    //buttonPressed();
    isPressed = true;
    //console.log("Start")
  }else if(!isPressed){
    //console.log("press"+timer+isPressed);
    isPressed = true;
    roundOver = true;
  }
}
function joystick(){
  if(xValue>520&&((yValue<500&&xValue<yValue)||(yValue>520&&xValue>yValue)||(yValue>500&&yValue<520))){
    character.walk(2,0);
    character.show(rAni);
  }else if(xValue<500&&((yValue<500&&xValue<yValue)||(yValue>520&&xValue>yValue)||(yValue>500&&yValue<520))){
   character.walk(-2,0);
   character.show(lAni);
  }else if(yValue<500){
    character.walk(0,-2);
    character.show(uAni);
  }else if(yValue>520){
    character.walk(0,2);
    character.show(dAni);
  } else{
    character.dogSit();
  }
}

function changeBackgroundColor() {
  background(random(150)+100,random(150)+100,random(150)+100);
}

function resetRound(){
  if(writer){
    writer.write(encoder.encode(0+","+0+","+0+"\n"));
    
  }

  newLevel();
  gameDelay = millis();
  if(!reader){
    timer+=2;
  }else{
    timer += 5;
  }
  mainTime = timer;
  drawMap();
  roundOver=false;
  let colorIndex = int(random(colorList.length));

  
  roundColor = colorList[colorIndex];
  //ledRoundColor = ledColorList[colorIndex];
  //console.log(roundColor+":"+ledRoundColor);
}

function ledColorSwap(){
  let colorValue = roundColor;
  switch(roundColor){
    case orangeC: colorValue = organgeLED; break;
    case pinkC: colorValue = pinkLED; break;
    case yellowC: colorValue = yellowLED; break;
  }
  return colorValue;


}

function newLevel(){

  mapColor = [];
  for(let i=0;i<7;i++){
    mapColor = mapColor.concat(colorList.sort(() => random() - 0.5));
  }
}

function drawMap(){
  let index=0;
  for(let i=0;i<7;i++){
    for(let j=0;j<8;j++){
      let size = width/8-5;
      map.push(new Tile(mapColor[index],size,j*size+4*j+5,i*size+4*i+50))
      index++;
      //console.log(map);
    }
  
  }
}
async function serialRead() {
  while(true) {
    const { value, done } = await reader.read();
    if (done) {
      reader.releaseLock();
      break;
    }
    let temp = splitTokens(value,',');
    xValue = temp[0];
    yValue = temp[1];
    isPressedButton = temp[2];   
  }
}
async function popUp(){
  window.alert("Rules: \nMove the sprite by using either the joystick or the arrow keys to a tile matching the color on the top of the screen or the rgb light."
          +"\nOnce the character is standing on the correct tile press enter or press down on the joystick."+
          "\n2 seconds will be added to the timer and the game continues until the timer reaches zero");
}

async function connect() {
  port = await navigator.serial.requestPort();

  await port.open({ baudRate: 9600 });

  writer = port.writable.getWriter();

  reader = port.readable
     .pipeThrough(new TextDecoderStream())
     .pipeThrough(new TransformStream(new LineBreakTransformer()))
     .getReader();
}

class LineBreakTransformer {
  constructor() {
    this.chunks = "";
  }

  transform(chunk, controller) {
    this.chunks += chunk;
    const lines = this.chunks.split("\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    controller.enqueue(this.chunks);
  }
}