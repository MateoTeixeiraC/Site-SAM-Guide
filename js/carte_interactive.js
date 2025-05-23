// Interactive map functionality
        const markers = document.querySelectorAll('.region-marker');
        const popups = document.querySelectorAll('.info-popup');

        markers.forEach(marker => {
            marker.addEventListener('mouseenter', function(e) {
                const regionName = this.getAttribute('data-region');
                const popup = document.getElementById(`popup-${regionName}`);
                
                // Hide all other popups
                popups.forEach(p => p.classList.remove('show'));
                
                // Position and show the current popup
                const rect = this.getBoundingClientRect();
                const container = document.querySelector('.france-map-container').getBoundingClientRect();
                
                const popupWidth = 320;
                const leftPosition = rect.left - container.left + rect.width/2 - popupWidth/2;
                const topPosition = rect.top - container.top - 20;
                
                // Ensure popup stays within container bounds
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

        // Keep popup open when hovering over it
        popups.forEach(popup => {
            popup.addEventListener('mouseenter', function() {
                this.classList.add('show');
            });
            
            popup.addEventListener('mouseleave', function() {
                this.classList.remove('show');
            });
        });

        // Hide popups when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.region-marker') && !e.target.closest('.info-popup')) {
                popups.forEach(p => p.classList.remove('show'));
            }
        });