!(function(win, lwjui) {
	"use strict";
	lwjui.umeditor = (function($UME) {
		$UME.init = function(el, config, dir) {
			this.el = el;
			this.scope = config || {};
			this.dir = dir;
			return this.service();
		};
		$UME.service = function() {
			//获取当前的DOM元素
			var _dom = this.el;
			var config = this.scope.config || {};
			var placeholder = this.scope.placeholder;
			// 插件路径
			var UMEDITOR_URL = this.dir;

			var _id = '_' + Math.floor(Math.random() * 100).toString() + new Date().getTime().toString();

			var _placeholder = '<p style="font-size:14px;color:#ccc;">' +
				placeholder +
				'</p>';
			var _config = {
				//为编辑器实例添加一个路径，这个不能被注释
				UMEDITOR_HOME_URL: UMEDITOR_URL,
				//图片上传配置区
				imageUrl: config.imageUrl ? config.imageUrl : "/api/attachment/webupload?field=imgFile", //图片上传提交地址
				imagePath: config.imagePath ? config.imagePath : UMEDITOR_URL + "php/", //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
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

			win.UMEDITOR_CONFIG = _config;

			_dom.attr('id', _id);

			var _umeditor = UM.getEditor(_id, _config),
				um = true;

			/**
			 * 对于umeditor添加内容改变事件，内容改变触发ngModel改变.
			 */
			var editorToModel = function() {
				if (_umeditor.hasContents() && _placeholder != _umeditor.getContent())
				// ngModel.$setViewValue(_umeditor.getContent());
					_dom.val(_placeholder);
				else
					_dom.val(null);
				// ngModel.$setViewValue(undefined);
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
				_umeditor.setContent(_placeholder);
			});

			/**
			 * 添加编辑器被选中事件
			 * 如果ngModel没有赋值
			 *   清空content
			 *   给编辑器添加内容改变的监听事件
			 */
			_umeditor.addListener('focus', function() {
				if (!_dom.val()) {
					_umeditor.setContent(' ');
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

			return _umeditor;
		}

		return $UME;
	})({});

	/**
	 * 编辑器构建
	 * @placeholder => "提示"
	 * @config =>  "UMEditor选项配置" 
	 */
	lwjui.directive('ui-umeditor', function() {
		return {
			uses: ["plugin/UMEditor/umeditor.js", "plugin/UMEditor/umeditor.config.js", "plugin/UMEditor/lang/zh-cn/zh-cn.js"],
			addcss: ['plugin/UMEditor/themes/default/css/umeditor.css'],
			scope: {
				placeholder: 'placeholder',
				config: '=config',
			},
			link: function(el) {
				var scope = el.scope,
					service = el.fn.umeditor;
				// 这里暴露UMEditor 所有扩展回调方法
				console.log(service.init(el.element, scope, el.fn.cache.dir + "plugin/UMEditor/"));
				
			}
		};
	});

})(window, lwjui);