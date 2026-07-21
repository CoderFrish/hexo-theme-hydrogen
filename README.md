# hexo-theme-hydrogen

## 1 | 概述
Frish正在重写中...

重写进度: 
 - 主页(100/100)
 - 关于(100/80)
 - 文章(100/80)
 - 分类(100/0)
 - 标签(100/100)
 - 归档(100/50)
 - 搜索(100/70)

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
