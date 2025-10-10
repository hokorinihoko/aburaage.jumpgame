// ==================== 初期設定 ====================
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = 360;
canvas.height = 540;

let keys = {};
let platforms = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOverFlag = false;

// UI要素
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const finalScoreEl = document.getElementById("finalScore");
const finalHighScoreEl = document.getElementById("finalHighScore");
const overlay = document.getElementById("gameOverOverlay");
highScoreEl.textContent = `ハイスコア: ${highScore}`;

// ==================== プレイヤー設定 ====================
const player = {
  x: 150,
  y: 400,
  w: 30,
  h: 30,
  vy: 0,
  vx: 0,
  jumpPower: -10,
  gravity: 0.4,
  speed: 5,
  onGround: false
};

// ==================== プラットフォーム作成 ====================
function createPlatforms() {
  platforms = [];
  let y = canvas.height - 20;
  while (y > -canvas.height) {
    platforms.push({
      x: Math.random() * (canvas.width - 60),
      y: y,
      w: 60,
      h: 10
    });
    y -= 80;
  }
}

// ==================== 入力管理 ====================
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// ==================== スマホボタン ====================
document.getElementById("leftBtn").addEventListener("touchstart", () => keys["ArrowLeft"] = true);
document.getElementById("leftBtn").addEventListener("touchend", () => keys["ArrowLeft"] = false);
document.getElementById("rightBtn").addEventListener("touchstart", () => keys["ArrowRight"] = true);
document.getElementById("rightBtn").addEventListener("touchend", () => keys["ArrowRight"] = false);
document.getElementById("jumpBtn").addEventListener("touchstart", () => jump());

// ==================== ジャンプ関数 ====================
function jump() {
  if (player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
  }
}

// ==================== ゲームオーバー処理 ====================
function triggerGameOver() {
  gameOverFlag = true;
  finalScoreEl.textContent = `スコア: ${Math.floor(score)}`;
  
  if (score > highScore) {
    highScore = Math.floor(score);
    localStorage.setItem("highScore", highScore);
  }

  finalHighScoreEl.textContent = `ハイスコア: ${highScore}`;
  highScoreEl.textContent = `ハイスコア: ${highScore}`;
  overlay.style.display = "flex";
}

// ==================== ゲームリスタート ====================
function restart() {
  overlay.style.display = "none";
  player.x = 150;
  player.y = 400;
  player.vy = 0;
  score = 0;
  createPlatforms();
  gameOverFlag = false;
  loop();
}

// ==================== リセット（ハイスコア削除） ====================
document.getElementById("resetBtn").addEventListener("click", () => {
  localStorage.removeItem("highScore");
  highScore = 0;
  highScoreEl.textContent = `ハイスコア: 0`;
  finalHighScoreEl.textContent = `ハイスコア: 0`;
});

// ==================== ゲームループ ====================
function loop() {
  if (gameOverFlag) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー移動処理
  if (keys["ArrowLeft"] || keys["KeyA"]) player.vx = -player.speed;
  else if (keys["ArrowRight"] || keys["KeyD"]) player.vx = player.speed;
  else player.vx = 0;

  if (keys["Space"] || keys["KeyZ"] || keys["ArrowUp"]) jump();

  player.vy += player.gravity;
  player.x += player.vx;
  player.y += player.vy;

  // 画面端の処理
  if (player.x < -player.w) player.x = canvas.width;
  if (player.x > canvas.width) player.x = -player.w;

  // プラットフォームとの当たり判定
  player.onGround = false;
  for (let p of platforms) {
    if (
      player.x + player.w > p.x &&
      player.x < p.x + p.w &&
      player.y + player.h > p.y &&
      player.y + player.h < p.y + p.h &&
      player.vy >= 0
    ) {
      player.y = p.y - player.h;
      player.vy = player.jumpPower;
      player.onGround = true;
    }
  }

  // スクロール（上昇時）
  if (player.y < canvas.height / 2) {
    let diff = (canvas.height / 2) - player.y;
    player.y += diff;
    score += diff * 0.1;
    for (let p of platforms) {
      p.y += diff;
      if (p.y > canvas.height) {
        p.y -= canvas.height + Math.random() * 50;
        p.x = Math.random() * (canvas.width - 60);
      }
    }
  }

  // 落下判定
  if (player.y > canvas.height + 50) {
    triggerGameOver();
    return;
  }

  // 描画
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#8bd3c7";
  for (let p of platforms) {
    ctx.fillRect(p.x, p.y, p.w, p.h);
  }

  scoreEl.textContent = `スコア: ${Math.floor(score)}`;

  requestAnimationFrame(loop);
}

// ==================== イベント ====================
document.getElementById("startBtn").addEventListener("click", restart);
document.addEventListener("keydown", e => {
  if (e.code === "KeyR") restart();
});

// ==================== 起動 ====================
createPlatforms();
loop();
