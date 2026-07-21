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

let search = false
let search_data = null

function toggle_search() {
    const search_box = document.querySelector(".search")
    const search_content = document.querySelector(".search-content");
    const search_input = document.getElementById("search");

    if (!search_data) load_search_results()

    if (!search) {
        search_box.classList.remove("inactive")
        search_box.classList.add("active")

        setTimeout(function () {
            search_input.focus();
        }, 100);
        search = true
    } else {
        search_box.classList.remove("active")
        search_box.classList.add("inactive")

        search_input.value = "";
        search_content.innerHTML = "";

        search = false
    }
}

function getSiteRoot() {
    return (window.STARTER_CONFIG && window.STARTER_CONFIG.root) || '/';
}

function load_theme() {
    const theme = window.localStorage.getItem("data-theme");

    if (theme) {
        html.setAttribute("data-theme", theme);
    }
}

function load_search_results() {
    const search_content = document.querySelector(".search-content");
    fetch("content.json").then((response) => {
        search_content.innerHTML = "<div class='search-tip'>加载数据中...</div>"
        return response.json()
    }).then((data) => {
        search_content.innerHTML = "<div class='search-tip'>输入关键词进行检索</div>"
        search_data = data
    }).catch((error) => {
        search_content.innerHTML = "<div class='search-tip'>数据加载失败:(</div>"
    })
}

function process_search_results() {
    const search_content = document.querySelector(".search-content");
    const search_input = document.getElementById("search");
    const value = search_input.value.trim();

    if (!value) {
        search_content.innerHTML = "<div class='search-tip'>输入关键词进行检索</div>"
        return
    }
    if (!search_data) load_search_results()

    const keywords = value.toLowerCase().split(/\s+/).filter(Boolean);
    const results = [];

    search_data.posts.forEach(post => {
        let score = 0;
        const matchedKeywords = [];

        /* 依旧老爷检索算法，懒得想了，直接改了 */
        keywords.forEach(keyword => {
            if (post.title && post.title.toLowerCase().includes(keyword)) {
                score += 10;
                matchedKeywords.push(keyword);
            }

            // 内容匹配
            if (post.text && post.text.toLowerCase().includes(keyword)) {
                score += 1;
                matchedKeywords.push(keyword);
            }
        });

        if (score > 0) {
            results.push({
                post: post,
                score: score,
                matchedKeywords: [...new Set(matchedKeywords)],
            });
        }
    })

    results.sort(function (a, b) {
        return b.score - a.score;
    });

    render_search_results(results)
}

function render_search_results(results) {
    const search_content = document.querySelector(".search-content");
    if (results.length === 0) {
        search_content.innerHTML = '<div class="search-tip">没有找到相关结果</div>';
        return;
    }

    const parent_element = document.createElement("div")

    results.forEach((result) => {
        let post = result.post;

        const article_element = document.createElement("a")
        article_element.href = post.permalink

        const article_title_element = document.createElement("div")
        article_title_element.setAttribute("class", "title")
        article_title_element.textContent = post.title
        article_element.appendChild(article_title_element)

        const article_excerpt_element = document.createElement("div")
        article_excerpt_element.setAttribute("class", "excerpt")
        article_excerpt_element.textContent = post.text.substring(0, 200) + "..."
        article_element.appendChild(article_excerpt_element)

        parent_element.appendChild(article_element)
    })

    search_content.replaceChildren(parent_element)
}

/* 脚本的主入口 */
function main() {
    const search_modal = document.querySelector(".search");
    const search_input = document.getElementById("search");

    /* 点击遮罩关闭 */
    search_modal.addEventListener("click", function (e) {
        if (e.target === search_modal) {
            toggle_search()
        }
    });

    let debounceTimer = null;
    search_input.addEventListener("input", function (e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function () {
            process_search_results();
        }, 300);
    })

    load_theme()
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
} else {
    main();
}
