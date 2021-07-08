// Game data
let gameStarted; // Boolean

let balloonX;
let balloonY;

let verticalVelocity; ////velocidad vertical actual del globo
let horizontalVelocity; // //velocidad horizontal actual

let fuel; // pocertanje de gas
let heating; // boolean: el mouse está abajo o no

let pyramids; // metadata de las piramides en array
let backgroundBuilding; // Metadata de los hills

//connfiguración
const mainAreaWidth = 400;
const mainAreaHeight = 375;
let horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
let verticalPadding = (window.innerHeight - mainAreaHeight) / 2;

const hill1BaseHeight = 80;
const hill1Speed = 0.2;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 50;
const hill2Speed = 0.2;
const hill2Amplitude = 15;
const hill2Stretch = 0.5;
const hill3BaseHeight = 15;
const hill3Speed = 1;
const hill3Amplitude = 10;
const hill3Stretch = 0.2;

const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const restartButton = document.getElementById("restart");
const winButton = document.getElementById("win");
let audio = document.getElementById("audio")

// Función para cambiar radianes a degrees
Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

// Layout del juego
resetGame();

// Resetea las variables del juego y layout (juego comienza en keypress)
function resetGame() {
  // RResetea el progreso del juego
  gameStarted = false; //cuando debe iniciar el juego
  heating = false; // cuando el mouse is down
  verticalVelocity = 5; //seguimiento de la velocidad vertical y horizontal
  horizontalVelocity = 5;
  balloonX = 0; //posición inicial del balloon 
  balloonY = 0;
  fuel = 100;

  introductionElement.style.opacity = 1;
  restartButton.style.display = "none";
  winButton.style.display = "none";

// generar 50 piramides y dibujar la escena inicial
  pyramids = [];
  for (let i = 1; i < window.innerWidth / 50; i++) generatePyramid();
// Genera los edificios
  backgroundBuilding = [];
  for (let i = 1; i < window.innerWidth / 30; i++) generateBackgroundBuilding();

  draw();
}
// define espacios entre edificios
function generateBackgroundBuilding() {
  const minimumGap = 30;
  const maximumGap = 150;

  // Coordenada X del borde derecho del árbol más lejano
  const lastBuilding = backgroundBuilding[backgroundBuilding.length - 1];
  let furthestX = lastBuilding ? lastBuilding.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  
    backgroundBuilding.push({ x });
  }
// establecer distancias entre piramides
function generatePyramid() {
  const minimumGap = 50; // // distancia min entre dos piramides
  const maximumGap = 600; //distancia máxima entre 2 piramides
 // Elegir piradmides aleatoriamente
  const x = pyramids.length
    ? pyramids[pyramids.length - 1].x +
      minimumGap +
      Math.floor(Math.random() * (maximumGap - minimumGap))
    : 400;

  const h = 60 + Math.random() * 80; // Height

  const r1 = 0 + Math.random() * 16; // Radius
  const r2 = 0 + Math.random() * 16;
  const r3 = 0 + Math.random() * 16;
  const r4 = 0 + Math.random() * 16;
  const r5 = 0 + Math.random() * 16;
  const r6 = 0 + Math.random() * 16;
  const r7 = 0 + Math.random() * 16;

  const pyramidColors = ["rgba(230, 170, 97, 0.445)", "rgba(230, 170, 97, 0.349)", "rgba(201, 158, 107, 0.349)"];
  const color = pyramidColors[Math.floor(Math.random() * 3)];

  pyramids.push({ x, h, r1, r2, r3, r4, r5, r6, r7, color });
}


resetGame();
//agregar un callback evento para definir el heatin con el mouse down y up
// si space se presiona se reinicia el juego
window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    resetGame();
    return;
  }
});
//agregar un callback evento para definir el heatin con el mouse down y up
window.addEventListener("mousedown", function () {
  heating = true;

// también informar al navegador que quiero realizar animación, programando el repintado para el próximo ciclo
    // solo si el juego no ha iniciado. Solo animar una vez 

  if (!gameStarted) {
    introductionElement.style.opacity = 0;
    gameStarted = true;
    window.requestAnimationFrame(animate);
  }
});

