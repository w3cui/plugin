/**
 * Created by wangzd on 2016/10/31.
 */
$(function(){
    //验证邮箱
    jQuery.validator.addMethod("email", function(value, element) {
        return this.optional(element) || /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/.test(value);
    }, "请输入有效的邮箱");

    //验证银行卡号
    jQuery.validator.addMethod("creditcard",function(value,element){
        return this.optional(element) || /^(\d{16}|\d{19})$/.test(value);
    },"请输入正确的银行卡号");

    //验证网址(URL)
    jQuery.validator.addMethod("url",function(value,element){
        var strRegex = /^((https?|ftp|news):\/\/)?([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/
        var re=new RegExp(strRegex);
        return this.optional(element) || re.test(value);
    },"请输入正确的网址");

    // 判断整数value是否等于0
    jQuery.validator.addMethod("isIntZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value==0;
    }, "整数必须为0");

    // 判断整数value是否大于0
    jQuery.validator.addMethod("isIntGtZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value>0;
    }, "整数必须大于0");

    // 判断整数value是否大于或等于0
    jQuery.validator.addMethod("isIntGteZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value>=0;
    }, "整数必须大于或等于0");

    // 判断整数value是否不等于0
    jQuery.validator.addMethod("isIntNEqZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value!=0;
    }, "整数必须不等于0");

    // 判断整数value是否小于0
    jQuery.validator.addMethod("isIntLtZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value<0;
    }, "整数必须小于0");

    // 判断整数value是否小于或等于0
    jQuery.validator.addMethod("isIntLteZero", function(value, element) {
        value=parseInt(value);
        return this.optional(element) || value<=0;
    }, "整数必须小于或等于0");

    // 判断浮点数value是否等于0
    jQuery.validator.addMethod("isFloatEqZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value==0;
    }, "数字必须为0");

    // 判断浮点数value是否大于0
    jQuery.validator.addMethod("isFloatGtZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value>0;
    }, "请填写大于0的数字");

    // 判断浮点数value是否大于或等于0
    jQuery.validator.addMethod("isFloatGteZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value>=0;
    }, "请填写大于或等于0的数字");

    // 判断浮点数value是否不等于0
    jQuery.validator.addMethod("isFloatNEqZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value!=0;
    }, "浮点数必须不等于0");

    // 判断浮点数value是否小于0
    jQuery.validator.addMethod("isFloatLtZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value<0;
    }, "浮点数必须小于0");

    // 判断浮点数value是否小于或等于0
    jQuery.validator.addMethod("isFloatLteZero", function(value, element) {
        value=parseFloat(value);
        return this.optional(element) || value<=0;
    }, "浮点数必须小于或等于0");

    // 判断浮点型
    jQuery.validator.addMethod("isFloat", function(value, element) {
        return this.optional(element) || /^[-\+]?\d+(\.\d+)?$/.test(value);
    }, "只能包含数字、小数点等字符");

    // 匹配integer
    jQuery.validator.addMethod("isInteger", function(value, element) {
        return this.optional(element) || (/^[-\+]?\d+$/.test(value) && parseInt(value)>=0);
    }, "匹配integer");

    // 判断数值类型，包括整数和浮点数
    jQuery.validator.addMethod("isNumber", function(value, element) {
        return this.optional(element) || /^[-\+]?\d+$/.test(value) || /^[-\+]?\d+(\.\d+)?$/.test(value);
    }, "匹配数值类型，包括整数和浮点数");

    // 只能输入[0-9]数字
    jQuery.validator.addMethod("isDigits", function(value, element) {
        return this.optional(element) || /^\d+$/.test(value);
    }, "只能输入0-9数字");

    // 判断中文字符
    jQuery.validator.addMethod("isChinese", function(value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "只能包含中文字符。");

    // 判断英文字符
    jQuery.validator.addMethod("isEnglish", function(value, element) {
        return this.optional(element) || /^[A-Za-z]+$/.test(value);
    }, "只能包含英文字符。");

    // 手机号码验证
    jQuery.validator.addMethod("isMobile", function(value, element) {
        return this.optional(element) || /^1(3|4|5|7|8)\d{9}$/.test(value);
    }, "请正确填写您的手机号码。");



    // 电话号码验证
    jQuery.validator.addMethod("isPhone", function(value, element) {
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || (tel.test(value));
    }, "请正确填写您的电话号码。");

    // 联系电话(手机/电话皆可)验证
    jQuery.validator.addMethod("isTel", function(value,element) {
        var length = value.length;
        var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
        return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));
    }, "请正确填写您的联系方式");

    // 匹配qq
    jQuery.validator.addMethod("isQq", function(value, element) {
        return this.optional(element) || /^[1-9]\d{4,12}$/.test(value);
    }, "请输入正确的QQ号");

    // 邮政编码验证
    jQuery.validator.addMethod("isZipCode", function(value, element) {
        var zip = /^[0-9]{6}$/;
        return this.optional(element) || (zip.test(value));
    }, "请正确填写您的邮政编码。");

    // 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。
    jQuery.validator.addMethod("isPwd", function(value, element) {
        return this.optional(element) || /^[a-zA-Z]\w{5,11}$/.test(value);
    }, "以字母开头，长度在6-12之间，只能包含字符、数字和下划线。");

    // 身份证号码验证
    jQuery.validator.addMethod("idCard", function(value, element) {
        return this.optional(element) || isIdCardNo(value);
    }, "请输入正确的身份证号码。");

    // IP地址验证
    jQuery.validator.addMethod("ip", function(value, element) {
        return this.optional(element) || /((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))/.test(value);
    }, "请填写正确的IP地址。");

    // 字符验证，只能包含中文、英文、数字、下划线等字符。
    jQuery.validator.addMethod("stringCheck", function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_]+$/.test(value);
    }, "只能包含中文、英文、数字、下划线等字符");


    // 匹配中文(包括汉字和字符)
    jQuery.validator.addMethod("isChineseChar", function(value, element) {
        return this.optional(element) || /^[\u0391-\uFFE5]+$/.test(value);
    }, "匹配中文(包括汉字和字符) ");

    // 判断是否为合法字符(a-zA-Z0-9-_)
    jQuery.validator.addMethod("isRightfulString", function(value, element) {
        return this.optional(element) || /^[A-Za-z0-9_-]+$/.test(value);
    }, "请输入合法字符(字母、数字或下划线)");

    // 判断是否包含中英文特殊字符，除英文"-_"字符外
    jQuery.validator.addMethod("isContainsSpecialChar", function(value, element) {
        var reg = RegExp(/[(\ )(\`)(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)()()(\+)(\=)(\|)(\{)(\})(\')(\:)(\;)(\')(',)()()(\.)(\<)(\>)(\/)(\?)(\~)(\！)(\@)(\#)(\￥)(\%)(\…)(\&)(\*)(\（)(\）)(\—)(\+)(\|)(\{)(\})(\【)(\】)(\‘)(\；)(\：)(\”)(\“)(\’)(\。)(\，)(\、)(\？)]+/);
        return this.optional(element) || !reg.test(value);
    }, "含有中英文特殊字符");


    //身份证号码的验证规则
    function isIdCardNo(num){
        var len = num.length, re;
        if (len == 15)
            re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
        else if (len == 18)
            re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
        else {
            return false;
        }
        var a = num.match(re);
        if (a != null)
        {
            if (len==15)
            {
                var D = new Date("19"+a[3]+"/"+a[4]+"/"+a[5]);
                var B = D.getYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
            }
            else
            {
                var D = new Date(a[3]+"/"+a[4]+"/"+a[5]);
                var B = D.getFullYear()==a[3]&&(D.getMonth()+1)==a[4]&&D.getDate()==a[5];
            }
            if (!B) {
                return false;
            }
        }
        if(!re.test(num)){
            return false;
        }
        return true;
    }

});