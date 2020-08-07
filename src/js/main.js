window.onload = function (event) {
    document
        .querySelector(".header__label")
        .addEventListener("click", function (e) {
            document
                .querySelector(".header__input")
                .classList.toggle("header__input--active");
        });

    const sliderButtons = document.querySelectorAll(".slider__button");
    sliderButtons.forEach((el) => {
        el.addEventListener("mouseleave", function () {
            el.blur();
        });
    });

    const swiper = new Swiper(".swiper-container", {
        init: true,
        loop: true,
        slidesPerView: "auto",
        autoplay: {
            delay: 2500,
            disableOnInteraction: true,
        },
        autoHeight: true,
        grabCursor: true,
        navigation: {
            nextEl: ".slider__button--next",
            prevEl: ".slider__button--prev",
        },
    });
};
