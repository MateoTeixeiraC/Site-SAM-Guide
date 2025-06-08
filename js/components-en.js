const headerHTML = `
<header class="site-header">
    <div class="language-switch">
        <button onclick="location.href='../index.html'">FR</button>
        <button onclick="location.href='#'">EN</button>
    </div>
    <h1 class="site-title">
        <a href="../index.html">
            <img src="../img/logo/logo_samguide.png" alt="SAM-Guide" class="logo-image">
            <span class="visually-hidden">SAM-Guide</span>
        </a>
    </h1>
    <!-- Bouton Burger -->
    <div class="burger-menu" id="burgerMenu">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>
    
    <!-- Menu à afficher/masquer -->
    <nav class="nav-links" id="navLinks">
        <a href="../index-en.html" data-page="index-en">Home</a>
        <a href="../html-en/projet-en.html" data-page="projet-en">Project</a>
        <a href="../html-en/consortium-en.html" data-page="consortium-en">Consortium</a>
        <a href="../html-en/actualites-en.html" data-page="actualites-en">News</a>
        <a href="../html-en/annonces-en.html" data-page="annonces-en">Announcements</a>
        <a href="../html-en/faq-en.html" data-page="faq-en">FAQ</a>
        <a href="../html-en/contact-en.html" data-page="contact-en">Contact</a>
        <a href="../html-en/jeu-en.html" data-page="jeu-en" class="d-none d-md-inline">Interactive Game</a>
    </nav>
</header>
`;

const footerHTML = `
<footer class="custom-site-footer text-center text-lg-start mt-auto border-top pt-4">
    <div class="container">
        <!-- Liens -->
        <div class="d-flex justify-content-center gap-5 mt-2 mb-3 flex-wrap flex-column flex-md-row">
            <a href="../index-en.html" class="text-decoration-none text-dark">Home</a>
            <a href="../html-en/projet-en.html" class="text-decoration-none text-dark">Project</a>
            <a href="../html-en/consortium-en.html" class="text-decoration-none text-dark">Consortium</a>
            <a href="../html-en/actualites-en.html" class="text-decoration-none text-dark">News</a>
            <a href="../html-en/annonces-en.html" class="text-decoration-none text-dark">Announcements</a>
            <a href="../html-en/faq-en.html" class="text-decoration-none text-dark">FAQ</a>
            <a href="../html-en/contact-en.html" class="text-decoration-none text-dark">Contact</a>
            <a href="../html-en/jeu-en.html" class="text-decoration-none text-dark d-none d-md-inline">Interactive Game</a>
        </div>
        
        <!-- Mentions légales -->
        <p class="custom-mention text-muted small mb-0">&copy; Tous droits réservés – SAM-Guide / Projet financé par l'ANR, Réf. : ANR-21-CE33-0011-01 – Interaction – Robotique</p>
    </div>
    
    <!-- Logo en bas à droite -->
    <div class="position-relative">
        <a href="https://anr.fr/" target="_blank">
            <img src="../img/icons/logo_anr.webp" alt="Logo ANR" class="img-anr position-absolute bottom-0" style="width: 150px; height: auto;">
        </a>
    </div>
</footer>
`;

function hideCurrentPageLinks() {
    const currentPath = window.location.pathname;
    let currentPage = '';
    
    // Debug : afficher le chemin actuel
    console.log('Current path:', currentPath);
    
    // Déterminer la page actuelle (version anglaise)
    if (currentPath.includes('index-en.html')) {
        currentPage = 'index-en';
    } else if (currentPath.includes('projet-en.html')) {
        currentPage = 'projet-en';
    } else if (currentPath.includes('consortium-en.html')) {
        currentPage = 'consortium-en';
    } else if (currentPath.includes('actualites-en.html')) {
        currentPage = 'actualites-en';
    } else if (currentPath.includes('annonces-en.html')) {
        currentPage = 'annonces-en';
    } else if (currentPath.includes('faq-en.html')) {
        currentPage = 'faq-en';
    } else if (currentPath.includes('contact-en.html')) {
        currentPage = 'contact-en';
    } else if (currentPath.includes('jeu-en.html')) {
        currentPage = 'jeu-en';
    }
    
    console.log('Detected page:', currentPage);
    
    // Masquer les liens UNIQUEMENT dans le header (nav-links)
    if (currentPage) {
        const linksToHide = document.querySelectorAll(`#navLinks [data-page="${currentPage}"]`);
        console.log('Found header links to hide:', linksToHide);
        
        linksToHide.forEach((link, index) => {
            console.log(`Hiding header link ${index + 1}:`, link.textContent, link.href);
            link.style.display = 'none';
        });
        
        console.log(`Current page: ${currentPage} - ${linksToHide.length} header link(s) hidden`);
    } else {
        console.log('No page detected - no links hidden');
    }
    
    // Debug supplémentaire : lister tous les liens du header avec data-page
    const allHeaderLinks = document.querySelectorAll('#navLinks [data-page]');
    console.log('All header data-page links found:', allHeaderLinks.length);
    allHeaderLinks.forEach((link, index) => {
        console.log(`Header link ${index + 1}: data-page="${link.getAttribute('data-page')}" text="${link.textContent}" href="${link.href}"`);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('header-en-placeholder').innerHTML = headerHTML;
    document.getElementById('footer-en-placeholder').innerHTML = footerHTML;
    
    // Masquer les liens de la page actuelle
    setTimeout(() => {
        hideCurrentPageLinks();
        // Initialiser vos scripts
        if (typeof initBurgerMenu === 'function') {
            initBurgerMenu();
        }
    }, 0);
});