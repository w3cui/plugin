!(function() {
	"use strict";
	var app = lwjui.nginit;

	app.controller('umeditorController', ['$scope', function($scope) {
		$scope.init = function(element, attr, ngModel) {
			//获取当前的DOM元素
			var _dom = element[0];
			var config = angular.fromJson($scope.config);
			var _id = '_' + Math.floor(Math.random() * 100).toString() + new Date().getTime().toString();

			var _placeholder = '<p style="font-size:14px;color:#ccc;">' +
				attr.placeholder +
				'</p>';

			var _config = UMEDITOR_CONFIG = {
				//图片上传配置区
				UMEDITOR_HOME_URL: lwjui.cache.dir + "plugin/UMEditor/",
				imageUrl: config.imageUrl ? config.imageUrl : "/api/attachment/webupload?field=imgFile", //图片上传提交地址
				imageFieldName: config.imageFieldName ? config.imageFieldName : "imgFile", //图片数据的key,若此处修改，需要在后台对应文件修改对应参数
				//这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
				toolbar: config.toolbar ? config.toolbar : [
					'source | undo redo | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat |',
					'insertorderedlist insertunorderedlist | selectall cleardoc paragraph | fontfamily fontsize',
					'| justifyleft justifycenter justifyright justifyjustify |',
					'link unlink | emotion image video  | map',
					'| horizontal print preview fullscreen', 'drafts', 'formula'
				],
				//focus时自动清空初始化时的内容
				autoClearinitialContent: true,
				//关闭字数统计
				wordCount: false,
				//关闭elementPath
				elementPathEnabled: false,
				initialFrameWidth: "100%",
				initialFrameHeight: 400,
			};

			//为编辑器实例添加一个路径，这个不能被注释
			if (config.UMEDITOR_HOME_URL) {
				_config.UMEDITOR_HOME_URL = config.UMEDITOR_HOME_URL;
			}

			//图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
			if (config.imagePath) {
				_config.imagePath = config.imagePath ? config.imagePath : (config.UMEDITOR_HOME_URL || UMEDITOR_CONFIG.UMEDITOR_HOME_URL) + "php/";
			}

			_dom.setAttribute('id', _id);

			var _umeditor = UM.getEditor(_id, _config);

			/**
			 * 对于umeditor添加内容改变事件，内容改变触发ngModel改变.
			 */
			var editorToModel = function() {
				if (_umeditor.hasContents() && _placeholder != _umeditor.getContent())
					ngModel.$setViewValue(_umeditor.getContent());
				else
					ngModel.$setViewValue(undefined);
			};

			/**
			 * umeditor准备就绪后，执行逻辑
			 * 如果ngModel存在
			 *   则给在编辑器中赋值
			 *   给编辑器添加内容改变的监听事件.
			 * 如果不存在
			 *   则写入提示文案
			 */

			_umeditor.ready(function() {
				var set = setInterval(function() {
					if (ngModel.$viewValue != null) {
						if (ngModel.$viewValue != "") {
							_umeditor.setContent(ngModel.$viewValue);
							_umeditor.addListener('contentChange', editorToModel);
							clearInterval(set);
						} else {
							_umeditor.setContent(_placeholder);
						}
					}
				}, 300);
			});

			/**
			 * 添加编辑器被选中事件
			 * 如果ngModel没有赋值
			 *   清空content
			 *   给编辑器添加内容改变的监听事件
			 */
			_umeditor.addListener('focus', function() {
				if (!ngModel.$viewValue) {
					_umeditor.setContent('');
					_umeditor.addListener('contentChange', editorToModel);
				}
			});

			/**
			 * 添加编辑器取消选中事件
			 * 如content值为空
			 *   取消内容改变的监听事件
			 *   添加content为提示文案
			 */
			_umeditor.addListener('blur', function() {
				if (!_umeditor.hasContents()) {
					_umeditor.removeListener('contentChange', editorToModel);
					_umeditor.setContent(_placeholder);
				} else {}
			})
		}
	}])

	// 富文本编辑框
	.directive('uiUmeditor', function() {
		return {
			restrict: 'AE',
			scope: {
				config: '@umeditorconfig'
			},
			controller: "umeditorController",
			require: 'ngModel',
			transclude: true,
			link: function(scope, element, attr, ngModel) {
				lwjui.loadAll({
					uses: ["plugin/UMEditor/umeditor.js", "plugin/UMEditor/umeditor.config.js", "plugin/UMEditor/lang/zh-cn/zh-cn.js"],
					addcss: ['plugin/UMEditor/themes/default/css/umeditor.css']
				}, function() {
					scope.init(element, attr, ngModel);
				});
			}
		}
	})

	.directive('uiList', function() {
			return {
				restrict: 'E',
				scope: {
					data: '=result'
				},
				transclude: true,
				link: function(scope, element, attr) {
					
						var create = {
						dl : function(tpl){
							return '<dl>'+tpl+'</dl>';
						},
						dt : function(tpl){
							return '<dt>'+tpl+'</dt>';
						},
						dd: function(data){
							if(this.isData(data.children)){
								this.init(data.children);
							}
							if(this.isData(data.skills)){
								this.init(data.skills);
							}
							return '<dd>'+data.name+'</dd>';
						},
						isData:function(data){
							console.log(data);
							return data.length == 0 ? false : true;
						},
						init:function(data){
							for(var key in data){
								this.list(data[key]);
							}
						},
						list:function(data){
							var dd =""
							if(this.isData(data.children)){
								dd += this.dd(data.children);
							}
							if(this.isData(data.skills)){
								dd += this.dd(data.skills);
							}
							var dt = this.dt(data.name); 
							$(element).html(this.dl(dt+dd));
						}
					};
					create.init(scope.data);
				}
			}
		});

})();