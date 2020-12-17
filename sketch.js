var marioAnim, mario
var bg, bgImg
var gnd, gndImg
var invisibleGnd
var brick, brickImg, brickGroup
var obstAnim, obstGroup, obstAnimStop
var score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  marioAnim = loadAnimation("mario00.png", "mario01.png", "mario02.png", "mario03.png")
  marioStop = loadAnimation("collided.png");

  gndImg = loadImage("ground2.png");
  bgImg = loadImage("bg.png")
  brickImg = loadImage("brick.png")

  obstAnim = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png")
  obstAnimStop = loadAnimation("obstacle4.png")

  checkpoint = loadSound("checkPoint.mp3");
  die = loadSound("die.mp3")
  jump = loadSound("jump.mp3");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 385)

  //backgroundimage
  bg = createSprite(300, 200, 600, 400);
  bg.addImage(bgImg);
  console.log(bg.width + "," + bg.height)
  bg.velocityX = 5
  bg.x = bg.width / 2


  //ground image
  gnd = createSprite(300, 350, 600, 50);
  gnd.addImage(gndImg);
  gnd.scale = 1;

  gnd.x = gnd.width / 2;

  //create invisiblegnd
  invisibleGnd = createSprite(300, 320, 600, 10);
  invisibleGnd.visible = false;

  //create mario
  mario = createSprite(50, 310, 10, 10);
  mario.addAnimation("marioanim", marioAnim);
  mario.addAnimation("mariostop", marioStop);
  mario.scale = 1.5;
  mario.debug = true;
  mario.setCollider("rectangle", 0, 0, 20, mario.height)


  brickGroup = new Group();
  obstGroup = new Group();

  gameOver = createSprite(300, 200);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(300, 150);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

}

function draw() {

  if (gameState === PLAY) {

    gnd.velocityX = -5;
    
    //key press and gravity
    if (keyDown("space") && mario.y > 200) {
      mario.velocityY = -10;
      jump.play();
    }
    mario.velocityY = mario.velocityY + 0.5
    
    //spawn bricks and obstacles
    spawnbricks();
    spawnobstacles();
    
    //score dependent on frameCount and adding sounds 
    //score = score + Math.round(frameCount / 100);
    
    //score sound added
    if(score>0 && score%10===0)
      {
        checkpoint.play();
        score++;
      }

    //mario touching obstacle
    if (mario.isTouching(obstGroup)) {
      gameState = END;
      die.play();

    }
    
    //bricks disappeard when mario touches brick and score increases
    for (var i = 0; i < brickGroup.length; i++) {
      if (mario.isTouching(brickGroup.get(i))) {
        brickGroup.get(i).destroy();
        checkpoint.play();
        score=score+2;
      }
    }


  } else if (gameState === END) {
  //moving objects stopped
    gnd.velocityX = 0;
    mario.velocityY=0;
    
    brickGroup.setVelocityXEach(0);
    obstGroup.setVelocityXEach(0);
    
    mario.changeAnimation("mariostop", marioStop);
    
    //stop animation of obstacle group
    for (var i = 0; i < obstGroup.length; i++) {
        obstGroup.get(i).changeAnimation("mario_obst_stop", obstAnimStop);
    }

    obstGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);

    gameOver.visible = true;
    restart.visible = true;
    
    //overlaying of bricks on gameover and restart images solved
    gameOver.depth = brickGroup.maxDepth() + 1;
    restart.depth = brickGroup.maxDepth() + 1;
    
    if(mousePressedOver(restart))
      {
        reset();
      }

  }


  mario.collide(invisibleGnd);
  //groun infinite scroll
  if (gnd.x < 0) {
    gnd.x = gnd.width / 2;

  }
  //background infinite scroll
  if (bg.x < 400) {
    //console.log(bg.x)
    bg.x = bg.width / 2
    //console.log(bg.x)
  }
  drawSprites();
  text("SCORE:" + score, 300, 30);

}

function reset()
{
  
  gameState=PLAY;
  obstGroup.destroyEach();
  brickGroup.destroyEach();
        
  gameOver.visible = false;
  restart.visible = false;
  score=0;
  mario.changeAnimation("marioanim", marioAnim);
}

function spawnbricks() {
  if (frameCount % 80 === 0) {
    brick = createSprite(600, 100, 20, 20);
    brick.velocityX = -3;
    brick.y = Math.round(random(150, 200));
    brick.addImage(brickImg);
    brick.lifetime = 300;
    brickGroup.add(brick);
  }
}

function spawnobstacles() {
  if (frameCount % 80 === 0) {
    obstacle = createSprite(600, 290, 20, 20);
    obstacle.velocityX = -5;
    obstacle.addAnimation("mario_obst", obstAnim);
    obstacle.addAnimation("mario_obst_stop", obstAnimStop)
    obstacle.lifetime = 300;
    obstGroup.add(obstacle);
  }

}