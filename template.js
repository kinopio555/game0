var canvas, g;
var player, enemy;
var score;
var scene;
var frameCount;
var bound;
var particles;

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

  draw(g) {
    g.drawImage(
      this.image,
      this.posx - this.image.width / 2,
      this.posy - this.image.height / 2,
    )
  }
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
  particles = [];
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

  enemy = new Sprite();
  enemy.posx = 600;
  enemy.posy = 400;
  enemy.r = 16;
  enemy.image = new Image();
  enemy.image.src = "./marisa.png";
  enemy.speed = 5;
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
      //パーティクル生成
      for(var i = 0; i < 300; i++) {
        particles.push(new Particle(player.posx, player.posy));
      }
    }
  } else if(scene === Scenes.GameOver) {
    //霊夢が回るやつ
    // player.speed = player.speed + player.acceleration;
    // player.posy = player.posy + player.speed;

    // if(player.posx < 20 || player.posx > 460) {
    //   bound = !bound;
    // }
    // if(bound) {
    //   player.posx = player.posx + 30;
    // } else {
    //   player.posx = player.posx - 30;
    // }
    enemy.posx += enemy.speed;

    particles.forEach((p) => {
      p.update();
    });
  }
  frameCount++;
}

function draw() {
  if(scene === Scenes.GameMain) {
    g.fillStyle = "rgb(0,0,0)";
    g.fillRect(0,0,480,480);

    player.draw(g);
    enemy.draw(g);

    g.fillStyle = "rgb(255, 255, 255)";
    g.font = "16pt Arial";
    var scoreLabel = "SCORE : " + score;
    var scoreLabelWidth = g.measureText(scoreLabel).width;
    g.fillText(scoreLabel, 460 - scoreLabelWidth, 40);
  } else if(scene === Scenes.GameOver) {
    g.fillStyle = "rgb(0,0,0)";
    g.fillRect(0,0,480,480);

    if(frameCount < 120) {
      //霊夢が回るやつ
      // g.save();
      // g.translate(player.posx, player.posy);
      // g.rotate(((frameCount % 30) + Math.PI * 2) / 30);
      // g.drawImage(
      //   player.image,
      //   -player.image.width /2,
      //   -player.image.height / 2,
      //   player.image.width + frameCount,
      //   player.image.height + frameCount
      // );
      // g.restore();
    }
    //playerを残すかどうか
    // player.draw(g);
    enemy.draw(g);

    particles.forEach((p) => {
      p.draw(g);
    });

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

class Particle extends Sprite {
  baseline = 0;
  acceleration = 0;
  speedy = 0;
  speedx = 0;

  constructor(x, y) {
    super();
    this.posx = x;
    this.posy = y;
    this.baseline = 420;
    this.acceleration = 0.5;
    var angle = (Math.PI * 5) / 4 + (Math.PI) / 2 * Math.random();
    this.speed = 5 + Math.random() * 20;
    this.speedx = this.speed * Math.cos(angle);
    this.speedy = this.speed * Math.sin(angle);
    this.r = 2;
  }
  update() {
    this.speedx *= 0.97;
    this.speedy += this.acceleration;
    this.posx += this.speedx;
    this.posy += this.speedy;
    if(this.posy > this.baseline) {
      this.posy = this.baseline;
      this.speedy = this.speedy * -1 * (Math.random() * 0.5 + 0.3);
    }
  }
  draw(g) {
    g.fillStyle = "rgb(255,50,50)";
    g.fillRect(this.posx - this.r, this.posy - this.r, this.r * 2, this.r * 2);
  }
}

class Enemy extends Sprite {
  constructor(posx, posy, r, imageUrl, speed, acceleration) {
    super();
    this.posx = posx;
    this.posy = posy;
    this.r = r;
    this.image = new Image();
    this.image.src = imageUrl;
    this.speed = speed;
    this.acceleration = acceleration;
  }

  update() {
    this.posx -= this.speed;
  }
}