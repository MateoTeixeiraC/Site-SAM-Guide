const canvas = document.getElementById("jeuCanvas");
const ctx = canvas.getContext("2d");

const largeur = canvas.width;
const hauteur = canvas.height;

// Piste ovale
const centreX = largeur / 2;
const centreY = hauteur / 2;
const rayonX = 300;
const rayonY = 150;
const epaisseurPiste = 40;

// Joueur
const joueur = {
  x: centreX,
  y: centreY - rayonY + 20, // Point de départ en haut
  angle: 90, // en degrés
  vitesse: 2,
  rotation: 4, // degrés
  rayon: 10,
  image: new Image(),
};
joueur.image.src = "joueur.png"; // Image vue de haut du joueur

// Sons
const bipGauche = document.getElementById("bipGauche");
const bipDroite = document.getElementById("bipDroite");
const bipArrivee = document.getElementById("bipArrivee");

let touchees = {};
let aFaitUnTour = false;
let checkpointDepart = false;

document.addEventListener("keydown", (e) => {
  touchees[e.key] = true;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }
});
document.addEventListener("keyup", (e) => {
  touchees[e.key] = false;
});

function update() {
  if (touchees["ArrowLeft"]) joueur.angle -= joueur.rotation;
  if (touchees["ArrowRight"]) joueur.angle += joueur.rotation;

  const rad = (joueur.angle * Math.PI) / 180;
  if (touchees["ArrowUp"]) {
    joueur.x += Math.cos(rad) * joueur.vitesse;
    joueur.y += Math.sin(rad) * joueur.vitesse;
  }
  if (touchees["ArrowDown"]) {
    joueur.x -= Math.cos(rad) * joueur.vitesse;
    joueur.y -= Math.sin(rad) * joueur.vitesse;
  }

  // Distance à l’ellipse
  const dx = joueur.x - centreX;
  const dy = joueur.y - centreY;
  const d2 = (dx * dx) / (rayonX * rayonX) + (dy * dy) / (rayonY * rayonY);

  if (d2 > 1) {
    bipDroite.currentTime = 0;
    bipDroite.play();
    // Revenir sur la piste
    joueur.x -= Math.cos(rad) * joueur.vitesse;
    joueur.y -= Math.sin(rad) * joueur.vitesse;
  } else if (d2 < Math.pow((rayonX - epaisseurPiste) / rayonX, 2) +
                    Math.pow((rayonY - epaisseurPiste) / rayonY, 2)) {
    bipGauche.currentTime = 0;
    bipGauche.play();
    joueur.x -= Math.cos(rad) * joueur.vitesse;
    joueur.y -= Math.sin(rad) * joueur.vitesse;
  }

  // Détection de passage au point de départ
  const dansZoneDepart = dx * dx + (dy + rayonY - 20) * (dy + rayonY - 20) < 200;
  if (dansZoneDepart) {
    if (checkpointDepart) {
      bipArrivee.play();
      checkpointDepart = false;
      aFaitUnTour = true;
    }
  } else {
    checkpointDepart = true;
  }
}

function drawPiste() {
  ctx.clearRect(0, 0, largeur, hauteur);

  // Extérieur
  ctx.beginPath();
  ctx.ellipse(centreX, centreY, rayonX, rayonY, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#ccc";
  ctx.fill();

  // Intérieur
  ctx.beginPath();
  ctx.ellipse(centreX, centreY, rayonX - epaisseurPiste, rayonY - epaisseurPiste, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Zone de départ
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(centreX - 30, centreY - rayonY + 10, 60, 10);
}

function drawJoueur() {
  const rad = (joueur.angle * Math.PI) / 180;

  ctx.save();
  ctx.translate(joueur.x, joueur.y);
  ctx.rotate(rad);
  ctx.drawImage(joueur.image, -15, -15, 30, 30); // centré
  ctx.restore();
}

function boucle() {
  update();
  drawPiste();
  drawJoueur();
  requestAnimationFrame(boucle);
}

joueur.image.onload = () => {
  boucle();
};
