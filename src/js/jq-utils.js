const imgToSvg = () => {
    $("img.img-svg").each(function () {
        const $img = $(this);
        const imgClass = $img.attr("class");
        const imgURL = $img.attr("src");
        const alt = $img.attr("alt");
        $.get(
            imgURL,
            function (data) {
                let $svg = $(data).find("svg");
                if (typeof imgClass !== "undefined") {
                    $svg = $svg.attr({
                        class: imgClass,
                        role: "img",
                        "aria-label": alt,
                    });
                }
                $svg = $svg.removeAttr("xmlns:a");
                if (
                    !$svg.attr("viewBox") &&
                    $svg.attr("height") &&
                    $svg.attr("width")
                ) {
                    $svg.attr(
                        "viewBox",
                        "0 0 " + $svg.attr("height") + " " + $svg.attr("width")
                    );
                }
                $img.replaceWith($svg);
            },
            "xml"
        );
    });
};

const slickSlider = () => {
    $(".slider").slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    });
    $(".slick-arrow").click(function () {
        $(".slider").slick("slickPlay");
    });
    //назначить перелистование на другие кнопки
    $(".btn--prev").slick("slickPrev");
    $(".btn--next").slick("slickNext");
};
const addOnlineTimer = () => {
    setInterval(() => {
        $($input).val(new Date().toLocaleTimeString());
    }, 1000);
};