window.addEventListener("mouseup", function () {
  heating = false;
});
// evento cambiar
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
  verticalPadding = (window.innerHeight - mainAreaHeight) / 2;
  draw();
});
// bucle principal del juego - animacion-
//retornar si el juego no ha comenzado
function animate() {
  if (!gameStarted) return;

  const velocityChangeWhileHeating = 0.4; //velocidad incrementando
  const velocityChangeWhileCooling = 0.2; //velocidad descendiendo

  // condicionarlo cuando ya no hay fuel

  if (heating && fuel > 0) {
    if (verticalVelocity > -8) {
      //Límite máximo de subida (empujar hacía arriba)
      verticalVelocity -= velocityChangeWhileHeating;
    }
    fuel -= 0.002 * -balloonY;
  } else if (verticalVelocity < 5) {
    //Límite máximo de bajada (dejar que la gravedad actùe )
    verticalVelocity += velocityChangeWhileCooling; //ajusta la velocidad
  }

   /// cuando las coordenadas crecen hacía abajo los valores están al revés
 // establecer un límite inferior para que la velocidad descendiendo sea lenta

  balloonY += verticalVelocity;// después de ajustar, establece posicion actual del globo
  if (balloonY > 0) balloonY = 0; // aterrizando el globo, para
  if (balloonY < 0) balloonX += horizontalVelocity; //mover el globo a velocidad hoizontal si no ha aterrizado(es un valor constante)

  //para no quedarnos sin piramides e irlas actualizando
  if (pyramids[0].x - (balloonX - horizontalPadding) < -100) {
    pyramids.shift();  // remueve el primer item del array
    generatePyramid();  //agrega uno nuevo
  }

  // Si un árbol en la colina de fondo se sale de la imagen, reemplácelo por uno nuevo
  if (
    backgroundBuilding[0].x - (balloonX * hill1Speed - horizontalPadding) <
    -40
  ) {
    backgroundBuilding.shift();  // remueve primer item
    generateBackgroundBuilding(); // agrega uno nuevo
  }

  draw(); //volver a renderizar toda la escena

  // If the balloon hit a tree OR ran out of fuel and landed then stop the game
  const hit = hitDetection();
  if (hit || (fuel <= 0 && balloonY >= 0)) {
    restartButton.style.display = "block";
    return;
  }
  //Si el globo pega una piramide o se le acaba la gaso y pega 
//antes de solicitar la otra animación comprobamos si pegó o acabó gaso y retorna la función
//así que ya no solicita otra animación y acaba el juego


window.requestAnimationFrame(animate);
}

function draw() {
  //mover la escena sobre la X del globo en dirección opuesta para equilibrar su mov
    //generar la escena en la que parece que el globo se mueve. (solo va hacía arriba y abajo en realidad)
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);  //Limpiar cuando inicie nuevo
 //Guarda y acumula la posición
  drawSky(); // colorea el backround con un gradiente
 //Guardar y acumular la posición

  ctx.save();
  ctx.translate(0, verticalPadding + mainAreaHeight); // centra el area principal de canvas en el medio de la pantalla
  drawBackgroundHills(); //llama a la función

  ctx.translate(horizontalPadding, 0);

  // centra el area principal de canvas en el medio de la pantalla
  ctx.translate(-balloonX, 0);

//dibujar escena llamando la función
  drawPyramids();
  drawBalloon();

  //resetear a la posición inicial
  ctx.restore();

   //dibujar encabezado que va al final porque es el top de la página

  drawHeader();
}



restartButton.addEventListener("click", function (event) {
  audio.innerHTML = `<audio src="sounds/music.mp3" autoplay></audio>`
  event.preventDefault();
  resetGame();
  restartButton.style.display = "none"; // activar boton de reseteo
  resetGame();
  winButton.style.display = "none";  // activar botón win
});

function drawCircle(cx, cy, radius) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPyramids() {
  pyramids.forEach(({ x, h, r1, r2, r3, r4, r5, r6, r7, color }) => {
    ctx.save();
    ctx.translate(x, 0);

    // Forma de pirámide
    const pyramidWidth = 80;
    ctx.fillStyle = "#AC8141";
    ctx.beginPath();
    ctx.moveTo(pyramidWidth, 0);
    ctx.lineTo(0, -pyramidWidth)
    ctx.lineTo(-pyramidWidth, 0);
    
    ctx.closePath();
    ctx.fill();

    // Círculos de pirámide
    ctx.fillStyle = color;
    drawCircle(-20, -h - 15, r1);
    drawCircle(-30, -h - 25, r2);
    drawCircle(-20, -h - 35, r3);
    drawCircle(0, -h - 45, r4);
    drawCircle(20, -h - 35, r5);
    drawCircle(30, -h - 25, r6);
    drawCircle(20, -h - 15, r7);

    ctx.restore();
  });
}

function drawBalloon() {
  ctx.save();

  ctx.translate(balloonX, balloonY);

  // Cart
  ctx.fillStyle = "#D62828";
  ctx.fillRect(-30, -40, 60, 10);
  ctx.fillStyle = "#2472E6";
  ctx.fillRect(-30, -30, 60, 30);

  // Cables
  ctx.strokeStyle = "#D62828";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-24, -40);
  ctx.lineTo(-24, -60);
  ctx.moveTo(24, -40);
  ctx.lineTo(24, -60);
  ctx.stroke();

  // Balloon
  ctx.fillStyle = "#E6C224";
  ctx.beginPath();
  ctx.moveTo(-30, -60);
  ctx.quadraticCurveTo(-80, -120, -80, -160);
  ctx.arc(0, -160, 80, Math.PI, 0, false);
  ctx.quadraticCurveTo(80, -120, 30, -60);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawHeader() {
  // Medidor de combustible
  ctx.strokeStyle = fuel <= 30 ? "red" : "white";
  ctx.strokeRect(30, 30, 150, 30);
  ctx.fillStyle = fuel <= 30 
    ? "rgba(153, 0, 255, 0.507)" 
    : "rgba(56, 203, 240, 0.5)";
  ctx.fillRect(30, 30, (150 * fuel) / 100, 30);

  // Score
  const score = Math.floor(balloonX / 30);
  ctx.fillStyle = "white";
  ctx.font = "bold 32px Tahoma";
  ctx.textAlign = "end";
  ctx.textBaseline = "top";
  ctx.fillText(`${score} m`, window.innerWidth - 30, 30);
  if (score == 150) {
    winButton.style.display = "block";
    
    audio.innerHTML = `<audio src="sounds/music.mp3" autoplay></audio>`
    window.requestAnimationFrame();

  }
}

