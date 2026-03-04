/**
 * T-Rex Runner - p5.js implementation
 * Chrome-style dinosaur jumping game. Keyboard (Space/Up) + Firebase console control.
 */
var dinoX = 50;
var dinoY = 0;
var dinoW = 44;
var dinoH = 47;
var groundY = 0;
var dinoVelY = 0;
var gravity = 0.65;
var jumpVelocity = -10;
var isJumping = false;
var isPlaying = false;
var isGameOver = false;
var score = 0;
var highScore = 0;
var speed = 6;
var obstacles = [];
var groundOffset = 0;
var lastObstacleTime = 0;
var obstacleGap = 1800;
var firebaseJumpListener = null;
var clouds = [];
var stars = [];
var bats = [];
var wasNight = false;
var BAT_SPAWN_SCORE = 500;

var GAME_W = 600;
var GAME_H = 150;
var NIGHT_SCORE_INTERVAL = 700;

function setup() {
  var canvas = createCanvas(GAME_W, GAME_H);
  canvas.parent('canvas-container');
  frameRate(60);
  groundY = GAME_H - 20;
  dinoY = groundY - dinoH;
  textFont('Courier New');
  textSize(14);
  startFirebaseJumpListener();
}

function isNightMode() {
  return Math.floor(score / NIGHT_SCORE_INTERVAL) % 2 === 1;
}

function draw() {
  var night = isNightMode();
  if (night) {
    background(32, 33, 36);
  } else {
    background(247, 247, 247);
  }

  if (!isPlaying && !isGameOver) {
    drawStartScreen();
    drawDino();
    return;
  }
  if (isGameOver) {
    drawGameScene(night);
    drawDino();
    drawGameOverOverlay();
    return;
  }

  // Update score (Chrome-like)
  score += 0.5 + speed * 0.1;
  if (score > highScore) highScore = score;
  document.getElementById('score').textContent = Math.floor(score);
  document.getElementById('high-score').textContent = Math.floor(highScore);

  // Speed increase
  if (frameCount % 500 === 0 && speed < 12) speed += 0.3;

  // Night mode: spawn stars when entering night
  if (night && !wasNight) {
    stars = [];
    for (var s = 0; s < 40; s++) stars.push({ x: Math.random() * GAME_W, y: Math.random() * (groundY - 25), size: 1 + Math.random() * 1.5, twinkle: Math.random() });
    wasNight = true;
  } else if (!night) {
    wasNight = false;
    bats = [];
  }
  if (night) {
    for (var si = 0; si < stars.length; si++) {
      var a = 100 + 80 * Math.sin(frameCount * 0.05 + stars[si].twinkle * 6.28);
      fill(255, 255, 255, Math.max(50, Math.min(255, a)));
      noStroke();
      ellipse(stars[si].x, stars[si].y, stars[si].size, stars[si].size);
    }
  }

  // Bats (night only, late game - score > 500)
  if (night && score > BAT_SPAWN_SCORE) {
    if (Math.random() < 0.003) {
      bats.push({
        x: GAME_W + 20,
        y: Math.random() * 50 + 25,
        wingPhase: Math.random() * 6.28,
        speed: 4 + Math.random() * 2
      });
    }
    for (var bi = bats.length - 1; bi >= 0; bi--) {
      bats[bi].x -= bats[bi].speed;
      drawBat(bats[bi]);
      if (bats[bi].x + 25 < 0) bats.splice(bi, 1);
    }
  }

  // Clouds (day only)
  if (!night && Math.random() < 0.002) clouds.push({ x: GAME_W, y: Math.random() * 40 + 20, w: 20 + Math.random() * 20 });
  for (var ci = clouds.length - 1; ci >= 0; ci--) {
    clouds[ci].x -= speed * 0.5;
    fill(83, 83, 83, night ? 0 : 100);
    noStroke();
    if (!night) ellipse(clouds[ci].x, clouds[ci].y, clouds[ci].w, clouds[ci].w * 0.6);
    if (clouds[ci].x + clouds[ci].w < 0) clouds.splice(ci, 1);
  }

  // Moon (night only)
  if (night) drawMoon();

  // Ground
  drawGround(night);

  // Dino physics
  if (isJumping) {
    dinoVelY += gravity;
    dinoY += dinoVelY;
    if (dinoY >= groundY - dinoH) {
      dinoY = groundY - dinoH;
      dinoVelY = 0;
      isJumping = false;
    }
  }

  drawDino();

  // Obstacles
  if (millis() - lastObstacleTime > obstacleGap) {
    spawnObstacle();
    lastObstacleTime = millis();
    obstacleGap = Math.max(800, 2200 - score * 1.5);
  }
  for (var i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= speed;
    drawCactus(obstacles[i], night);
    if (obstacles[i].x + obstacles[i].w < 0) obstacles.splice(i, 1);
    else if (checkCollision(obstacles[i])) gameOver();
  }
}

