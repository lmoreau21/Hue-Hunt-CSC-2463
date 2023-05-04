/* Hue Hunt
* rules in the bottom left
* connect to the ardunio in the bottom middle
* press enter or press down on the joystick to start the game
* the timer starts at 10 seconds
* move the sprite using arrows or jostick to control the dog
* once you reach the color on the top of the screen or the rgb press enter or joystick
* this will add a couple seconds to the timer
* run to and select as many tiles as you can before the time reaches 0
*/
let port;
let writer, reader;
const encoder = new TextEncoder();
const decorder = new TextDecoder();
let xValue = 00;
let yValue = 00;
let isPressedButton = 1;
let isPressed = false;
let mode;
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

let soundsOn = false;
let dAni = [];
let rAni = [];
let lAni = []; 
let uAni = [];
let stand = [];
let isWalking = false;
// create a new Tone.js synth1
let synth;
let sequence
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
const titleScreenNotes = [
  "C3", "E3", "G3", "C4", "E4", "G4", "C5", "E5", "G5",
  "C3", "F3", "A3", "C4", "F4", "A4", "C5", "F5", "A5",
  "Bb2", "D3", "F3", "Bb3", "D4", "F4", "Bb4", "D5", "F5",
  "Bb2", "Db3", "F3", "Bb3", "Db4", "F4", "Bb4", "Db5", "F5"
];


const characterSet = new Map([
  ["BlondeDog", 0],
  ["BrownDog", 1],
  ["GoldCat", 2],
  ["GrayCat", 3],
  ["MulticolorDog", 4],
  ["OrangeCat", 5]
]);

const levelMode = new Map([
  ['Easy',1],
  ['Medium',2],
  ['Hard',3],
]);

let spriteX;
let spriteY;
//audio files defined in the preload
let gameOverSound;
let levelUp;
let footsteps;

const distortion = new Tone.Distortion(0.8).toDestination();
const reverb = new Tone.Reverb(1.5).toDestination();

// define the duration for each note
let durationS = .22;
let curSound, gamesynth;
let index = 0;

//user character list
let characterList = [];
let difficulty;
let characterSelect;

const playNotes = () => {
  // schedule the notes to be played
    let index = 0;
    curSound = titleScreenNotes;
    Tone.Transport.scheduleRepeat((time) => {
      if(gameOver) { curSound = titleScreenNotes; }
      else curSound = notes;
      let note = curSound[index];
      if(soundsOn&&!gameOver) synth.triggerAttackRelease(note, durationS, time);
      if(soundsOn&&gameOver) synthMainMenu.triggerAttackRelease(note, durationS, time);
      index = (index + 1) % curSound.length;
    },durationS);
  
}

// set the tempo and start the transport
function preload() {
  synth = new Tone.Synth({
    harmonicity:5,
    modulationIndex: 10,
    oscillator:{
      type:'triangle'
    },
    envelope: { 
      attack: 0.01,
        decay: 2,
        sustain: 1,
        release: 2
    },
  }).toDestination();
  synthMainMenu = new Tone.FMSynth({
    harmonicity:5,
    modulationIndex: 10,
    oscillator: {
        type:"sine"
    },
    envelope: {
        attack: 0.001,
        decay: 2,
        sustain: 0.1,
        release: 2
    },
    modulation : {
        type:"square"
    },
    modulationEnvelope : {
      attack: 0.002,
      decay: 0.2,
      sustain: 0,
      release: 0.2
    }
  }).toDestination();
  
  charactersheets = [loadImage('characters/blondedog.png'),loadImage('characters/browndog.png'),loadImage('characters/goldcat.png'),loadImage('characters/graycat.png'),loadImage('characters/multdog.png'),loadImage('characters/orangecat.png')];  
  
  gameOverSound = new Tone.Player("sounds/level.mp3").toDestination();
  gameOverSound.volume.value = 8;
  levelUp = new Tone.Player("sounds/nextlevel.mp3").toDestination();
  levelUp.volume.value = 5;
  footsteps = new Tone.Player("sounds/footsteps.mp3").toDestination();
  footsteps.loop = true;
  footsteps.volume.value = 10;
  footsteps.playbackRate = 1.2;

}

