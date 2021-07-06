let gameStarted; // Boolean

let balloonX;
let balloonY;

let verticalVelocity; //velocidad vertical actual del globo
let horizontalVelocity; //velocidad horizontal actual

let fuel; //pocertanje de gas
let heating; //boolean: el mouse está abajo o no

let pyramids; //metadata de las piramides en array
let backroundTrees; //metadata de ls arboles de fondo


//connfiguración
const mainAreaWidth = 400;
const mainAreaHeight = 375;
let horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
let verticalPadding = (window.innerHeight - mainAreaHeight) / 2;

//backround data
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

const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const introductionElement = document.getElementById('introduction');
const restartButton = document.getElementById('restart');

// tomas los degrees en vez de radianes para los arboles del background
Math.sinus = function (degree) {
    return Math.sin((degree / 180) * Math.PI);
  };
//Iniciar layout
resetGame();

function resetGame() {
    //cuando se resetea el juego
    gameStarted = false; //cuando debe iniciar el juego
    heating = false; // cuando el mouse is down
    verticalVelocity = 5; //seguimiento de la velocidad vertical y horizontal
    horizontalVelocity = 5;
    balloonX = 0; //posición inicial del balloon 
    balloonY = 0;
    fuel = 100;

    introductionElement.style.opacity = 1;
    restartButton.style.display = "none";

    pyramids = [];
    // generar 50 piramides y dibujar la escena inicial
    for (let i = 1; i < window.innerWidth / 50; i++) generatePyramids();
   
    backgroundTrees = [];
  for (let i = 1; i < window.innerWidth / 30; i++) generateBackgroundTree();

  draw();
}


// definir espacios entre arboles
function generateBackgroundTree(){
    const minimumGap = 30;
    const maximumGap = 150;

    const lastTree = backgroundTrees[backgroundTrees.length - 1];
  let furthestX = lastTree ? lastTree.x : 0;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));

  const treeColors = ["#6D8821", "#8FAC34", "#98B333"];
  const color = treeColors[Math.floor(Math.random() * 3)];

  backgroundTrees.push({ x, color });

}


// establecer distancias entre piramides
function generatePyramids() {
    const minimumGap = 40; // distancia min entre dos piramides
    const maximumGap = 600; // distancia máxima entre 2 piramides
// Elegir piradmides aleatoriamente
const x = pyramids.length
? pyramids[pyramids.length - 1].x +
  minimumGap +
  Math.floor(Math.random() * (maximumGap - minimumGap))
: 400;

const h = 60 + Math.random() * 80; // Altura

pyramids.push({x, h})
}

resetGame();

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
    if(!gameStarted) {
        introductionElement.style.opacity = 0; //Hace que la frase desaparezca al iniciar
        gameStarted = true;
        window.requestAnimationFrame(animate);
    
    }

});

window.addEventListener("mouseup", function () {
    heating = false;
});
 
// evento cambiar tamaño
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

    const velocityIncreaseRising = 0.4;  //velocidad incrementando
    const velocityDecreaseDescending = 0.2; //velocidad descendiendo

    // condicionarlo cuando ya no hay fuel

    if (heating && fuel > 0) {
        if (verticalVelocity > -8) {
            //Límite máximo de subida (empujar hacía arriba)
            verticalVelocity -= velocityIncreaseRising
        }
        fuel -= 0.002 * -balloonY;
    } else if (verticalVelocity < 5) {
        //Límite máximo de bajada (dejar que la gravedad actùe )
        verticalVelocity += velocityDecreaseDescending //ajustar la velocidad
    }
 /// cuando las coordenadas crecen hacía abajo los valores están al revés
 // establecer un límite inferior para que la velocidad descendiendo sea lenta
    balloonY += verticalVelocity; // después de ajustar, establece posicion actual del globo
    if (balloonY > 0) balloonY = 0; // aterrizando el globo, para
    if (balloonY < 0) balloonX += horizontalVelocity; //mover el globo a velocidad hoizontal si no ha aterrizado(es un valor constante)
    

//para no quedarnos sin piramides e irlas actualizando

    if(pyramids[0].x - (balloonX - horizontalPadding) < -100) {
        pyramids.shift(); // remueve el primer item del array
        generatePyramids(); //agrega uno nuevo
    } 
    if (
        backgroundTrees[0].x - (balloonX * hill1Speed - horizontalPadding) <
        -40
      ) {
        backgroundTrees.shift(); // remueve primer item
        generateBackgroundTree(); // agrega uno nuevo
      }
      draw(); //volver a renderizar toda la escena





const hit = function hitDetention() {
    if (hit || (fuel <= 0 && balloonY >= 0)) {
        restartButton.style.display = "block";
        return;
    }
}
    window.requestAnimationFrame(animate);
    

}
    //Si el globo pega una piramide o se le acaba la gaso y pega 
//antes de solicitar la otra animación comprobamos si pegó o acabó gaso y retorna la función
//así que ya no solicita otra animación y acaba el juego



function draw() {
   
    //mover la escena sobre la X del globo en dirección opuesta para equilibrar su mov
    //generar la escena en la que parece que el globo se mueve. (solo va hacía arriba y abajo en realidad)
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); //Limpiar cuando inicie nuevo
   
    drawSky(); // colorea el backround con un gradiente
    //Guardar y acumular la posición
    ctx.save();
    ctx.translate(0, verticalPadding + mainAreaHeight);
    drawBackgroundHills(); //llama a la función

    ctx.translate(horizontalPadding, 0);

  // centra el area principal de canvas en el medio de la pantalla
  ctx.translate(-balloonX, 0);


