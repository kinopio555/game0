var canvas, g;
var player, enemy;
var score;
var scene;
var frameCount;
var bound;

const Scenes = {
  GameMain: "GameMain",
  GameOver: "GameOver"
}

class Sprite {
  image = null;
  posx = 0;
  posy = 0;
  speed = 0;
  acceleration = 0;
  r = 0;
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
  //自キャラ初期化
  player = new Sprite();
  player.posx = 100;
  player.posy = 400;
  player.r = 16;
  player.image = new Image();
  player.image.src = "./reimu.png";
  player.speed = 0;
  player.acceleration = 0;

  //敵キャラ初期化
  enemy = new Sprite();
  enemy.posx = 600;
  enemy.posy = 400;
  enemy.r = 16;
  enemy.image = new Image();
  enemy.image.src = "./marisa.png";
  enemy.speed = 5;
  enemy.acceleration = 0;
}

function keydown(e) {
  player.speed = -20;
  player.acceleration = 1.5;
}

function gameloop() {
  update();
  draw();
}

function update() {
  if(scene === Scenes.GameMain) {
    player.speed = player.speed + player.acceleration;
    player.posy = player.posy + player.speed;
    if(player.posy > 400) {
      player.posy = 400;
      player.speed = 0;
      player.acceleration = 0;
    }
    player.posx = player.posx + 2;

    enemy.posx -= enemy.speed;
    if(enemy.posx < -100) {
      enemy.posx = 600;
      score += 100;
    }

    var diffX = player.posx - enemy.posx;
    var diffY = player.posy - enemy.posy;
    var distance = Math.sqrt(diffX * diffX + diffY * diffY);
    if(distance < player.r + enemy.r) {
      scene = Scenes.GameOver;
      player.speed = -20;
      player.acceleration = 0.5;
      frameCount = 0;
    }
  } else if(scene === Scenes.GameOver) {
    player.speed = player.speed + player.acceleration;
    player.posy = player.posy + player.speed;

    if(player.posx < 20 || player.posX > 460) {
      bound = !bound;
    }
    if(bound) {
      player.posx = player.posx + 30;
    } else {
      player.posx = player.posx - 30;
    }
    enemy.posx += enemy.speed;
  }
  frameCount++;
}

function draw() {
  if(scene === Scenes.GameMain) {
    g.fillStyle = "rgb(0,0,0)";
    g.fillRect(0,0,480,480);

    g.drawImage(
      player.image,
      player.posx - player.image.width / 2,
      player.posy - player.image.height / 2,
    )

    g.drawImage(
      enemy.image,
      enemy.posx - enemy.image.width / 2,
      enemy.posy - enemy.image.height / 2,
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
      g.translate(player.posx, player.posy);
      g.rotate(((frameCount % 30) + Math.PI * 2) / 30);
      g.drawImage(
        player.image,
        -player.image.width /2,
        -player.image.height / 2,
        player.image.width + frameCount,
        player.image.height + frameCount
      );
      g.restore();
    }
    g.drawImage(
      player.image,
      player.posx - player.image.width / 2,
      player.posy - player.image.height / 2,
    )

    g.drawImage(
      enemy.image,
      enemy.posx - enemy.image.width / 2,
      enemy.posy - enemy.image.height / 2,
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

2