/**
 * 主脚本文件
 */
(function () {
  "use strict";

  // ===== 主题切换 =====
  function initThemeToggle() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;

    // 获取保存的主题或系统偏好
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const defaultTheme =
      document.documentElement.dataset.defaultTheme || "auto";

    let currentTheme;
    if (savedTheme) {
      currentTheme = savedTheme;
    } else if (defaultTheme === "auto") {
      currentTheme = prefersDark ? "dark" : "light";
    } else {
      currentTheme = defaultTheme;
    }

    setTheme(currentTheme);

    // 点击切换
    toggle.addEventListener("click", function () {
      const isDark = document.documentElement.dataset.theme === "dark";
      const newTheme = isDark ? "light" : "dark";
      setTheme(newTheme);
      localStorage.setItem("theme", newTheme);
    });

    // 监听系统主题变化
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) {
          setTheme(e.matches ? "dark" : "light");
        }
      });
  }

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
  }

  // ===== 移动端菜单 =====
  function initMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (!menuToggle || !mobileNav) return;

    menuToggle.addEventListener("click", function () {
      mobileNav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    // 点击导航链接后关闭菜单
    mobileNav.querySelectorAll(".mobile-nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileNav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });

    // 点击外部关闭
    document.addEventListener("click", function (e) {
      if (!menuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }

  // ===== TOC 高亮 =====
  function initTocHighlight() {
    const toc = document.querySelector(".toc-content");
    if (!toc) return;

    const headings = document.querySelectorAll(
      ".markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4"
    );
    if (headings.length === 0) return;

    const headerHeight =
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      ) || 64;
    const offset = headerHeight + 20;

    let activeLink = null;

    function updateActiveHeading() {
      let current = null;

      headings.forEach(function (heading) {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= offset) {
          current = heading;
        }
      });

      if (current) {
        const id = current.id;
        const link = toc.querySelector('a[href="#' + id + '"]');

        if (link && link !== activeLink) {
          if (activeLink) {
            activeLink.parentElement.classList.remove("active");
          }
          link.parentElement.classList.add("active");
          activeLink = link;
        }
      }
    }

    window.addEventListener("scroll", throttle(updateActiveHeading, 100));
    updateActiveHeading();
  }

  // ===== 图片灯箱 =====
  function initLightbox() {
    const images = document.querySelectorAll(".markdown-body img");
    if (images.length === 0) return;

    // 创建灯箱
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.innerHTML = '<img src="" alt="">';
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");

    images.forEach(function (img) {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    lightbox.addEventListener("click", function () {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // ===== 图片懒加载 =====
  function initLazyLoad() {
    const images = document.querySelectorAll(
      '.markdown-body img[loading="lazy"]'
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute("data-src");
              }
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: "100px",
        }
      );

      images.forEach(function (img) {
        observer.observe(img);
      });
    }
  }

  // ===== 代码复制按钮 =====
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll(".markdown-body pre");

    codeBlocks.forEach(function (pre) {
      const wrapper = document.createElement("div");
      wrapper.className = "code-wrapper";
      wrapper.style.position = "relative";

      const button = document.createElement("button");
      button.className = "code-copy-btn";
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
      button.title = "复制代码";
      button.style.cssText =
        "position: absolute; top: 8px; right: 8px; padding: 6px; background: var(--bg-tertiary); border: 1px solid var(--border-color); border-radius: var(--radius-sm); cursor: pointer; opacity: 0; transition: opacity 0.2s; color: var(--text-secondary);";

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(button);

      wrapper.addEventListener("mouseenter", function () {
        button.style.opacity = "1";
      });

      wrapper.addEventListener("mouseleave", function () {
        button.style.opacity = "0";
      });

      button.addEventListener("click", function () {
        const code = pre.querySelector("code");
        const text = code ? code.textContent : pre.textContent;

        navigator.clipboard.writeText(text).then(function () {
          button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          button.style.color = "var(--success)";

          setTimeout(function () {
            button.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>';
            button.style.color = "var(--text-secondary)";
          }, 2000);
        });
      });
    });
  }

  // ===== 平滑滚动到锚点 =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href === "#") return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight =
            parseInt(
              getComputedStyle(document.documentElement).getPropertyValue(
                "--header-height"
              )
            ) || 64;
          const top =
            target.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight -
            20;

          window.scrollTo({
            top: top,
            behavior: "smooth",
          });

          // 更新 URL
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ===== 回到顶部 =====
  function initBackToTop() {
    const button = document.createElement("button");
    button.className = "back-to-top";
    button.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"></path></svg>';
    button.title = "回到顶部";
    button.style.cssText =
      "position: fixed; bottom: 24px; right: 24px; z-index: 100; width: 48px; height: 48px; display: none; align-items: center; justify-content: center; background: var(--primary-color); color: white; border: none; border-radius: 50%; cursor: pointer; box-shadow: var(--shadow-lg); transition: all 0.3s;";
    document.body.appendChild(button);

    window.addEventListener(
      "scroll",
      throttle(function () {
        if (window.pageYOffset > 300) {
          button.style.display = "flex";
        } else {
          button.style.display = "none";
        }
      }, 100)
    );

    button.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ===== 外部链接处理 =====
  function initExternalLinks() {
    document.querySelectorAll(".markdown-body a").forEach(function (link) {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  // ===== 工具函数 =====
  function throttle(func, wait) {
    let timeout = null;
    let previous = 0;

    return function () {
      const now = Date.now();
      const remaining = wait - (now - previous);
      const context = this;
      const args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        func.apply(context, args);
      } else if (!timeout) {
        timeout = setTimeout(function () {
          previous = Date.now();
          timeout = null;
          func.apply(context, args);
        }, remaining);
      }
    };
  }

  // ===== 初始化 =====
  function init() {
    initThemeToggle();
    initMobileMenu();
    initTocHighlight();
    initLightbox();
    initLazyLoad();
    initCodeCopy();
    initSmoothScroll();
    initBackToTop();
    initExternalLinks();
  }

  // DOM 加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
