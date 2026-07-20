const html = document.documentElement

function switch_theme() {
    const theme = html.getAttribute("data-theme")
    const theme_btn_icon = document.getElementById("theme_btn_icon")
    const next_theme = theme === "light"? "dark" : "light";
    const next_theme_btn_icon = theme === "light"? "basil:moon-outline": "tabler:sun"
    theme_btn_icon.setAttribute("icon", next_theme_btn_icon)
    html.setAttribute("data-theme", next_theme)
    window.localStorage.setItem("data-theme", next_theme);
}

let collapse = false

function open_mobile_nav() {
    const mobile_nav = document.querySelector(".mobile-background")
    const nav = document.querySelector(".background")

    if (!collapse) {
        mobile_nav.classList.remove("inactive")
        collapse = true
    } else {
        mobile_nav.classList.add("inactive");
        collapse = false
    }

}

function load_theme() {
    const theme = window.localStorage.getItem("data-theme");

    if (theme) {
        html.setAttribute("data-theme", theme);
    }
}

/* 脚本的主入口 */
function main() {
    load_theme()
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
