# Hue-Hunt-CSC-2463
## Final Integration Project for LSU CSC 2463

### Project Description
Hue Hunt is a game where you have to navigate your character to the correct tile as fast as possible. It is an endless game comprised of a randomly generated map every single round. There is also 3 modes: easy, medium, and hard. You can also change your sprite using a drop down list.

#### Tech Stack
* JavaScript (P5.js & Tone.js)
* HTML for github pages
* Ardunio
* Audio files are found on yotube
* Sprites are found on Spriters-Resource

### Rules
##### Joystick Mode
* Connect to the ardunio via the Ardunio button
* You can control character type, difficulty, and sound below the game
* Press down on the joystick to start the game
* Goal is to move your character to a same colored title as the rgb light
* Use the joystick to move your character (you can only move one direction at a time)
* Press down on the joystick when you are on the correct tile
* If you are on the correct tile, time will be added to the clock
  * 6 seconds on easy
  * 4 on medium
  * 2 on hard
* If the clock reaches 0 and you are on the correct tile time is still added
* If you are on the inccorect tile when the clock reaches 0 or when you press enter, the game will end

##### Arrow Mode
* You can control character type, difficulty, and sound below the game
* Press enter to start the game
* Goal is to move your character to a same colored title as the color on the top of the screen
* Use the arrow keys to move your character (you can only move one direction at a time)
* Press 'enter' when you are on the correct tile
* If you are on the correct tile, time will be added to the clock
  * 5 seconds on easy
  * 3 on medium
  * 1 on hard
* If the clock reaches 0 and you are on the correct tile time is still added
* If you are on the inccorect tile when the clock reaches 0 or when you press enter, the game will end

##### Future Development
* Add powerups that may...
  * add time
  * change sprite speed
  * change tile size
  * add a life
* Add blank tiles you can't walk on to make movement harder
* Add an enemey that you can't touch but constantly follows you

Project Link: https://lmoreau21.github.io/Hue-Hunt-CSC-2463/
Youtube Video of Project: 

#### Image of Actual Ardunio Setup
![IMG-6877](https://user-images.githubusercontent.com/61840342/236071054-3008d392-6351-4f37-9929-35253adfb7dc.jpg)

#### Images of Game
![image](https://user-images.githubusercontent.com/61840342/236069749-cdeefbcb-8749-4577-b5dc-9e92b77973d9.png)
![image](https://user-images.githubusercontent.com/61840342/236070623-3b8ce628-2402-4425-8a92-03972c7acaa8.png)

#### Online Generate Ardunio Layout Model
![image](https://user-images.githubusercontent.com/61840342/236049410-124d31fc-1fcd-49a9-8efd-f0e24bd8d298.png)
