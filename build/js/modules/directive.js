/** lwj-v MIT License By  */
 ;!(function(win, lwjui) {

	lwjui.directive('ui-layer', function() {
			return {
				template: "<div ui-attr selecteda='---ui-attr内嵌组件---'>我是第一个组件：</div>",
				uses: ["box","http://webimg.liweijia.com/liweijia/pc/mainsite/home.js","ui/validate/jquery.validate.js","ui/validate/validate_custom.js"],
				addcss:["lwj","http://webimg.liweijia.com/liweijia/pc/mainsite/home.css"],
				scope: {
					string: 'selecteda',
					object: '=list',
				},
				link: function(el) {
					var scope = el.scope;
					var tpl = $(el.template).append("（我是属性值：" + scope.string + ")");
					el.element.append(tpl);
				}
			};
		})

		.directive('ui-attr', function() {
			return {
				template: "<div>我是第二个组件：</div>",
				uses: ["validate","ui/validate/jquery.validate.js","ui/validate/validate_custom.js"],
				scope: {
					string: 'selecteda',
					object: '=list',
				},
				link: function(el) {
					var scope = el.scope;
					var tpl = $(el.template).append("（我是属性值：" + scope.string + ")");
					el.element.append(tpl);
				}
			};
		});

})(window, lwjui);