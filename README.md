# hexo-theme-hydrogen

## 1 | 概述

重写进度: 
 - 主页(100/100)
 - 关于(100/100)
 - 文章(100/100)
 - 分类(100/100)
 - 标签(100/100)
 - 归档(100/0)
 - 搜索(100/70)

前由 `hexo-theme-starter` 改进，后删除全部代码改用 stylus + pug 重写的轻量博客主题。

## 2 | 依赖

以下是hydrogen主题所需要的依赖

- `hexo-renderer-markdown-it` 或者 `hexo-renderer-marked`
- `hexo-renderer-pug`
- `hexo-renderer-stylus`
- `hexo-generator-index`
- `hexo-generator-tag`
- `hexo-generator-category`
- `hexo-generator-json-content`

## 3 | 安装

通过git克隆下载主题文件
```bash
git clone https://github.com/CoderFrish/hexo-theme-hydrogen.git themes/hydrogen
```

通过npm下载主题文件
```bash
npm(pnpm/yarn) install hexo-theme-hydrogen
```

设置网页当前主题

```diff
- theme: 原来的主题
+ theme: hydrogen
```

## 4 | 如何使用

### 1 - 如何创建关于页

创建个index.md 在 `source/about` 文件夹里面，如果可以的话可以直接在 `source` 文件夹里面创建 about.md

以下是关于页的基本格式

```markdown
---
layout: about
---

#{你的markdown内容}
```

### 2 - 关于如何使用数学表达式

如果你安装的是 `hexo-renderer-marked` 渲染器，那么请卸载掉它，并且安装 `hexo-renderer-markdown-it` 渲染器

安装指令

```bash
npm(yarn/pnpm) uninstall hexo-renderer-marked

npm(yarn/pnpm) install hexo-renderer-markdown-it
```

于此同时，安装katex支持数学公式的相关依赖

```bash
npm(yarn/pnpm) install katex @renbaoshuo/markdown-it-katex
```

在根目录的 `_config.yml` 配置文件中添加下行

```diff
+ markdown:
+   plugins:
+     - name: '@renbaoshuo/markdown-it-katex'
```
