const canvas = document.getElementById('jeuCanvas');
const ctx = canvas.getContext('2d');

// Configuration de la piste (forme plus réaliste avec lignes droites et virages)
const piste = {
  centerX: canvas.width / 2,
  centerY: canvas.height / 2,
  width: 400, // Largeur totale de la piste
  height: 250, // Hauteur totale de la piste
  trackWidth: 80, // Largeur de la piste elle-même
  cornerRadius: 70, // Rayon des virages
  color: '#ff6b6b',
  borderColor: '#8ac926'
};

// Configuration du joueur
const joueur = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  radius: 20, // Augmentation de la taille pour une meilleure collision
  angle: Math.PI, // Commence en bas, orienté vers le haut
  speed: 1, // Vitesse réduite
  rotationSpeed: 0.04, // Vitesse de rotation ajustée
  color: '#1982c4',
  image: new Image()
};

// Charger l'image du personnage
joueur.image.src = '../img/personnage.png';
joueur.image.onload = function() {
  // Lancer le jeu une fois l'image chargée
  draw();
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
const sonArrivee = document.getElementById('arrivee');

// Fonction pour vérifier si un point est à l'intérieur de la piste
function isInsidePiste(x, y) {
  const centerX = piste.centerX;
  const centerY = piste.centerY;
  const halfWidth = piste.width / 2;
  const halfHeight = piste.height / 2;
  const trackWidth = piste.trackWidth;
  const cornerRadius = piste.cornerRadius;
  
  // Position relative au centre
  const relX = Math.abs(x - centerX);
  const relY = Math.abs(y - centerY);
  
  // Vérifier si le point est en dehors des limites extérieures de la piste
  if (relX > halfWidth || relY > halfHeight) {
    return false;
  }
  
  // Vérifier si le point est à l'intérieur des limites intérieures (zone blanche)
  const innerLeft = halfWidth - trackWidth;
  const innerTop = halfHeight - trackWidth;
  
  // Point dans la zone centrale rectangulaire ?
  if (relX < innerLeft && relY < innerTop) {
    return false;
  }
  
  // Vérifier les coins intérieurs
  if (relX > innerLeft && relY > innerTop) {
    // Nous sommes dans une région de coin, vérifier si nous sommes dans le coin arrondi intérieur
    const cornerCenterX = innerLeft;
    const cornerCenterY = innerTop;
    const distanceToCorner = Math.sqrt(Math.pow(relX - cornerCenterX, 2) + Math.pow(relY - cornerCenterY, 2));
    const innerCornerRadius = Math.max(cornerRadius - trackWidth, 0);
    
    if (distanceToCorner < innerCornerRadius) {
      return false;
    }
  }
  
  return true;
}

// Dessiner la piste d'athlétisme (forme plus réaliste avec lignes droites et virages)
function drawPiste() {
  const x = piste.centerX - piste.width / 2;
  const y = piste.centerY - piste.height / 2;
  const w = piste.width;
  const h = piste.height;
  const r = piste.cornerRadius;
  const tw = piste.trackWidth;
  
  // Dessiner la partie extérieure de la piste
  ctx.fillStyle = piste.borderColor;
  ctx.beginPath();
  
  // Coins arrondis extérieurs
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5); // Coin supérieur gauche
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, 0); // Coin supérieur droit
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5); // Coin inférieur droit
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI); // Coin inférieur gauche
  
  ctx.closePath();
  ctx.fill();
  
  // Dessiner la partie intérieure (vide) de la piste
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  
  // Coins arrondis intérieurs
  const xi = x + tw;
  const yi = y + tw;
  const wi = w - 2 * tw;
  const hi = h - 2 * tw;
  const ri = Math.max(r - tw, 0);
  
  ctx.arc(xi + ri, yi + ri, ri, Math.PI, Math.PI * 1.5); // Coin supérieur gauche
  ctx.arc(xi + wi - ri, yi + ri, ri, Math.PI * 1.5, 0); // Coin supérieur droit
  ctx.arc(xi + wi - ri, yi + hi - ri, ri, 0, Math.PI * 0.5); // Coin inférieur droit
  ctx.arc(xi + ri, yi + hi - ri, ri, Math.PI * 0.5, Math.PI); // Coin inférieur gauche
  
  ctx.closePath();
  ctx.fill();
  
  // Dessiner la ligne de départ/arrivée
  ctx.beginPath();
  ctx.moveTo(piste.centerX, piste.centerY + piste.height/2 - piste.trackWidth);
  ctx.lineTo(piste.centerX, piste.centerY + piste.height/2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000';
  ctx.stroke();
}

