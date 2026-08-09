 const menuButton = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
        menu.classList.toggle("menu-open");
    });
}
