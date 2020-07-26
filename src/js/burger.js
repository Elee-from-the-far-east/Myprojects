document.querySelector(".burger").addEventListener("click", function (e) {
    e.target.closest(".burger").classList.toggle("burger--active");
    document
        .querySelector(".main-header__navigation")
        .classList.toggle("main-header__navigation--active");
});
