//Sprite creation class
class Sprite {
  constructor() {
    this.x = width/2-16;
    this.y = height/2-16;
    this.w = 32;
    this.h = 32;
    this.len = 4;
    this.speed = .05;
    this.index = 0;
    this.sitAnimation = false;
  }

  //displays the bug
  show(direction){
    let index = floor(this.index) % this.len;
    
    image(direction[index], this.x, this.y);
  }

  //adds to the x value of the bug
  walk(x,y) {
    this.sitAnimation = false;
    this.index += this.speed;
    if(this.x>width-32&&x>0){
      this.x += this.speed - x/2;
    }else if(this.x<5&&x<0){
      this.x += this.speed - x/2;
    }else{
      this.x += this.speed + x;
    } 
    if(this.y>height-32&&y>0){
      this.y += this.speed - y/2;
    }else if(this.y<50&&y<0){
      this.y += this.speed - y/2;
    }else{
      this.y += this.speed + y;
    }
    
  }

  dogSit(){
    let index = floor(this.index) % this.len;
    this.index += this.speed;
    if(index == 3){
      this.sitAnimation = true;
    }
    if(this.sitAnimation){
      image(stand[3], this.x, this.y);
    }else{
      image(stand[index], this.x, this.y);
    }
  }

  spritePos(){

    let indexX = int((this.x+this.w/2)/(width/8));
    let indexY = int((this.y-this.h/2)/((height-45)/7));
    return indexX+indexY*8;
  }
  
}