// Dessiner le joueur avec une direction
function drawJoueur() {
  ctx.save();
  
  // Translater et pivoter le contexte au centre de la position du joueur
  ctx.translate(joueur.x, joueur.y);
  ctx.rotate(joueur.angle); // Rotation ajustée pour correspondre à l'image
  
  // Dessiner l'image centrée
  const imageWidth = joueur.radius * 2.5;
  const imageHeight = joueur.radius * 2.5;
  ctx.drawImage(joueur.image, -imageWidth/2, -imageHeight/2, imageWidth, imageHeight);
  
  // Option de débogage : dessiner le cercle de collision
  if (false) { // Mettre à true pour voir la zone de collision
    ctx.beginPath();
    ctx.arc(0, 0, joueur.radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'red';
    ctx.stroke();
  }
  
  ctx.restore();
}

// Vérifier la proximité des bords et émettre des signaux sonores
function checkProximity() {
  const now = Date.now();
  if (now - lastBipTime < bipCooldown) return;
  
  // Calculer le point devant le joueur (dans la direction qu'il regarde)
  const lookAheadDistance = joueur.radius * 2;
  const lookAheadX = joueur.x + Math.cos(joueur.angle) * lookAheadDistance;
  const lookAheadY = joueur.y + Math.sin(joueur.angle) * lookAheadDistance;
  
  // Points à gauche et à droite du joueur pour vérifier les bords
  const leftAngle = joueur.angle - Math.PI/2;
  const rightAngle = joueur.angle + Math.PI/2;
  
  const leftX = joueur.x + Math.cos(leftAngle) * joueur.radius * 1.2;
  const leftY = joueur.y + Math.sin(leftAngle) * joueur.radius * 1.2;
  
  const rightX = joueur.x + Math.cos(rightAngle) * joueur.radius * 1.2;
  const rightY = joueur.y + Math.sin(rightAngle) * joueur.radius * 1.2;
  
  // Vérifier si le point devant est à l'intérieur de la piste
  if (!isInsidePiste(lookAheadX, lookAheadY)) {
    // Si point devant est hors piste, vérifier de quel côté on doit tourner
    const leftInside = isInsidePiste(leftX, leftY);
    const rightInside = isInsidePiste(rightX, rightY);
    
    if (leftInside && !rightInside) {
      // Tourner à gauche - bord extérieur à droite
      bipDroite.play();
    } else if (!leftInside && rightInside) {
      // Tourner à droite - bord intérieur à gauche
      bipGauche.play();
    } else {
      // Les deux côtés sont problématiques ou aucun
      // Choisir en fonction de la position sur la piste
      const relX = joueur.x - piste.centerX;
      const relY = joueur.y - piste.centerY;
      
      if (Math.abs(relX) > Math.abs(relY)) {
        // Plus proche des côtés gauche/droite de la piste
        if (relX > 0) {
          bipDroite.play(); // Trop à droite de la piste
        } else {
          bipGauche.play(); // Trop à gauche de la piste
        }
      } else {
        // Plus proche du haut/bas de la piste
        if (relY > 0) {
          bipDroite.play(); // Trop en bas de la piste
        } else {
          bipGauche.play(); // Trop en haut de la piste
        }
      }
    }
    
    lastBipTime = now;
  }
}

// Vérifier si le joueur a complété un tour
function checkLapCompletion() {
  // Définir la zone de la ligne d'arrivée
  const finishLineX = piste.centerX;
  const finishLineTop = piste.centerY + piste.height/2 - piste.trackWidth;
  const finishLineBottom = piste.centerY + piste.height/2;
  const finishLineWidth = 5; // Zone de détection de la ligne
  
  // Vérifier si le joueur est sur la ligne d'arrivée
  const onFinishLine = 
    Math.abs(joueur.x - finishLineX) < finishLineWidth && 
    joueur.y > finishLineTop - 5 && 
    joueur.y < finishLineBottom + 5;
  
  // Calculer la distance entre le joueur et la position de départ
  const distanceToStart = Math.sqrt(
    Math.pow(joueur.x - startPosition.x, 2) + 
    Math.pow(joueur.y - startPosition.y, 2)
  );
  
  // Vérifier si le joueur a traversé la ligne de départ/arrivée
  if (onFinishLine && !crossedStartLine && distanceToStart > 100) {
    crossedStartLine = true;
    console.log("Traversé la ligne de départ!");
  }
  
  // Si le joueur revient près de la position de départ après avoir traversé la ligne
  if (onFinishLine && crossedStartLine && distanceToStart < 30 && !tourComplet) {
    tourComplet = true;
    lapTime = (Date.now() - startTime) / 1000; // Temps en secondes
    
    // Jouer le son d'arrivée
    sonArrivee.play();
    
    // Afficher un message de félicitations
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(piste.centerX - 150, piste.centerY - 75, 300, 150);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('FÉLICITATIONS !', piste.centerX, piste.centerY - 35);
    ctx.font = '18px Arial';
    ctx.fillText('Tour complet !', piste.centerX, piste.centerY);
    ctx.fillText(`Temps: ${lapTime.toFixed(2)} secondes`, piste.centerX, piste.centerY + 30);
    ctx.font = '14px Arial';
    ctx.fillText('Appuyez sur Espace pour recommencer', piste.centerX, piste.centerY + 60);
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
  if (isInsidePiste(newX, newY)) {
    joueur.x = newX;
    joueur.y = newY;
  }
  
  joueur.angle = newAngle;
}

// Fonction principale de dessin
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawPiste();
  drawJoueur();
  
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

// Ajouter fonction pour réinitialiser le jeu
function resetGame() {
  joueur.x = canvas.width / 2;
  joueur.y = canvas.height - 100;
  joueur.angle = Math.PI;
  
  startTime = null;
  lapTime = null;
  tourComplet = false;
  crossedStartLine = false;
  startPosition = { x: joueur.x, y: joueur.y };
}

// Gestion des événements clavier
document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;
  
  // Réinitialiser le jeu quand on appuie sur Espace après avoir complété un tour
  if (e.key === ' ' && tourComplet) {
    resetGame();
  }
  
  e.preventDefault();
});

document.addEventListener('keyup', (e) => {
  keysPressed[e.key] = false;
});

// Lancer le jeu
draw();