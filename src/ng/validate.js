!(function() {
    var app = lwjui.nginit;

    app.directive("uiValidate", function () {
        return {
            restrict: "AE",
            require: "ngModel",
            link: function (scope, element, attr, ngModel) {
                lwjui.loadAll({
                    uses: ["plugin/validate/jquery.validate.js", "plugin/validate/messages_zh.js", "plugin/validate/validate_custom.js"],
                    addcss: ['plugin/validate/formValidate.css']
                }, function () {
                    var config = scope.validateDate;
                    var regConfig =config ? config.errorClass : "validate_error";
                    element.validate({
                        errorElement: config ? config.errorElement : "label",
                        errorClass: regConfig,
                        //未通过验证时样式
                        highlight: function (el) {
                            $(el).addClass(regConfig)
                        },
                        success: function (el) {
                            $(el).removeClass(regConfig);
                        },
                        onfocusout: function (element) {
                            var valid=$(element).valid();
                            ngModel.$setViewValue(valid);
                        },
                        //验证通过时运行的函数
                        submitHandler: function () {
                            //通过验证时，为表单元素绑定的ng-model赋值(true或false)
                            ngModel.$setViewValue(element.valid());
                        }
                    });
                });
            }
        }
    });

})();

