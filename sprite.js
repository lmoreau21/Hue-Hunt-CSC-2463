//Sprite creation class
class Sprite {
  constructor(up,down,left,right,sit) {
    spriteX = width/2-16;
    spriteY = height/2-16;
    this.w = 32;
    this.h = 32;
    this.len = 4;
    this.speed = .05;
    this.index = 0;
    this.sitAnimation = false;
    this.animation = [up,down,left,right];
    this.sitAni = sit;
  }

  //displays the bug
  show(direction){
    let index = floor(this.index) % this.len;
    
    image(this.animation[direction][index], spriteX, spriteY);
  }

  //adds to the x value of the bug
  walk(x,y) {
    this.sitAnimation = false;
    this.index += this.speed;
    if(spriteX>width-32&&x>0){
      spriteX += this.speed - x/2;
    }else if(spriteX<5&&x<0){
      spriteX += this.speed - x/2;
    }else{
      spriteX += this.speed + x;
    } 
    if(spriteY>height-32&&y>0){
      spriteY += this.speed - y/2;
    }else if(spriteY<50&&y<0){
      spriteY += this.speed - y/2;
    }else{
      spriteY += this.speed + y;
    }
    
  }

  spriteSit(){
    let index = floor(this.index) % this.len;
    this.index += this.speed;
    if(index == 3){
      this.sitAnimation = true;
    }
    if(this.sitAnimation){
      image(this.sitAni[3],spriteX,spriteY);
    }else{
      image(this.sitAni[index], spriteX, spriteY);
    }
  }

  spritePos(){

    let indexX = int((spriteX+this.w/2)/(width/8));
    let indexY = int((spriteY-this.h/2)/((height-45)/7));
    return indexX+indexY*8;
  }
  
}