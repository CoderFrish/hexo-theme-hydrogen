# hexo-theme-hydrogen

## 1 | 概述
Frish正在重写中...

重写进度: 
 - 主页(100/100)
 - 关于(100/100)
 - 文章(100/100)
 - 分类(100/0)
 - 标签(100/100)
 - 归档(100/50)
 - 搜索(100/70)

已知尚未解决的问题 (现在只能解决一些问题了，重写这玩意代价太大了，每天从早上7点写到晚上9点)
 - 分类页无入口 (大概在2.2.0版本更新)
 - 链接过长无回车 (在2.2.0更新)

前由 `hexo-theme-starter` 改进，后删除全部代码改用 stylus + pug 重写的轻量博客主题。

## 2 | 依赖

以下是hydrogen主题所需要的依赖

- `hexo-renderer-markdown-it` 或者 `hexo-renderer-marked`
- `hexo-renderer-pug`
- `hexo-renderer-stylus`
- `hexo-generator-index`
- `hexo-generator-tag`

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

如何创建关于页

创建个index.md 在 `source/about` 文件夹里面，如果可以的话可以直接在 `source` 文件夹里面创建 about.md

以下是关于页的基本格式

```markdown
---
layout: about
---

#{你的markdown内容}
```