//dibujar escena llamando la función
drawPyramids();
drawBalloon();
//resetear a la posición inicial
ctx.restore();

drawHeader(); //dibujar encabezado

}
restartButton.addEventListener("click", function (event) {
    event.preventDefault();
    resetGame();
    restartButton.style.display = "none";
  });       // activar boton de reseteo



  function drawPyramids() {
      
    ctx.save();
   

const pyramidWidth = 80;    
ctx.fillStyle = "#c99f16";
ctx.beginPath();
ctx.moveTo(pyramidWidth,0);
ctx.lineTo(0,-pyramidWidth);
ctx.lineTo(-pyramidWidth,0);
ctx.closePath();
ctx.fill();

ctx.restore();

}

  
function drawBalloon() {
    ctx.save();
  
    ctx.translate(balloonX, balloonY);
  
    // Cart
    ctx.fillStyle = "#E9A6D5";
    ctx.fillRect(-30, -40, 60, 10);
    ctx.fillStyle = "#EA9E8D";
    ctx.fillRect(-30, -30, 60, 30);
  
    // Cables
    ctx.strokeStyle = "#F383D1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, -40);
    ctx.lineTo(-24, -60);
    ctx.moveTo(24, -40);
    ctx.lineTo(24, -60);
    ctx.stroke();
  
    // Balloon
    ctx.fillStyle = "#429FB6";
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
    // Fuel meter
    ctx.strokeStyle = fuel <= 30 ? "blue" : "orange";
    ctx.strokeRect(30, 30, 150, 30);
    ctx.fillStyle = fuel <= 30 
      ? "rgba(255,0,0,0.5)" 
      : "rgba(150,150,200,0.5)";
    ctx.fillRect(30, 30, (150 * fuel) / 100, 30);
  
    // Score
    const score = Math.floor(balloonX / 30);
    ctx.fillStyle = "black";
    ctx.font = "bold 32px Tahoma";
    ctx.textAlign = "end";
    ctx.textBaseline = "top";
    ctx.fillText(`${score} m`, window.innerWidth - 30, 30);
  }
  
  function drawSky() {
    var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, "#AADBEA");
    gradient.addColorStop(1, "#FEF1E1");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
  
  function drawBackgroundHills() {
    // Dibujar colinas
    drawHill(
      hill1BaseHeight,
      hill1Speed,
      hill1Amplitude,
      hill1Stretch,
      "#AAD155" // #95C629"
    );
    drawHill(
      hill2BaseHeight,
      hill2Speed,
      hill2Amplitude,
      hill2Stretch,
      "#84B249" // "#659F1C"
    );
  
    drawHill(
      hill3BaseHeight,
      hill3Speed,
      hill3Amplitude,
      hill3Stretch,
      "#8f5b18"
    );
  
    // Dibujar arboles background
    backgroundTrees.forEach((tree) => drawBackgroundTree(tree.x, tree.color));
  }
  
  // A hill is a shape under a stretched out sinus wave
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
  
  function drawBackgroundTree(x, color) {
    ctx.save();
    ctx.translate(
      (-balloonX * hill1Speed + x) * hill1Stretch,
      getTreeY(x, hill1BaseHeight, hill1Amplitude)
    );
  
    const treeTrunkHeight = 5;
    const treeTrunkWidth = 2;
    const treeCrownHeight = 25;
    const treeCrownWidth = 10;
  
    // Draw trunk
    ctx.fillStyle = "#7D833C";
    ctx.fillRect(
      -treeTrunkWidth / 2,
      -treeTrunkHeight,
      treeTrunkWidth,
      treeTrunkHeight
    );
  
    // Draw crown
    ctx.beginPath();
    ctx.moveTo(-treeCrownWidth / 2, -treeTrunkHeight);
    ctx.lineTo(0, -(treeTrunkHeight + treeCrownHeight));
    ctx.lineTo(treeCrownWidth / 2, -treeTrunkHeight);
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
  
  function getTreeY(x, baseHeight, amplitude) {
    const sineBaseY = -baseHeight;
    return Math.sinus(x) * amplitude + sineBaseY;
  }


 // detectar cuando golpee
 function hitDetention() {
    const cartBottomLeft = { x: balloonY - 30, y: balloonY }; //esquina inferior izq
    const cartBottomRight = { x: balloonY + 30, y: balloonY }; //esq, inferior der
    const cartTopRight = { x: balloonX + 30, y: balloonY - 40 }; // esq media derecha
    
  
    const pyramidTop = { x: balloonX, y: balloonY };
   
    if (getDistance(cartBottomLeft, pyramidTop) < balloonX.x) return true;
    if (getDistance(cartBottomRight, pyramidTop) < balloonX.x) return true;
    if (getDistance(cartTopRight, pyramidTop) < balloonX.x) return true;
    if (getDistance(cartBottomLeft, pyramidTop) < balloonY.y) return true;
    if (getDistance(cartBottomRight, pyramidTop) < balloonY.y) return true;
    if (getDistance(cartTopRight, pyramidTop) < balloonY.y) return true;
      }



 
      function getDistance(point1, point2) {
        return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
      }