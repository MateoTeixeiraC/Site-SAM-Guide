document.addEventListener('DOMContentLoaded', function() {
    const ITEMS_PER_PAGE = 6;
    let currentlyVisible = ITEMS_PER_PAGE;
    
    // Sélectionner toutes les actualités
    const newsItems = document.querySelectorAll('.col-md-6');
    const newsContainer = document.querySelector('.row.g-4');
    
    // Cacher les actualités en trop au chargement
    newsItems.forEach((item, index) => {
        if (index >= ITEMS_PER_PAGE) {
            item.style.display = 'none';
        }
    });
    
    // Créer et ajouter le bouton "Afficher plus" si nécessaire
    if (newsItems.length > ITEMS_PER_PAGE) {
        const loadMoreBtn = document.createElement('div');
        loadMoreBtn.className = 'text-center mt-4';
        loadMoreBtn.id = 'loadMoreContainer';
        loadMoreBtn.innerHTML = `
            <button class="btn btn-primary" onclick="loadMoreNews()">
                Afficher plus d'actualités
            </button>
        `;
        newsContainer.parentNode.appendChild(loadMoreBtn);
    }
    
    // Fonction pour charger plus d'actualités
    window.loadMoreNews = function() {
        const itemsToShow = Math.min(currentlyVisible + ITEMS_PER_PAGE, newsItems.length);
        
        for (let i = currentlyVisible; i < itemsToShow; i++) {
            newsItems[i].style.display = 'block';
        }
        
        currentlyVisible = itemsToShow;
        
        // Masquer le bouton si toutes les actualités sont affichées
        if (currentlyVisible >= newsItems.length) {
            document.getElementById('loadMoreContainer').style.display = 'none';
        }
        
        // Réinitialiser la troncature du texte pour les nouveaux éléments
        initializeTextTruncation();
    };
    
    // Initialiser la troncature du texte
    function initializeTextTruncation() {
        const newsBlocks = document.querySelectorAll('.news-block');
        
        newsBlocks.forEach(block => {
            const textElement = block.querySelector('p:last-child');
            if (!textElement) return;
            
            // Vérifier si le bouton existe déjà
            if (textElement.nextElementSibling && textElement.nextElementSibling.classList.contains('btn-show-more')) {
                return;
            }
            
            const originalText = textElement.textContent;
            
            // Mesurer la hauteur réelle du texte
            const originalHeight = textElement.scrollHeight;
            
            // Appliquer une hauteur maximale (environ 3 lignes = 72px avec line-height 1.5 et font-size 16px)
            const maxHeight = Math.floor(parseFloat(getComputedStyle(textElement).lineHeight) * 3);
            
            // Si le texte dépasse la hauteur maximale
            if (originalHeight > maxHeight + 5) { // +5px de marge pour éviter les faux positifs
                // Créer un style pour limiter la hauteur
                textElement.style.maxHeight = maxHeight + 'px';
                textElement.style.overflow = 'hidden';
                textElement.style.display = '-webkit-box';
                textElement.style.webkitLineClamp = '3';
                textElement.style.webkitBoxOrient = 'vertical';
                
                const showMoreBtn = document.createElement('button');
                showMoreBtn.textContent = 'Afficher plus';
                showMoreBtn.className = 'btn btn-link btn-sm p-0 text-decoration-underline btn-show-more';
                showMoreBtn.style.color = '#0066cc';
                
                let isExpanded = false;
                showMoreBtn.onclick = function() {
                    if (isExpanded) {
                        textElement.style.maxHeight = maxHeight + 'px';
                        textElement.style.overflow = 'hidden';
                        textElement.style.display = '-webkit-box';
                        textElement.style.webkitLineClamp = '3';
                        textElement.style.webkitBoxOrient = 'vertical';
                        showMoreBtn.textContent = 'Afficher plus';
                        isExpanded = false;
                    } else {
                        textElement.style.maxHeight = 'none';
                        textElement.style.overflow = 'visible';
                        textElement.style.display = 'block';
                        textElement.style.webkitLineClamp = 'none';
                        showMoreBtn.textContent = 'Afficher moins';
                        isExpanded = true;
                    }
                };
                
                textElement.parentNode.appendChild(showMoreBtn);
            }
        });
    }
    
    // Initialiser la troncature au chargement
    initializeTextTruncation();
});