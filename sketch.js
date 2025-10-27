let mic;
let vol = 0;
let co2 = 600;
let co2Trend = 1;
let co2Speed = 0.5;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(20);
  let mid = width / 2;

  // --- Lydniveau ---
  vol = mic.getLevel();
  let dB = map(vol, 0, 0.2, 30, 100); // mere sensitiv
  dB = constrain(dB, 30, 100);

  // --- Realistisk CO₂-simulation ---
  co2 += random(-co2Speed, co2Speed) * co2Trend;
  // Justér tendens langsomt (folk går ud/ind af klassen)
  if (frameCount % 200 === 0) {
    co2Trend = random([-1, 1]);
    co2Speed = random(0.3, 1.2);
  }
  co2 = constrain(co2, 400, 1600);

  // --- Bestem status efter CO₂ ---
  let colorState;
  if (co2 < 800) colorState = "#4CAF50"; // grøn
  else if (co2 < 1200) colorState = "#FFEB3B"; // gul
  else colorState = "#F44336"; // rød

  // --- Venstre side: dB-måler ---
  push();
  translate(mid / 2, height / 2 + 100);
  strokeWeight(20);
  noFill();

  // Baggrundsbue
  stroke(80);
  arc(0, 0, height * 0.6, height * 0.6, -180, 0);

  // Aktiv bue
  stroke("#F44336");
  let angle = map(dB, 30, 100, -180, 0, true);
  arc(0, 0, height * 0.6, height * 0.6, -180, angle);

  // Tekst (dB)
  noStroke();
  fill(255);
  textSize(32);
  text("dB", 0, -40);
  textSize(26);
  text(int(dB) + " dB", 0, 10);
  textSize(18);
  text("-", -height * 0.25, 60);
  text("+", height * 0.25, 60);
  pop();

  // --- Højre side: smiley og CO₂ ---
  let smileX = mid + mid / 2;
  let smileY = height / 2 - 30;

  // Smiley-cirkel
  noStroke();
  fill(colorState);
  circle(smileX, smileY, height * 0.4);

  // Øjne og mund
  fill(0);
  circle(smileX - 40, smileY - 40, 25);
  circle(smileX + 40, smileY - 40, 25);
  noFill();
  stroke(0);
  strokeWeight(7);
  arc(smileX, smileY, 120, 80, 20, 160);

  // CO₂ visning
  noStroke();
  fill(colorState);
  rect(mid, smileY + height * 0.25, mid, height * 0.15);
  fill(0);
  textSize(60);
  textStyle(BOLD);
  text(int(co2) + " ppm", smileX, smileY + height * 0.3);
}

function touchStarted() {
  getAudioContext().resume();
}
