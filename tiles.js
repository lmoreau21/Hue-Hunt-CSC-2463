//https://youtu.be/ZAcpYT4nm6E

//Sprite creation class
class Tile {
    constructor(colorTemp,sizeTemp,xTemp,yTemp) {
      this.color = colorTemp;
      this.x = xTemp;
      this.y = yTemp;
      this.w = sizeTemp;
      this.h = sizeTemp;
    }
  
    //displays the bug
    show(){
      colorMode(RGB);
      //console.log(this.color);
      fill(this.color);
      rect(this.x,this.y,this.w,this.h);
    }
  
    
  
  
    //will make the bug unclickable and update the score
    getColor(){
        return this.color;
    }
  }