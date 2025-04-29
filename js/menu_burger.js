/*Clic burger*/       
document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burgerMenu");
    const nav = document.getElementById("navLinks");

    burger.addEventListener("click", function() {
        nav.classList.toggle("nav-active");
        burger.classList.toggle("active");

        burger.classList.toggle("burger-white");
    });
});

document.querySelectorAll('.text-justify').forEach(p => {
    p.innerHTML = p.innerHTML.replace(/ (\S+)\s*$/, '&nbsp;$1');
  });
  