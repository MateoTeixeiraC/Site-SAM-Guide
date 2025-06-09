document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burgerMenu");
    const nav = document.getElementById("navLinks");
   
    burger.addEventListener("click", function() {
        nav.classList.toggle("nav-active");
        burger.classList.toggle("active");
        burger.classList.toggle("burger-white");
        
        // Gestion ARIA pour l'accessibilité
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        nav.setAttribute('aria-hidden', isExpanded);
        burger.setAttribute('aria-label', isExpanded ? 'Ouvrir le menu de navigation' : 'Fermer le menu de navigation');
        
        toggleMenu();
       
        // Vérifier si nous sommes sur un écran de bureau (> 768px)
        if (window.innerWidth > 768) {
            if (nav.classList.contains("nav-active")) {
                // Quand le menu est ouvert, fixer le burger sans bloquer le scroll
                burger.style.position = "fixed";
                burger.style.top = "35px";
                burger.style.right = "40px";
            } else {
                // Quand le menu est fermé, remettre le burger en position absolute
                burger.style.position = "absolute";
                burger.style.top = "35px";
                burger.style.right = "40px";
            }
        }
    });
   
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener("resize", function() {
        // Si le menu est fermé, on s'assure que le burger est correctement positionné
        if (!nav.classList.contains("nav-active")) {
            if (window.innerWidth > 768) {
                burger.style.position = "absolute";
            } else {
                burger.style.position = "fixed";
            }
        } else {
            // Si le menu est ouvert, le burger doit être fixe quelle que soit la taille de l'écran
            burger.style.position = "fixed";
        }
    });
    
    // Accessibilité initiale : menu fermé = liens non focusables
    document.querySelectorAll('#navLinks a').forEach(link => {
        link.setAttribute('tabindex', '-1');
    });
});

// Fonction toggleMenu modifiée pour la cohérence
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const isOpen = navLinks.classList.contains('nav-active');
 
    if (isOpen) {
        // Ouvrir : rendre focusables
        navLinks.querySelectorAll('a').forEach(link => {
            link.removeAttribute('tabindex');
        });
    } else {
        // Fermer : rendre non-focusables
        navLinks.querySelectorAll('a').forEach(link => {
            link.setAttribute('tabindex', '-1');
        });
    }
}

// Formatage des paragraphes justifiés
document.querySelectorAll('.text-justify').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/ (\S+)\s*$/, '&nbsp;$1');
});