function drawSky() {
  var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, "#E2BB8C");
  gradient.addColorStop(1, "#FEF1E1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawBackgroundHills() {
  // Dibujo de colinas
  drawHill(
    hill1BaseHeight,
    hill1Speed,
    hill1Amplitude,
    hill1Stretch,
    "#BE9C68" 
  );
  drawHill(
    hill2BaseHeight,
    hill2Speed,
    hill2Amplitude,
    hill2Stretch,
    "#B99155" 
  );

  drawHill(
    hill3BaseHeight,
    hill3Speed,
    hill3Amplitude,
    hill3Stretch,
    "#b18b54"
  );

  // Dibujar el background de edificios
  backgroundBuilding.forEach((building) => drawBackgroundBuilding(building.x, building.color));
}

//la colina que se forma con una onda -sinus- y stretch
function drawHill(baseHeight, speedMultiplier, amplitude, stretch, color) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
  for (let i = 0; i <= window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(i, baseHeight, speedMultiplier, amplitude, stretch));
  }
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawBackgroundBuilding(x, color) {
  ctx.save();
  ctx.translate(
    (-balloonX * hill1Speed + x) * hill1Stretch,
    getBuildingY(x, hill1BaseHeight, hill1Amplitude)
  );

  const buildingHeight = 80;
  const buildingWidth = 40;
  

  // Dibujar edificio y colorear
  ctx.fillStyle = "#B6976E";
  ctx.fillRect(
    -buildingWidth / 2,
    -buildingHeight,
    buildingWidth,
    buildingHeight
  );

  //darle forma
  ctx.beginPath();
  ctx.moveTo(0, -buildingHeight);
  ctx.lineTo(0, -buildingHeight);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

function getHillY(x, baseHeight, speedMultiplier, amplitude, stretch) {
  const sineBaseY = -baseHeight;
  return (
    Math.sinus((balloonX * speedMultiplier + x) * stretch) * amplitude +
    sineBaseY
  );
}

function getBuildingY(x, baseHeight, amplitude) {
  const sineBaseY = -baseHeight;
  return Math.sinus(x) * amplitude + sineBaseY;
}
// detectar cuando golpee. Establecer los puntos de choque
function hitDetection() {
  const cartBottomLeft = { x: balloonX - 30, y: balloonY };   //punto de choque en el balloon
  const cartBottomRight = { x: balloonX + 30, y: balloonY };
  const cartTopRight = { x: balloonX + 30, y: balloonY - 40 };

  for (const { x, h, r1, r2, r3, r4, r5 } of pyramids) {
    const pyramidBottomLeft = { x: x - 20, y: -h - 15 };   ///puntos de choque en los círculos de las piramides

    const pyramidLeft = { x: x - 30, y: -h - 25 };
    const pyramidTopLeft = { x: x - 20, y: -h - 35 };
    const pyramidTop = { x: x, y: -h - 45 };
    const pyramidTopRight = { x: x + 20, y: -h - 35 };

    if (getDistance(cartBottomLeft, pyramidBottomLeft) < r1) return true;
    if (getDistance(cartBottomRight, pyramidBottomLeft) < r1) return true;
    if (getDistance(cartTopRight, pyramidBottomLeft) < r1) return true;

    if (getDistance(cartBottomLeft, pyramidLeft) < r2) return true;
    if (getDistance(cartBottomRight, pyramidLeft) < r2) return true;
    if (getDistance(cartTopRight, pyramidLeft) < r2) return true;

    if (getDistance(cartBottomLeft, pyramidTopLeft) < r3) return true;
    if (getDistance(cartBottomRight, pyramidTopLeft) < r3) return true;
    if (getDistance(cartTopRight, pyramidTopLeft) < r3) return true;

    if (getDistance(cartBottomLeft, pyramidTop) < r4) return true;
    if (getDistance(cartBottomRight, pyramidTop) < r4) return true;
    if (getDistance(cartTopRight, pyramidTop) < r4) return true;

    if (getDistance(cartBottomLeft, pyramidTopRight) < r5) return true;
    if (getDistance(cartBottomRight, pyramidTopRight) < r5) return true;
    if (getDistance(cartTopRight, pyramidTopRight) < r5) return true;
  }
}

function getDistance(point1, point2) {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
}

function restart() {
  resetGame();
}