// Sélectionner tous les marqueurs (maintenant des buttons)
const markers = document.querySelectorAll('.region-marker');
const popups = document.querySelectorAll('.info-popup');

markers.forEach(marker => {
    const region = marker.getAttribute('data-region');
    const popup = document.getElementById(`popup-${region}`);
    
    // Événements existants (hover)
    marker.addEventListener('mouseenter', () => {
        showPopup(popup, marker);
    });
    
    marker.addEventListener('mouseleave', () => {
        hidePopup(popup);
    });
    
    // NOUVEAUX événements pour l'accessibilité clavier
    marker.addEventListener('focus', () => {
        showPopup(popup, marker);
    });
    
    marker.addEventListener('blur', () => {
        hidePopup(popup);
    });
    
    // Gestion du clic/Entrée
    marker.addEventListener('click', () => {
        togglePopup(popup, marker);
    });
    
    marker.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            togglePopup(popup, marker);
        }
    });
});

function showPopup(popup, marker) {
    // Cacher toutes les autres popups
    popups.forEach(p => {
        if (p !== popup) {
            p.classList.remove('show');
            p.setAttribute('aria-hidden', 'true');
        }
    });
    
    // Mettre à jour les attributs ARIA du marqueur
    marker.setAttribute('aria-expanded', 'true');
    
    // Positionner et afficher la popup
    positionPopup(popup, marker);
    popup.classList.add('show');
    popup.setAttribute('aria-hidden', 'false');
    
    // Optionnel : annoncer le contenu pour les lecteurs d'écran
    announcePopupContent(popup);
}

function hidePopup(popup) {
    popup.classList.remove('show');
    popup.setAttribute('aria-hidden', 'true');
    
    // Remettre aria-expanded à false pour le marqueur correspondant
    const region = popup.id.replace('popup-', '');
    const marker = document.querySelector(`[data-region="${region}"]`);
    if (marker) {
        marker.setAttribute('aria-expanded', 'false');
    }
}

// Fonction pour annoncer le contenu aux lecteurs d'écran
function announcePopupContent(popup) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    
    // Extraire le texte principal de la popup
    const title = popup.querySelector('h4').textContent;
    const university = popup.querySelector('p strong').textContent;
    
    announcement.textContent = `Informations affichées pour ${title}, ${university}. Utilisez les flèches pour naviguer dans le contenu.`;
    
    document.body.appendChild(announcement);
    
    // Supprimer l'annonce après un délai
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function togglePopup(popup, marker) {
    if (popup.classList.contains('show')) {
        hidePopup(popup);
    } else {
        showPopup(popup, marker);
    }
}

function positionPopup(popup, marker) {
    const rect = marker.getBoundingClientRect();
    const container = document.querySelector('.france-map-container');
    const containerRect = container.getBoundingClientRect();
    
    // Position relative au container
    const left = rect.left - containerRect.left + (rect.width / 2);
    const top = rect.top - containerRect.top - popup.offsetHeight - 15;
    
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.transform = 'translateX(-50%)';
}