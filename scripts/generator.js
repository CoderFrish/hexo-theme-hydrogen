"use strict";

/**
 * 搜索索引生成器
 * 在 Hexo 构建时生成 search.json 文件
 */
hexo.extend.generator.register("search", function (locals) {
  const config = this.theme.config.search || {};

  if (!config.enable) {
    return;
  }

  const fields = config.fields || ["title", "content", "tags"];
  const excerptLength = config.excerpt_length || 100;

  // 收集所有文章和页面
  const posts = locals.posts.sort("-date").toArray();
  const pages = locals.pages.toArray();

  const data = [];

  // 处理文章
  posts.forEach(function (post) {
    const item = {
      title: post.title || "",
      url: post.path,
      date: post.date ? post.date.format("YYYY-MM-DD") : "",
    };

    // 内容
    if (fields.includes("content")) {
      let content = post.content || "";
      // 移除 HTML 标签
      content = content.replace(/<[^>]+>/g, "");
      // 移除多余空白
      content = content.replace(/\s+/g, " ").trim();
      // 截取摘要
      item.content = content.substring(0, excerptLength * 3);
      item.excerpt = content.substring(0, excerptLength);
    }

    // 标签
    if (fields.includes("tags") && post.tags) {
      item.tags = post.tags.map(function (tag) {
        return tag.name;
      });
    }

    // 分类
    if (fields.includes("categories") && post.categories) {
      item.categories = post.categories.map(function (cat) {
        return cat.name;
      });
    }

    data.push(item);
  });

  // 处理页面（包括文档页面）
  pages.forEach(function (page) {
    // 跳过没有标题的页面
    if (!page.title) return;

    const item = {
      title: page.title,
      url: page.path,
      isPage: true,
    };

    // 内容
    if (fields.includes("content")) {
      let content = page.content || "";
      content = content.replace(/<[^>]+>/g, "");
      content = content.replace(/\s+/g, " ").trim();
      item.content = content.substring(0, excerptLength * 3);
      item.excerpt = content.substring(0, excerptLength);
    }

    data.push(item);
  });

  return {
    path: "search.json",
    data: JSON.stringify(data),
  };
});
