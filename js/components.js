const headerHTML = `
<header class="site-header">
    <div class="language-switch">
        <button onclick="location.href='#'">FR</button>
        <button onclick="location.href='../index-en.html'">EN</button>
    </div>
    <h1 class="site-title">
        <a href="../index.html">
            <img src="../img/logo/logo_samguide.png" alt="Logo SAM-Guide - Retour à l'accueil" class="logo-image">
            <span class="visually-hidden">SAM-Guide</span>
        </a>
    </h1>
    <!-- Bouton Burger -->
        <button class="burger-menu" id="burgerMenu" aria-expanded="false" aria-controls="navLinks" aria-label="Ouvrir le menu de navigation">
          <div class="bar"></div>
          <div class="bar"></div>
          <div class="bar"></div>
        </button>
    
    <!-- Menu à afficher/masquer -->
    <nav class="nav-links" id="navLinks" aria-label="Menu principal" aria-hidden="true">
        <a href="../index.html" data-page="index">Accueil</a>
        <a href="../html/projet.html" data-page="projet">Projet</a>
        <a href="../html/consortium.html" data-page="consortium">Consortium</a>
        <a href="../html/actualites.html" data-page="actualites">Actualités</a>
        <a href="../html/annonces.html" data-page="annonces">Annonces</a>
        <a href="../html/faq.html" data-page="faq">FAQ</a>
        <a href="../html/contact.html" data-page="contact">Contact</a>
        <a href="../html/jeu.html" data-page="jeu" class="d-none d-md-inline">Jeu Interactif</a>
    </nav>
</header>
`;

const footerHTML = `
<footer class="custom-site-footer text-center text-lg-start mt-auto border-top pt-4" aria-label="Pied de page avec liens de navigation et informations légales">
    <div class="container">
        <!-- Liens -->
        <nav aria-label="Plan du site">
        <span class="sr-only">Navigation du pied de page</span>
        <div class="d-flex justify-content-center gap-5 mt-2 mb-3 flex-wrap flex-column flex-md-row">
            <a href="../index.html" class="text-decoration-none text-dark">Accueil</a>
            <a href="../html/projet.html" class="text-decoration-none text-dark">Projet</a>
            <a href="../html/consortium.html" class="text-decoration-none text-dark">Consortium</a>
            <a href="../html/actualites.html" class="text-decoration-none text-dark">Actualités</a>
            <a href="../html/annonces.html" class="text-decoration-none text-dark">Annonces</a>
            <a href="../html/faq.html" class="text-decoration-none text-dark">FAQ</a>
            <a href="../html/contact.html" class="text-decoration-none text-dark">Contact</a>
            <a href="../html/jeu.html" class="text-decoration-none text-dark d-none d-md-inline">Jeu Interactif</a>
        </div>
        </nav>
        
        <!-- Mentions légales -->
        <p class="custom-mention text-muted small mb-0">&copy; Tous droits réservés – SAM-Guide / Projet financé par l'ANR, Réf. : ANR-21-CE33-0011-01 – Interaction – Robotique</p>
    </div>
    
    <!-- Logo en bas à droite -->
    <div class="position-relative">
        <a href="https://anr.fr/" target="_blank" rel="noopener noreferrer">
            <img src="../img/icons/logo_anr.webp" alt="Logo Agence Nationale de la Recherche - Organisme finançant le projet SAM-Guide" class="img-anr position-absolute bottom-0" style="width: 150px; height: auto;"><span class="sr-only"> (s'ouvre dans un nouvel onglet)</span>
        </a>
    </div>
</footer>
`;

function hideCurrentPageLinks() {
    const currentPath = window.location.pathname;
    let currentPage = '';
    
    // Debug : afficher le chemin actuel
    console.log('Chemin actuel:', currentPath);
    
    // Déterminer la page actuelle (version française)
    if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
        currentPage = 'index';
    } else if (currentPath.includes('projet.html')) {
        currentPage = 'projet';
    } else if (currentPath.includes('consortium.html')) {
        currentPage = 'consortium';
    } else if (currentPath.includes('actualites.html')) {
        currentPage = 'actualites';
    } else if (currentPath.includes('annonces.html')) {
        currentPage = 'annonces';
    } else if (currentPath.includes('faq.html')) {
        currentPage = 'faq';
    } else if (currentPath.includes('contact.html')) {
        currentPage = 'contact';
    } else if (currentPath.includes('jeu.html')) {
        currentPage = 'jeu';
    }
    
    console.log('Page détectée:', currentPage);
    
    // Masquer les liens UNIQUEMENT dans le header (nav-links)
    if (currentPage) {
        const linksToHide = document.querySelectorAll(`#navLinks [data-page="${currentPage}"]`);
        console.log('Liens header trouvés à masquer:', linksToHide);
        
        linksToHide.forEach((link, index) => {
            console.log(`Masquage lien header ${index + 1}:`, link.textContent, link.href);
            link.style.display = 'none';
        });
        
        console.log(`Page actuelle: ${currentPage} - ${linksToHide.length} lien(s) header masqué(s)`);
    } else {
        console.log('Aucune page détectée - aucun lien masqué');
    }
    
    // Debug supplémentaire : lister tous les liens du header avec data-page
    const allHeaderLinks = document.querySelectorAll('#navLinks [data-page]');
    console.log('Tous les liens header data-page trouvés:', allHeaderLinks.length);
    allHeaderLinks.forEach((link, index) => {
        console.log(`Lien header ${index + 1}: data-page="${link.getAttribute('data-page')}" texte="${link.textContent}" href="${link.href}"`);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('header-placeholder').innerHTML = headerHTML;
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
    
    // Masquer les liens de la page actuelle (header uniquement)
    setTimeout(() => {
        hideCurrentPageLinks();
        // Initialiser les scripts
        if (typeof initBurgerMenu === 'function') {
            initBurgerMenu();
        }
    }, 0);
});