function drawBat(b) {
  var flap = Math.sin(frameCount * 0.2 + b.wingPhase) * 0.5;
  stroke(170, 170, 170);
  strokeWeight(2);
  noFill();
  push();
  translate(b.x, b.y);
  ellipse(0, 0, 6, 4);
  line(-3, 0, 2, -4 + flap * 3);
  line(-3, 0, 2, 4 - flap * 3);
  pop();
}

function drawMoon() {
  fill(255, 255, 255, 200);
  noStroke();
  var mx = GAME_W - 55;
  var my = 35;
  ellipse(mx, my, 25, 25);
  fill(32, 33, 36);
  ellipse(mx + 6, my - 4, 18, 18);
}

function drawGround(night, animating) {
  if (animating !== false) groundOffset = (groundOffset - speed) % 24;
  var c = night ? 83 : 83;
  stroke(c, c, c);
  strokeWeight(2);
  for (var i = -2; i < GAME_W / 24 + 2; i++) {
    var x = i * 24 + groundOffset;
    line(x, groundY + 10, x + 12, groundY + 10);
  }
  line(0, groundY + 12, GAME_W, groundY + 12);
}

function drawDino() {
  var col = isNightMode() ? 255 : 83;
  fill(col, col, col);
  noStroke();
  var runFrame = Math.floor(frameCount / 6) % 2;
  if (!isPlaying || isGameOver || isJumping) runFrame = 0;
  push();
  translate(dinoX + dinoW / 2, 0);
  scale(-1, 1);
  translate(-dinoX - dinoW / 2, 0);
  drawDinoBody(runFrame);
  pop();
}

function drawDinoBody(frame) {
  var bx = dinoX;
  var by = dinoY;
  var legSwap = (frame === 1 && !isJumping && !isGameOver) ? 1 : 0;
  // Tail (Chrome T-Rex: long horizontal then curves up)
  rect(bx + 36, by + 38, 14, 6);
  rect(bx + 42, by + 32, 10, 8);
  rect(bx + 46, by + 26, 6, 10);
  // Body (compact oval)
  ellipse(bx + 26, by + 34, 20, 18);
  // Neck
  rect(bx + 16, by + 16, 8, 16);
  // Head (round - Chrome T-Rex style)
  ellipse(bx + 18, by + 12, 14, 14);
  // Snout/beak (open mouth when running)
  rect(bx + 4, by + 10, 14, 5);
  // Eye
  fill(isNightMode() ? 32 : 247);
  ellipse(bx + 14, by + 10, 4, 4);
  fill(isNightMode() ? 255 : 83);
  // Legs (alternating animation)
  rect(bx + 10, by + 44 - legSwap * 4, 8, 10 + legSwap * 4);
  rect(bx + 24, by + 42 + legSwap * 3, 8, 12 - legSwap * 3);
  // Small arms
  rect(bx + 18, by + 28, 3, 6);
  rect(bx + 22, by + 30, 3, 5);
}

