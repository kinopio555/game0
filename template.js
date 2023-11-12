var canvas, g;
var characterPosX, characterPosY, characterImage, characterR;
var speed = 0, acceleration = 0;
var enemyPosX, enemyPosY, enemyImage, enemySpeed, enemyR;
var score;
var scene;
var frameCount;
var bound;

const Scenes = {
  GameMain: "GameMain",
  GameOver: "GameOver"
}

onload = function () {
  // 描画コンテキストの取得
  canvas = document.getElementById("gamecanvas");
  g = canvas.getContext("2d");
  // 初期化
  init();
  // 入力処理の指定
  document.onkeydown = keydown;
  // ゲームループの設定 60FPS
  setInterval("gameloop()", 16);
};

function init() {
  score = 0;
  frameCount = 0;
  bound = false;
  scene = Scenes.GameMain;
  characterPosX = 100;
  characterPosY = 400;
  characterR = 16;
  characterImage = new Image();
  characterImage.src = "./reimu.png";

  enemyPosX = 600;
  enemyPosY = 400;
  enemyR = 16;
  enemyImage = new Image();
  enemyImage.src = "./marisa.png";
  enemySpeed = 5;
}

function keydown(e) {
  speed = -20;
  acceleration = 1.5;
}

function gameloop() {
  update();
  draw();
}

function update() {
  if(scene === Scenes.GameMain) {
    speed = speed + acceleration;
    characterPosY = characterPosY + speed;
    if(characterPosY > 400) {
      characterPosY = 400;
      speed = 0;
      acceleration = 0;
    }
    characterPosX = characterPosX + 2;

    enemyPosX -= enemySpeed;
    if(enemyPosX < -100) {
      enemyPosX = 600;
      score += 100;
    }

    var diffX = characterPosX - enemyPosX;
    var diffY = characterPosY - enemyPosY;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if(distance < characterR + enemyR) {
      scene = Scenes.GameOver;
      speed = -20;
      acceleration = 0.5;
      frameCount = 0;
    }
  } else if(scene === Scenes.GameOver) {
    speed = speed + acceleration;
    characterPosY = characterPosY + speed;

    if(characterPosX < 20 || characterPosX > 460) {
      bound = !bound;
    }
    if(bound) {
      characterPosX = characterPosX + 30;
    } else {
      characterPosX = characterPosX - 30;
    }
    enemyPosX += enemySpeed;
  }
  frameCount++;
}

function draw() {
  if(scene === Scenes.GameMain) {
    g.fillStyle = "rgb(0,0,0)";
    g.fillRect(0,0,480,480);

    g.drawImage(
      characterImage,
      characterPosX - characterImage.width / 2,
      characterPosY - characterImage.height / 2,
    )

    g.drawImage(
      enemyImage,
      enemyPosX - enemyImage.width / 2,
      enemyPosY - enemyImage.height / 2,
    )

    g.fillStyle = "rgb(255, 255, 255)";
    g.font = "16pt Arial";
    var scoreLabel = "SCORE : " + score;
    var scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
  } else if(scene === Scenes.GameOver) {
    g.fillStyle = "rgb(0,0,0)";
    g.fillRect(0,0,480,480);

    if(frameCount < 120) {
      g.save();
      g.translate(characterPosX, characterPosY);
      g.rotate(((frameCount % 30) + Math.PI * 2) / 30);
      g.drawImage(
        characterImage,
        -characterImage.width /2,
        -characterImage.height / 2,
        characterImage.width + frameCount,
        characterImage.height + frameCount
      );
      g.restore();
    }
    g.drawImage(
      characterImage,
      characterPosX - characterImage.width / 2,
      characterPosY - characterImage.height / 2,
    )

    g.drawImage(
      enemyImage,
      enemyPosX - enemyImage.width / 2,
      enemyPosY - enemyImage.height / 2,
    )

    g.fillStyle = "rgb(255, 255, 255)";
    g.font = "16pt Arial";
    var scoreLabel = "SCORE : " + score;
    var scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);

    g.fillStyle = "rgb(255, 255, 255)";
    g.font = "48pt Arial";
    var scoreLabel = "GAME OVER";
    var scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 240 - scoreLabelWidth / 2, 240);
  }
}

