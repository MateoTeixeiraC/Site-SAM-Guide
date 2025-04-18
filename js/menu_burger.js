/*Clic burger*/       
document.addEventListener("DOMContentLoaded", function() {
    const burger = document.getElementById("burgerMenu");
    const nav = document.getElementById("navLinks");

    burger.addEventListener("click", function() {
        nav.classList.toggle("nav-active");
        burger.classList.toggle("active");
    });
});