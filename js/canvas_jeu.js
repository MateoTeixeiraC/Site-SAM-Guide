const canvas = document.getElementById('jeuCanvas');
const ctx = canvas.getContext('2d');

// Définition de la piste (forme arrondie)
const piste = {
  x: 300,
  y: 200,
  outerRadiusX: 250,  // Rayon horizontal
  outerRadiusY: 140,  // Rayon vertical
  innerRadiusX: 170,  // Rayon intérieur
  innerRadiusY: 60    // Rayon intérieur vertical
};

// Joueur (avec une image PNG de top view)
const joueur = {
  x: piste.x,
  y: piste.y - piste.outerRadiusY - 20,  // Position initiale en haut
  angle: Math.PI / 2,  // Regarde vers le bas au départ
  speed: 2,  // Vitesse de déplacement
  turnSpeed: 0.1,  // Vitesse de rotation
};

// Sons
const bipGauche = document.getElementById('bipGauche');
const bipDroite = document.getElementById('bipDroite');
const audioArrivee = document.getElementById('audioArrivee');

// Variables pour la détection du tour
let tourComplet = false;

// Fonction pour dessiner la piste
function drawPiste() {
  // Zone extérieure
  ctx.fillStyle = '#ccc';
  ctx.beginPath();
  ctx.ellipse(piste.x, piste.y, piste.outerRadiusX, piste.outerRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  // Zone intérieure (vide)
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(piste.x, piste.y, piste.innerRadiusX, piste.innerRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ligne d'arrivée (en haut de la piste)
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(piste.x - 10, piste.y - piste.outerRadiusY);
  ctx.lineTo(piste.x + 10, piste.y - piste.outerRadiusY);
  ctx.stroke();
}

// Fonction pour dessiner le joueur
function drawJoueur() {
  ctx.save();
  ctx.translate(joueur.x, joueur.y);
  ctx.rotate(joueur.angle);
  ctx.fillStyle = 'blue'; // Changer la couleur pour simuler le joueur
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Fonction pour détecter les collisions avec les bords de la piste
function checkCollisionsAndFeedback() {
  const dx = joueur.x - piste.x;
  const dy = joueur.y - piste.y;
  const dist = Math.pow(dx / piste.outerRadiusX, 2) + Math.pow(dy / piste.outerRadiusY, 2);
  const distInner = Math.pow(dx / piste.innerRadiusX, 2) + Math.pow(dy / piste.innerRadiusY, 2);

  if (dist > 1) {
    bipDroite.play();
    joueur.x -= Math.cos(joueur.angle) * joueur.speed;
    joueur.y -= Math.sin(joueur.angle) * joueur.speed;
  } else if (distInner < 1) {
    bipGauche.play();
    joueur.x -= Math.cos(joueur.angle) * joueur.speed;
    joueur.y -= Math.sin(joueur.angle) * joueur.speed;
  }
}

// Fonction pour vérifier si le joueur a terminé un tour
function checkArrivee() {
  if (!tourComplet && joueur.y < piste.y - piste.outerRadiusY + 5) {
    tourComplet = true;
    audioArrivee.play();
    alert("Tour complété !");
  }
}

// Fonction pour dessiner tout le jeu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPiste();
  drawJoueur();
}

// Fonction pour mettre à jour la position du joueur
function updatePosition() {
  if (keys['ArrowLeft']) {
    joueur.angle -= joueur.turnSpeed;
  }
  if (keys['ArrowRight']) {
    joueur.angle += joueur.turnSpeed;
  }
  if (keys['ArrowUp']) {
    joueur.x += Math.cos(joueur.angle) * joueur.speed;
    joueur.y += Math.sin(joueur.angle) * joueur.speed;
  }
  if (keys['ArrowDown']) {
    joueur.x -= Math.cos(joueur.angle) * joueur.speed;
    joueur.y -= Math.sin(joueur.angle) * joueur.speed;
  }
  checkCollisionsAndFeedback();
  checkArrivee();
}

// Gestion des touches
const keys = {};
document.addEventListener('keydown', (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault(); // empêche le scroll et le changement d'onglet
  }
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Boucle de jeu
function gameLoop() {
  updatePosition();
  draw();
  requestAnimationFrame(gameLoop);
}

// Démarre le jeu
gameLoop();