function drawCactus(c, night) {
  var col = night ? 170 : 83;
  fill(col, col, col);
  noStroke();
  if (c.type === 0) {
    rect(c.x, groundY - c.h, 12, c.h);
    rect(c.x - 2, groundY - c.h - 8, 6, 10);
    rect(c.x + 8, groundY - c.h - 12, 6, 14);
  } else if (c.type === 1) {
    rect(c.x, groundY - c.h, 8, c.h);
    rect(c.x + 4, groundY - c.h - 6, 8, 8);
  } else {
    rect(c.x, groundY - 24, 12, 24);
    rect(c.x + 10, groundY - 18, 10, 18);
  }
}

function drawGameScene(night) {
  drawGround(night, false);
  if (night) {
    drawMoon();
    for (var bi = 0; bi < bats.length; bi++) drawBat(bats[bi]);
  }
  for (var i = 0; i < obstacles.length; i++) {
    drawCactus(obstacles[i], night);
  }
}

function drawStartScreen() {
  fill(83, 83, 83);
  textAlign(CENTER);
  textSize(12);
  text('Press SPACE to start', GAME_W * 0.72, GAME_H / 2 + 5);
}

function drawGameOverOverlay() {
  fill(0, 0, 0, 90);
  noStroke();
  rect(0, 0, GAME_W, GAME_H);
  fill(255, 255, 255);
  textAlign(CENTER);
  textSize(18);
  text('GAME OVER', GAME_W / 2, GAME_H / 2 - 25);
  textSize(12);
  text('Press SPACE to restart', GAME_W / 2, GAME_H / 2 + 15);
}

function spawnObstacle() {
  var types = [
    { type: 0, w: 16, h: 35 },
    { type: 1, w: 16, h: 25 },
    { type: 2, w: 22, h: 24 }
  ];
  var t = types[Math.floor(Math.random() * types.length)];
  obstacles.push({ x: GAME_W, y: groundY, w: t.w, h: t.h, type: t.type });
}

function checkCollision(c) {
  var margin = 12;
  var dinoLeft = dinoX + margin;
  var dinoRight = dinoX + dinoW - margin;
  var dinoTop = dinoY + margin;
  var dinoBottom = dinoY + dinoH - margin;
  var cactusLeft = c.x;
  var cactusRight = c.x + c.w;
  var cactusTop = groundY - c.h;
  var cactusBottom = groundY;
  return dinoRight > cactusLeft && dinoLeft < cactusRight &&
    dinoBottom > cactusTop && dinoTop < cactusBottom;
}

function jump() {
  if (!isJumping && isPlaying && !isGameOver) {
    isJumping = true;
    dinoVelY = jumpVelocity;
  } else if (!isPlaying && !isGameOver) {
    startGame();
  } else if (isGameOver) {
    restart();
  }
}

function startGame() {
  isPlaying = true;
  isGameOver = false;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dinoGameStart'));
  }
  score = 0;
  speed = 6;
  obstacles = [];
  clouds = [];
  stars = [];
  bats = [];
  dinoY = groundY - dinoH;
  dinoVelY = 0;
  isJumping = false;
}

function gameOver() {
  isGameOver = true;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('dinoGameOver', { detail: { score: Math.floor(score) } }));
  }
}

function restart() {
  startGame();
}

function keyPressed() {
  if (keyCode === 32 || keyCode === UP_ARROW) {
    jump();
    return false;
  }
  return true;
}

function startFirebaseJumpListener() {
  if (typeof db === 'undefined' || !db) return;
  var docRef = db.collection('dinoGame').doc('control');
  firebaseJumpListener = docRef.onSnapshot(function(snap) {
    if (!snap.exists) return;
    var d = snap.data();
    if (d && d.action === 'jump') {
      jump();
      docRef.set({ action: null, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    } else if (d && d.action === 'restart') {
      restart();
      docRef.set({ action: null, timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    }
  });
}
