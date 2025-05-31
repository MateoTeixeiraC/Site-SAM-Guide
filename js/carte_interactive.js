// Functionalités de la carte interactive de France
        const markers = document.querySelectorAll('.region-marker');
        const popups = document.querySelectorAll('.info-popup');

        markers.forEach(marker => {
            marker.addEventListener('mouseenter', function(e) {
                const regionName = this.getAttribute('data-region');
                const popup = document.getElementById(`popup-${regionName}`);
                
                // Cacher les autres popups
                popups.forEach(p => p.classList.remove('show'));
                
                // Positionner et afficher le popup actuel
                const rect = this.getBoundingClientRect();
                const container = document.querySelector('.france-map-container').getBoundingClientRect();
                
                const popupWidth = 320;
                const leftPosition = rect.left - container.left + rect.width/2 - popupWidth/2;
                const topPosition = rect.top - container.top - 20;
                
                // S'assurer que le popup reste dans les limites du conteneur
                const finalLeft = Math.max(10, Math.min(leftPosition, container.width - popupWidth - 10));
                
                popup.style.left = finalLeft + 'px';
                popup.style.top = (topPosition - popup.offsetHeight) + 'px';
                
                setTimeout(() => {
                    popup.classList.add('show');
                }, 50);
            });

            marker.addEventListener('mouseleave', function() {
                const regionName = this.getAttribute('data-region');
                const popup = document.getElementById(`popup-${regionName}`);
                setTimeout(() => {
                    if (!popup.matches(':hover') && !this.matches(':hover')) {
                        popup.classList.remove('show');
                    }
                }, 100);
            });
        });

        // Garder les popups visibles lors du survol
        popups.forEach(popup => {
            popup.addEventListener('mouseenter', function() {
                this.classList.add('show');
            });
            
            popup.addEventListener('mouseleave', function() {
                this.classList.remove('show');
            });
        });

        // Cacher les popups lorsqu'on clique à l'extérieur
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.region-marker') && !e.target.closest('.info-popup')) {
                popups.forEach(p => p.classList.remove('show'));
            }
        });