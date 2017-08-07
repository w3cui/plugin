!(function(win, lwjui) {
	"use strict";
	/**
	 * 弹窗插件依赖注入
	 */
	win.layer = {}
	win.layer.host = lwjui.cache.dir+"plugin/layer/";
	lwjui.loadAll({
		uses: ["plugin/layer/layer.js"]
	}, function() {
		lwjui.layer = layer;
	});
	

})(window, lwjui);