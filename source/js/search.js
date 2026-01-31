/**
 * 本地搜索功能
 */
(function () {
  "use strict";

  let searchData = null;
  let searchModal = null;
  let searchInput = null;
  let searchResults = null;
  let isLoading = false;

  // 初始化搜索
  function initSearch() {
    searchModal = document.getElementById("search-modal");
    searchInput = document.getElementById("search-input");
    searchResults = document.getElementById("search-results");

    if (!searchModal || !searchInput || !searchResults) {
      return;
    }

    // 绑定搜索按钮
    const searchToggle = document.querySelector(".search-toggle");
    if (searchToggle) {
      searchToggle.addEventListener("click", openSearch);
    }

    // 绑定关闭按钮
    const closeBtn = searchModal.querySelector(".search-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeSearch);
    }

    // 点击遮罩关闭
    searchModal.addEventListener("click", function (e) {
      if (e.target === searchModal) {
        closeSearch();
      }
    });

    // ESC 关闭
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchModal.classList.contains("active")) {
        closeSearch();
      }
      // Ctrl/Cmd + K 打开搜索
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    });

    // 搜索输入
    let debounceTimer = null;
    searchInput.addEventListener("input", function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        performSearch(searchInput.value.trim());
      }, 300);
    });
  }

  // 打开搜索
  function openSearch() {
    if (!searchModal) return;

    searchModal.classList.add("active");
    document.body.style.overflow = "hidden";

    // 加载搜索数据
    loadSearchData();

    // 聚焦输入框
    setTimeout(function () {
      searchInput.focus();
    }, 100);
  }

  // 关闭搜索
  function closeSearch() {
    if (!searchModal) return;

    searchModal.classList.remove("active");
    document.body.style.overflow = "";
    searchInput.value = "";
    searchResults.innerHTML = "";
  }

  // 获取站点根路径
  function getSiteRoot() {
    return (window.STARTER_CONFIG && window.STARTER_CONFIG.root) || '/';
  }

  // 加载搜索数据
  function loadSearchData() {
    if (searchData || isLoading) return;

    isLoading = true;
    searchResults.innerHTML = '<div class="search-loading">加载中...</div>';

    const root = getSiteRoot();
    const searchUrl = root + 'search.json';
    fetch(searchUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        searchData = data;
        isLoading = false;
        searchResults.innerHTML =
          '<div class="search-tip">输入关键词开始搜索</div>';
      })
      .catch(function (error) {
        console.error("加载搜索数据失败:", error);
        isLoading = false;
        searchResults.innerHTML =
          '<div class="search-error">加载失败，请刷新重试</div>';
      });
  }

  // 执行搜索
  function performSearch(query) {
    if (!query) {
      searchResults.innerHTML =
        '<div class="search-tip">输入关键词开始搜索</div>';
      return;
    }

    if (!searchData) {
      searchResults.innerHTML = '<div class="search-loading">加载中...</div>';
      return;
    }

    const keywords = query.toLowerCase().split(/\s+/).filter(Boolean);
    const results = [];

    searchData.forEach(function (item) {
      let score = 0;
      const matchedKeywords = [];

      keywords.forEach(function (keyword) {
        // 标题匹配（权重最高）
        if (item.title && item.title.toLowerCase().includes(keyword)) {
          score += 10;
          matchedKeywords.push(keyword);
        }

        // 标签匹配
        if (
          item.tags &&
          item.tags.some(function (tag) {
            return tag.toLowerCase().includes(keyword);
          })
        ) {
          score += 5;
          matchedKeywords.push(keyword);
        }

        // 内容匹配
        if (item.content && item.content.toLowerCase().includes(keyword)) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      });

      if (score > 0) {
        results.push({
          item: item,
          score: score,
          matchedKeywords: [...new Set(matchedKeywords)],
        });
      }
    });

    // 按分数排序
    results.sort(function (a, b) {
      return b.score - a.score;
    });

    renderResults(results.slice(0, 10), keywords);
  }

  // 渲染搜索结果
  function renderResults(results, keywords) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="search-empty">没有找到相关结果</div>';
      return;
    }

    searchResults.innerHTML = results
        .map(function (result) {
          const item = result.item;

          // 高亮标题
          let title = escapeHtml(item.title);
          keywords.forEach(function (keyword) {
            const regex = new RegExp("(" + escapeRegExp(keyword) + ")", "gi");
            title = title.replace(regex, "<mark>$1</mark>");
          });

          // 高亮摘要
          let excerpt = item.excerpt || "";
          excerpt = escapeHtml(excerpt);
          keywords.forEach(function (keyword) {
            const regex = new RegExp("(" + escapeRegExp(keyword) + ")", "gi");
            excerpt = excerpt.replace(regex, "<mark>$1</mark>");
          });

          // 标签
          let tagsHtml = "";
          if (item.tags && item.tags.length) {
            tagsHtml =
                '<div class="search-result-tags">' +
                item.tags
                    .slice(0, 3)
                    .map(function (tag) {
                      return (
                          '<span class="search-tag">' + escapeHtml(tag) + "</span>"
                      );
                    })
                    .join("") +
                "</div>";
          }

          const root = getSiteRoot();
          return (
              '<a href="' +
              root +
              item.url +
              '" class="search-result-item">' +
              '<div class="search-result-title">' +
              title +
              "</div>" +
              (excerpt
                  ? '<div class="search-result-excerpt">' + excerpt + "...</div>"
                  : "") +
              tagsHtml +
              (item.date
                  ? '<div class="search-result-date">' + item.date + "</div>"
                  : "") +
              "</a>"
          );
        })
        .join("");
  }

  // HTML 转义
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // 正则转义
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // DOM 加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
