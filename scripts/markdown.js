"use strict";

/**
 * 自动让about和文章页面使用数学公式
 */
hexo.extend.filter.register('before_post_render', function(data){
    // 添加前缀或后缀
    if (data.layout === "post" || data.layout === "about") {
        data.math = true
    }

    return data;
});
