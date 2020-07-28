export const addBurgerClickEvent = (e) => {
    document.querySelector(".burger").addEventListener("click", function (e) {
        e.target.closest(".burger").classList.toggle("burger--active");
        document
            .querySelector(".main-header__nav")
            .classList.toggle("main-header__nav--active");
    });
};