//converts images to animation and adds buttons
function setup() {
  
  createCanvas(1023/2, 1023/2-20);
  
  if ("serial" in navigator) {
    textAlign(CENTER,CENTER);
    textSize(22);
    
    let button = createButton("Ardunio");
    button.position(width/2-20,height+10);
    button.mousePressed(connect);
  }
  for(let sheet of charactersheets)
    createCharacter(sheet);
  character = characterList[1];

  
  playNotes();
  let colorIndex = int(random(colorList.length));
  roundColor = colorList[colorIndex];

  newLevel();
  drawMap();

  changeBackgroundColor();

  let ruleButton = createButton("Rules");
  ruleButton.position(20,height+10);
  ruleButton.mousePressed(popUp);

  let soundButton = createButton("Sound");
  soundButton.position(width-60,height+10);
  soundButton.mousePressed(startSound);

  characterSelect = createSelect();
  characterSelect.position(100, height+12);
  characterSelect.option("BlondeDog");
  characterSelect.option("BrownDog");
  characterSelect.option("GoldCat");
  characterSelect.option("GrayCat");
  characterSelect.option("MulticolorDog");
  characterSelect.option("OrangeCat");
  characterSelect.selected("BlondeDog");
  mode = createSelect();
  mode.position(width*2/3, height+12);
  mode.option("Easy");
  mode.option("Medium");
  mode.option("Hard");
  Tone.Transport.start();
  Tone.start();
}

function createCharacter(sheet){
  dAni = [];
  rAni = [];
  uAni = [];
  lAni = [];
  stand = [];
  for (let i = 0; i < 4; i++) {
      dAni.push(sheet.get(32*i, 0*32,32, 32));
      rAni.push(sheet.get(32*i, 1*32,32, 32));
      uAni.push(sheet.get(32*i, 2*32,32, 32));
      lAni.push(sheet.get(32*i, 3*32,32, 32));
      stand.push(sheet.get(32*i, 4*32,32, 32));
  }
  characterList.push(new Sprite(uAni,dAni,lAni,rAni,stand));
  
}

//togles sound
function startSound(){
  soundsOn = !soundsOn;
  Tone.Transport.start();
    Tone.start(); 
  if(soundsOn){
    Tone.Transport.start();
    Tone.start(); 
  }else{
    Tone.Transport.stop();
  }
}


function draw() { 
  //changes the character to the user selected one
  character = characterList[characterSet.get(characterSelect.value())];
  //font type
  textFont('Helvetica');
  //checks if serial is plugged in if button is pressed
  //these if statements and booleans forces it only to call a function once  
  if(reader){
    if(isPressedButton==0&&!isPressed){
      buttonPressed();
    }else if(isPressedButton==1){
      isPressed = false;
    }
  }else{
    //if enter is pressded it starts round
    if(gameOver&&!isPressed&&keyIsDown(ENTER)){
      score = 0;
      gameOver = false;
      roundOver = false;
      isPressed = true;
    }else if(!isPressed&&keyIsDown(ENTER)){
      isPressed = true;
      roundOver = true;
    }else if(!keyIsDown(ENTER)){
      isPressed = false;
    }
  }
  //collects joystick value
  if (reader && frameCount%3==0) {
    serialRead();
  }
  //causes led to be white when on game screen
  if(writer&&gameOver&&frameCount%10==0){
    writer.write(encoder.encode(255+","+255+","+255+"\n"));
  }
  
  //live game code
  if(!gameOver){
    background("lightgray");
    if(writer&&frameCount%5==0){
      writer.write(encoder.encode(ledColorSwap()+"\n"));
    }
    for(let tileC of map){
      tileC.show();
    }
    
    if(reader){
      joystick();
    }else{
      arrows();
    }

    fill("white")
    rect(0, 0, width-1, 45);
    fill("black");
    if (!reader) {
      fill(roundColor);
      rect(width/2+15,10,25,25)
      fill("black");
      textAlign(CENTER)
      text("Hue Hunt: ", width/2-40, 25);
    }else{
      textAlign(CENTER)
      text("Hue Hunt", width/2, 25);
    }
    textSize(20);
    textAlign(RIGHT)
    text('Score: '+score, width-15, 25);
    textAlign(LEFT)
    text('Time: '+timer, 10, 25);
   
    //if round is forced over by pressing or enter this will check score
    if(roundOver || timer <= 0){
      if(mapColor[character.spritePos()]==roundColor){
        resetRound();
        score++;
        if(soundsOn) levelUp.start();
      }else{
        gameOver=true;
        if(soundsOn) footsteps.stop();
      }      
    }
    //runs once at the end of every game
    if (gameOver) {
      gameOver=true;
      gamesPlayed++;
      resetRound();
      changeBackgroundColor();
      if(soundsOn) gameOverSound.start(); 
    }
             
    //updates time
    if (round((millis()-gameDelay)/1000) == mainTime-timer+1 && timer>=0) {
      timer--;
     
      //synth.envelope.attack -= .01;
      Tone.Transport.bpm.value = Tone.Transport.bpm.value + .1;
    }
  //game over/menu screen
  }else{
    
    if(frameCount%60==0) changeBackgroundColor();
    fill("lightgray")
    rect(width/8, height/4, width*3/4, height/2);
    fill("black")
   
    textAlign(CENTER)
    textSize(35);
    text("Hue Hunt", width/2, height/3);
    //resets variables
    isWalking = false;
    
    gameDelay = millis();
    Tone.Transport.bpm.value = 90;
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
      text("Press Button in bottom-left for Rules", width/2, height/2+20);
    }

    //Adds score information
    textSize(25);
    if(!reader)
      text("Press enter to start", width/2, height/3+50);
    else 
      text("Press joystick to start", width/2, height/3+50);
    textSize(20);
    text("Score: "+ score, width/2, height/2+50);
    text("Highest Score: "+highScore,width/2, height/2+75);
    textAlign("left")
  }
}

