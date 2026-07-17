hexo.extend.helper.register("current_path", function() {
    const current = this.page.path || "";
    return "/" + current
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replace(/index\.html$/, "");
})
