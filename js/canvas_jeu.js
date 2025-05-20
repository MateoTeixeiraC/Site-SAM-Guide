// Fonction pour visualiser la zone de collision (optionnel, à des fins de débogage)
function drawCollisionRadius() {
  ctx.beginPath();
  ctx.arc(joueur.x, joueur.y, joueur.collisionRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.stroke();
}// Modification du code canvas_jeu.js

const canvas = document.getElementById('jeuCanvas');
const ctx = canvas.getContext('2d');

// Configuration de la piste (forme ovale)
const piste = {
  centerX: canvas.width / 2,
  centerY: canvas.height / 2,
  outerRadiusX: 250,
  outerRadiusY: 150,
  innerRadiusX: 180,
  innerRadiusY: 80,
  color: '#ff6b6b',
  borderColor: '#8ac926'
};

// Charger l'image du personnage et la préparer
const personnageImg = new Image();
personnageImg.src = '../img/personnage.png';
let personnageImgRotated = null;

// Fonction pour créer une version tournée de l'image
personnageImg.onload = function() {
  // Créer un canvas temporaire pour tourner l'image
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = personnageImg.width;
  tempCanvas.height = personnageImg.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Tourner l'image de 180 degrés
  tempCtx.translate(tempCanvas.width/2, tempCanvas.height/2);
  tempCtx.rotate(Math.PI);
  tempCtx.drawImage(personnageImg, -tempCanvas.width/2, -tempCanvas.height/2);
  
  // Créer une nouvelle image avec le résultat
  personnageImgRotated = new Image();
  personnageImgRotated.src = tempCanvas.toDataURL();
};

// Configuration du joueur
const joueur = {
  x: canvas.width / 2,
  y: canvas.height - 90,
  width: 30, // Largeur de l'image
  height: 30, // Hauteur de l'image
  collisionRadius: 15, // Rayon de collision plus grand que l'image
  angle: Math.PI, // Commence en bas, orienté vers le haut
  speed: 0.8, // Vitesse réduite (était 2)
  rotationSpeed: 0.02, // Vitesse de rotation réduite (était 0.05)
  color: '#1982c4'
};

// Variables de jeu
let keysPressed = {};
let lastBipTime = 0;
const bipCooldown = 500; // Temps minimum entre deux bips (en ms)
let tourComplet = false;
let startTime = null;
let lapTime = null;
let startPosition = { x: joueur.x, y: joueur.y };
let crossedStartLine = false;

// Sons
const bipGauche = document.getElementById('bipGauche');
const bipDroite = document.getElementById('bipDroite');
const arriveeSound = document.getElementById('arrivee');

// Fonction pour vérifier si un point est à l'intérieur de la piste
function isInsidePiste(x, y) {
  // Calculer la distance normalisée du centre de la piste
  const dx = (x - piste.centerX) / piste.outerRadiusX;
  const dy = (y - piste.centerY) / piste.outerRadiusY;
  const outerDistance = dx * dx + dy * dy;
  
  const dxInner = (x - piste.centerX) / piste.innerRadiusX;
  const dyInner = (y - piste.centerY) / piste.innerRadiusY;
  const innerDistance = dxInner * dxInner + dyInner * dyInner;
  
  // À l'intérieur de l'ellipse extérieure et à l'extérieur de l'ellipse intérieure
  return outerDistance <= 1 && innerDistance >= 1;
}

// Dessiner la piste d'athlétisme (forme ovale)
function drawPiste() {
  // Dessiner l'ellipse extérieure
  ctx.beginPath();
  ctx.ellipse(piste.centerX, piste.centerY, piste.outerRadiusX, piste.outerRadiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = piste.borderColor;
  ctx.fill();
  
  // Découper l'ellipse intérieure
  ctx.beginPath();
  ctx.ellipse(piste.centerX, piste.centerY, piste.innerRadiusX, piste.innerRadiusY, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#fff';
  ctx.fill();
  
  // Dessiner la ligne de départ/arrivée
  ctx.beginPath();
  ctx.moveTo(piste.centerX, piste.centerY + piste.innerRadiusY);
  ctx.lineTo(piste.centerX, piste.centerY + piste.outerRadiusY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000';
  ctx.stroke();
}

// Dessiner le joueur comme une image avec une rotation
function drawJoueur() {
  ctx.save();
  ctx.translate(joueur.x, joueur.y);
  ctx.rotate(joueur.angle);
  
  // Utiliser l'image tournée si elle est disponible, sinon utiliser l'image originale
  const imgToDraw = personnageImgRotated || personnageImg;
  if (imgToDraw.complete) {
    ctx.drawImage(imgToDraw, -joueur.width/2, -joueur.height/2, joueur.width, joueur.height);
  }
  
  ctx.restore();
}

// Vérifier la proximité des bords et émettre des signaux sonores
function checkProximity() {
  const now = Date.now();
  if (now - lastBipTime < bipCooldown) return;
  
  // Calculer le point devant le joueur (dans la direction qu'il regarde)
  const lookAheadDistance = joueur.collisionRadius * 3.5; // Distance à laquelle vérifier
  const lookAheadX = joueur.x + Math.cos(joueur.angle) * lookAheadDistance;
  const lookAheadY = joueur.y + Math.sin(joueur.angle) * lookAheadDistance;
  
  // Vérifier si le point devant est à l'intérieur de la piste
  if (!isInsidePiste(lookAheadX, lookAheadY)) {
    // Déterminer si le bord est à gauche ou à droite du joueur
    // Pour cela, calculons un point à gauche et à droite du joueur
    const leftAngle = joueur.angle - Math.PI/2;
    const rightAngle = joueur.angle + Math.PI/2;
    
    const leftX = joueur.x + Math.cos(leftAngle) * joueur.collisionRadius;
    const leftY = joueur.y + Math.sin(leftAngle) * joueur.collisionRadius;
    
    const rightX = joueur.x + Math.cos(rightAngle) * joueur.collisionRadius;
    const rightY = joueur.y + Math.sin(rightAngle) * joueur.collisionRadius;
    
    const leftInside = isInsidePiste(leftX, leftY);
    const rightInside = isInsidePiste(rightX, rightY);
    
    if (!leftInside && rightInside) {
      bipGauche.play();
    } else if (leftInside && !rightInside) {
      bipDroite.play();
    } else {
      // Si les deux sont dehors ou les deux sont dedans, utiliser la distance aux ellipses
      const dxOuter = (lookAheadX - piste.centerX) / piste.outerRadiusX;
      const dyOuter = (lookAheadY - piste.centerY) / piste.outerRadiusY;
      const outerDistance = dxOuter * dxOuter + dyOuter * dyOuter;
      
      const dxInner = (lookAheadX - piste.centerX) / piste.innerRadiusX;
      const dyInner = (lookAheadY - piste.centerY) / piste.innerRadiusY;
      const innerDistance = dxInner * dxInner + dyInner * dyInner;
      
      if (outerDistance > 1) {
        bipDroite.play(); // Bord extérieur
      } else if (innerDistance < 1) {
        bipGauche.play(); // Bord intérieur
      }
    }
    
    lastBipTime = now;
  }
}

// Vérifier si le joueur a complété un tour
function checkLapCompletion() {
  // Calculer la distance entre le joueur et la position de départ
  const distanceToStart = Math.sqrt(
    Math.pow(joueur.x - startPosition.x, 2) + 
    Math.pow(joueur.y - startPosition.y, 2)
  );
  
  // Vérifier si le joueur a traversé la ligne de départ/arrivée
  const nearStartLine = Math.abs(joueur.x - piste.centerX) < 5 && 
                        joueur.y > piste.centerY && 
                        joueur.y < piste.centerY + piste.outerRadiusY;
  
  if (nearStartLine && !crossedStartLine && distanceToStart > 100) {
    crossedStartLine = true;
  }
  
  // Si le joueur revient près de la position de départ après avoir traversé la ligne
  if (distanceToStart < 20 && crossedStartLine && !tourComplet) {
    tourComplet = true;
    lapTime = (Date.now() - startTime) / 1000; // Temps en secondes
    
    // Jouer le son d'arrivée
    arriveeSound.play();
    
    // Afficher un message de félicitations
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(piste.centerX - 150, piste.centerY - 50, 300, 100);
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Tour complet !', piste.centerX, piste.centerY - 15);
    ctx.fillText(`Temps: ${lapTime.toFixed(2)} secondes`, piste.centerX, piste.centerY + 15);
  }
}

// Mettre à jour la position du joueur en fonction des touches pressées
function updatePosition() {
  if (!startTime && (keysPressed['ArrowUp'] || keysPressed['ArrowDown'] || 
                     keysPressed['ArrowLeft'] || keysPressed['ArrowRight'])) {
    startTime = Date.now();
  }
  
  let newX = joueur.x;
  let newY = joueur.y;
  let newAngle = joueur.angle;
  
  // Rotation
  if (keysPressed['ArrowLeft']) {
    newAngle -= joueur.rotationSpeed;
  }
  if (keysPressed['ArrowRight']) {
    newAngle += joueur.rotationSpeed;
  }
  
  // Avancer/reculer
  if (keysPressed['ArrowUp']) {
    newX += Math.cos(joueur.angle) * joueur.speed;
    newY += Math.sin(joueur.angle) * joueur.speed;
  }
  if (keysPressed['ArrowDown']) {
    newX -= Math.cos(joueur.angle) * joueur.speed;
    newY -= Math.sin(joueur.angle) * joueur.speed;
  }
  
  // Vérifier si la nouvelle position est valide (à l'intérieur de la piste)
  // On utilise le rayon de collision pour vérifier
  // Vérifier plusieurs points autour du joueur pour une meilleure détection de collision
  const angleStep = Math.PI / 4; // 8 points autour du joueur
  let validPosition = true;
  
  for (let i = 0; i < 8; i++) {
    const checkAngle = i * angleStep;
    const checkX = newX + Math.cos(checkAngle) * joueur.collisionRadius;
    const checkY = newY + Math.sin(checkAngle) * joueur.collisionRadius;
    
    if (!isInsidePiste(checkX, checkY)) {
      validPosition = false;
      break;
    }
  }
  
  if (validPosition) {
    joueur.x = newX;
    joueur.y = newY;
  }
  
  joueur.angle = newAngle;
}

// Fonction principale de dessin
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawPiste();
  
  // Dessiner le joueur si au moins une des images est chargée
  if (personnageImg.complete || (personnageImgRotated && personnageImgRotated.complete)) {
    drawJoueur();
  }
  
  // Si le tour n'est pas encore complet, continuer à mettre à jour
  if (!tourComplet) {
    updatePosition();
    checkProximity();
    checkLapCompletion();
  }
  
  // Afficher les instructions
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Utilisez les flèches pour vous déplacer', 10, 20);
  ctx.fillText('↑ : avancer, ↓ : reculer, ← : tourner à gauche, → : tourner à droite', 10, 40);
  
  requestAnimationFrame(draw);
}

// Gestion des événements clavier
document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;
  e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

// Lancer le jeu
draw();