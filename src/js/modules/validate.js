!(function(win,lwjui){
	'use strict';
	lwjui.validate = (function($validate){
		//组件初始化
		$validate.validateInit=function($this,p){
			p= $.extend(p);
			$($this).validate({
				errorElement: p.errorElement||"label",
				errorClass: p.errorClass||"validate_error",
				//未通过验证时样式
				highlight:function(el){
					$(el).addClass(p.errorClass||"validate_error")
				},
				success:function(el){
					$(el).removeClass(p.errorClass||"validate_error")
				},
				//验证通过时运行的函数，提交表单
				submitHandler:function(form){
					//如果存在onsubmit则通过ajax方式提交，在业务代码里自定义ajax方法
					if($($this).attr("onsubmit")){
						return false;
					}
					form.submit();
				}
			});
		};


		$validate.init=function(config,el){
			//自动注册validate验证
			$validate.validateInit(el, config);

			//暴露validate 所有扩展回调方法
			return this.validateInit;
		};

		return $validate;
	})({});
})(window,lwjui);


lwjui.directive('ui-validate',function(){
	return {
		uses:["plugin/validate/jquery.validate.js","plugin/validate/messages_zh.js","plugin/validate/validate_custom.js"],
		addcss:["plugin/validate/formValidate.css"],
		scope:{
			errorClass:'errorClass',
			errorElement:'errorElement'
		},
		link:function(el){
			var config=el.scope,service=el.fn.validate;
			service.init(config,el.element);
		}
	}
});

