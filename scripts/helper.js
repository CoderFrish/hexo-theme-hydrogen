hexo.extend.helper.register("is_current", function(path) {
    const currentPath = this.page.path || "";
    const targetPath = path.replace(/^\//, "").replace(/\/$/, "");
    const current = currentPath
        .replace(/^\//, "")
        .replace(/\/$/, "")
        .replace(/index\.html$/, "");

    if (targetPath === "") {
        return current === "" || current === "index.html";
    }

    return current.startsWith(targetPath);
})
