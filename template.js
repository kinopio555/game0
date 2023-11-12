var canvas, g;
var characterPosX, characterPosY, characterImage;

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
  characterPosX = 100;
  characterPosY = 400;
  characterImage = new Image();
  characterImage.src = "./reimu.png";
}

function keydown(e) {}

function gameloop() {
  update();
  draw();
}

function update() {
  characterPosX = characterPosX + 2;
}

function draw() {
  g.fillStyle = "rgb(0,0,0)";
  g.fillRect(0,0,480,480);

  g.drawImage(
    characterImage,
    characterPosX - characterImage.width / 2,
    characterPosY - characterImage.height / 2,
  )
}
