#TREASURE ISLAND

This is a game made for a job interview in 48 hours. It can be played directly on http://lajili.com/treasure_island

##Installation
To install every dependencies of the game, simply run the command

    npm install
    
on the root of the game.
##Build 

###Staging
To build into staging, simply run the command 

    gulp
    
It will launch BrowserSync and your browser should open with the game. While in staging environement, you will have sourcemaps and debug information. Any modifications on the js code would trigger a relaunch of the webpage, and any modifications to the SCSS files is applied directly to the web page in real time.

##Production
To build into production, run the command

    gulp build:production
    
It will compile the game and put it inside the "production folder". You just have to use your favorite web server on the **production** folder inside the root repository.

##Q&A
To read once you played the game.

###What library / tools did you use, and why?

For the general dev workflow, I have used:
Gulp to build, Browserify to manage modules, Babel to have EcmaScript 6 goodness and SASS. 
I use those tools because I find them convenient, in particuliar I prefer gulp to grunt, I find it more easy to create complexe tasks, and I prefer Browserify to RequireJS. A Sass integration may seem like an overkill for a canvas based game, but since it's happening in build time, I'm allowing myself this luxury.

Inside the application itself, I use PIXI.js for rendering inside a WebGL / 2D optimized canvas and GreenSock GSAP for smooth and complexe animations.

###I was looking at your git history, what the h*ll? You started via the loader, and then you worked on the menu etc. That's not very agile.

When I do a quick development like this one with a tight deadline, I like to work starting from the least essential things to the more essentials. It keeps the motivation up (even at 3am you have to stay awake to finish the gameplay, while if I was working on the page global CSS I might have thought that it was not this important). It also allows me to see the game through the eyes of the user, and validating for instance that you understand what the game is quickly.

##Where did you get the assets from?
The background painting, chestbox and skull are random images found on the internet, on which I have no right. The rest of the assets are either open game art (especially "CutePlanet" from lost garden) or assets I've done myself.

Have a nice day.