//added to mimic enter key being pressed
function buttonPressed() {
  if(gameOver&&!isPressed){
    score = 0;
    gameOver = false;
    roundOver = false;
    isPressed = true;
  }else if(!isPressed){
    isPressed = true;
    roundOver = true;
  }
}

function joystick(){
  if(xValue>520&&((yValue<500&&xValue<yValue)||(yValue>520&&xValue>yValue)||(yValue>500&&yValue<520))){
    character.walk(2,0);
    character.show(3);
    startWalking()
  }else if(xValue<500&&((yValue<500&&xValue<yValue)||(yValue>520&&xValue>yValue)||(yValue>500&&yValue<520))){
   character.walk(-2,0);
   character.show(2);
   startWalking()
  }else if(yValue<500){
    character.walk(0,-2);
    character.show(0);
    startWalking()
  }else if(yValue>520){
    character.walk(0,2);
    character.show(1);
    startWalking()
  } else{
    character.spriteSit();
    footsteps.stop();
    isWalking = false;
  }
}

function arrows(){
  if(keyIsDown(RIGHT_ARROW)){
    character.walk(2,0);
    character.show(3);
    startWalking();
  }else if(keyIsDown(LEFT_ARROW)){
    character.walk(-2,0);
    character.show(2);
    startWalking()
  }else if(keyIsDown(UP_ARROW)){
    character.walk(0,-2);
    character.show(0);
    startWalking()
  }else if(keyIsDown(DOWN_ARROW)){
    character.walk(0,2);
    character.show(1);
    startWalking()
  } else{
    character.spriteSit();
    footsteps.stop();
    isWalking = false;
  }
  
}

function changeBackgroundColor() {
  background(random(150)+100,random(150)+100,random(150)+100);
}

//resets the round
function resetRound(){
  //blinks the light if the serial is connected
  if(writer){
    writer.write(encoder.encode(0+","+0+","+0+"\n")); 
  }

  //adds time to the clock depending on if it is joystick vs arrows
  if(reader){
    timer+= 8-levelMode.get(mode.value())*2;
  }else{
    timer += 7-levelMode.get(mode.value())*2;
  }

  newLevel();
  gameDelay = millis();
  mainTime = timer;
  drawMap();
  roundOver=false;
  roundColor = colorList[int(random(colorList.length))];
}

//footsteps sound
function startWalking() {
  if(!isWalking){
    if(soundsOn) footsteps.start();
  }
  isWalking=true;
}
function stopWalking() {
  sequence.stop();
}
//certain colors need different rgb values to display well on the led
function ledColorSwap(){
  let colorValue = roundColor;
  switch(roundColor){
    case orangeC: colorValue = organgeLED; break;
    case pinkC: colorValue = pinkLED; break;
    case yellowC: colorValue = yellowLED; break;
  }
  return colorValue;
}

//reorders the map layout
function newLevel(){
  mapColor = [];
  for(let i=0;i<7;i++){
    mapColor = mapColor.concat(colorList.sort(() => random() - 0.5));
  }
}

//iterates through the mapColor list and displays all the tiles 
function drawMap(){
  map = [];
  let index=0;
  for(let i=0;i<7;i++){
    for(let j=0;j<8;j++){
      let size = width/8-5;
      map.push(new Tile(mapColor[index],size,j*size+4*j+5,i*size+4*i+50))
      index++;
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
          +"\nOnce the character is standing on the correct tile press enter or press down on the joystick (if the clock is at zero and you are standing on the correct tile it is also correct)"+
          "\ntime will be added to the timer (based on difficulty) and the game continues until the timer reaches zero");
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