let hasTabPressed = false;

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' && !hasTabPressed) {
      hasTabPressed = true;
      const banner = document.createElement('div');
      banner.setAttribute('role', 'alert');
      banner.className = 'alert alert-warning text-center m-0';
      banner.innerText = "Pour une meilleure navigation clavier (tabulation), nous recommandons fortement d'utiliser Chrome.";
      document.body.insertBefore(banner, document.body.firstChild);
    }
  });