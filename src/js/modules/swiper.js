!(function(win, lwjui) {
	"use strict";
	lwjui.swiper = (function($W) {
		$W.init = function(el, config, dir) {
			this.el = el;
			this.scope = config;
			this.scope.config =  this.scope.config ? this.scope.config : {
				pagination: '.swiper-pagination',
        paginationClickable: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
			};  
			this.dir = dir;
			return this.service();
		};
		$W.service = function() {
			return new Swiper(this.el,this.scope.config)
		}
		return $W;
	})({});

	/**
	 * 滑动滚动
	 * @complete => "初始完毕后回调"
	 * @config =>  "swiper选项配置" 
	 */
	lwjui.directive('ui-swiper', function() {
		return {
			uses: ["plugin/swiper/js/swiper.js"],
			addcss: ['plugin/swiper/swiper.css'],
			scope: {
				config: '=config',
				callback:'~complete'
			},
			link: function(el) {
				var scope = el.scope,
					service = el.fn.swiper;
				// 扩展回调方法
				var service = service.init(el.element, scope, el.fn.cache.dir + "plugin/swiper/");
				if(scope.callback){
					scope.callback(service)
				}				
			}
		};
	});

})(window, lwjui);