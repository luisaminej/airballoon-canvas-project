let gameStarted; // Boolean

let balloonX;
let balloonY;



//connfiguración
const mainAreaWidth = 400;
const mainAreaHeight = 400;
let horizontalPadding = (window.innerWidth - mainAreaWidth) / 2;
let verticalPadding = (window.innerHeight - mainAreaHeight) / 2;

const canvas = document.getElementById('game');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext('2d');

const introductionElement = document.getElementById('introduction');
const restartButton = document.getElementById('restart');


function draw() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); //Limpiar cuando inicie nuevo
   //Guardar y acumular la posición
    ctx.save();
    ctx.translate(horizontalPadding, verticalPadding + mainAreaHeight);


//dibujar escena
drawPyramids();
drawBalloon();
//resetear a la posición inicial
ctx.restore();

}

draw();

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

  
  function drawPyramids() {
      pyramid.forEach(({ x, h, r1, r2, r3, r4, r5, r6, r7, color
          
      }) => {
          ctx.save();
          ctx.translate(x, 0);
      
      ctx.fillStyle = "#c99f16";
      ctx.beginPath();
      ctx.moveTo(50,0);
      ctx.lineTo(0,-50)
      ctx.lineTo(-50,0)
      ctx.closePath();
      ctx.fill();

      ctx.restore();
  });

  }