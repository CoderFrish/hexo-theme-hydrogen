# hexo-theme-hydrogen

基于`hexo-theme-starter`主题制作，其中文译名为`氢博客`，致力于制作轻量、简介的博客。

## 1 | 如何下载

### 1.1 | 初始化Hexo（可选）

如果你已经有成型的hexo框架的话可以不需要初始化

```bash
hexo init
```

### 1.2 | 下载主题

```
git clone https://github.com/CoderFrish/hexo-theme-hydrogen.git themes/hydrogen
```

### 1.3 | 设置主题

在文件`_config.yml`下，找到`theme`项，将其修改成以下：

```diff
theme: hydrogen
```

### 1.4 | 更多方法

可以用npm来安装

```bash
npm install hexo-theme-hydrogen
```

剩下同理

## 2 | 使用数学公式

hexo默认的hexo-renderer-mark是不支持数学公式的，所以我们需要修改package.json

```diff
"dependencies": {
-  "hexo-renderer-marked": "^7.0.0",
+  "hexo-renderer-markdown-it": "^7.1.1",
+  "katex": "^0.16.27",
+  "@renbaoshuo/markdown-it-katex": "^2.0.2"
}
```

同时添加以下

```yaml
markdown:
  plugins:
    - name: '@renbaoshuo/markdown-it-katex'
      options:
        skipDelimitersCheck: true
```
