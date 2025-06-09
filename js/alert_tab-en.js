let hasTabPressed = false;

  window.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' && !hasTabPressed) {
      hasTabPressed = true;
      const banner = document.createElement('div');
      banner.setAttribute('role', 'alert');
      banner.className = 'alert alert-warning text-center m-0';
      banner.innerText = "For a better keyboard navigation experience, we strongly recommend using the Chrome browser.";
      document.body.insertBefore(banner, document.body.firstChild);
    }
  });