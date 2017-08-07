
/**
 * Created by jianyu on 2017/5/25.
 */
!(function(win,lwjui){
    "use strict";
    return lwjui.changeNUM={
        init:function(el,params){
            //获取当前元素
            var _this=el[0];
            this.loadHTML(_this,params);
            this.blur(_this,params);
        },
        //动态加载HTML
        loadHTML:function(thisEl,params){
            var html=[];
            //验证初始化的值，不能为undefined,null,空，但可以为0
            if(params.defaultNum!="undefined"&&params.defaultNum!=null&&params.defaultNum!=""||params.defaultNum==0
                &&params.min!="undefined"&&params.min!=null&&params.min!=""||params.min==0
                &&params.max!="undefined"&&params.max!=null&&params.max!=""||params.max==0){
                //当最小值小于或等于最大值时加载HTML
                if(params.min<=params.max){
                    //当默认值小于或等于最小值，最小值等于最大值时添加的HTML
                    if(params.defaultNum<=params.min){
                        html.push('<span class="change_click_el change_reduce_click disable_change">-</span>');
                    }else if(params.min==params.max){
                        html.push('<span class="change_click_el change_reduce_click disable_change">-</span>');
                        html.push('<input type="text" class="change_click_num" value="'+params.min+'"/>');
                    }else{
                        html.push('<span class="change_click_el change_reduce_click">-</span>');
                    }

                    //以默认值来判断输入框的显示情况
                    if(params.min<params.defaultNum&&params.defaultNum<params.max){
                        html.push('<input type="text" class="change_click_num" value="'+params.defaultNum+'"/>');
                    }else if(params.defaultNum<=params.min){
                        html.push('<input type="text" class="change_click_num" value="'+params.min+'"/>');
                    }else if(params.defaultNum>=params.max){
                        html.push('<input type="text" class="change_click_num" value="'+params.max+'"/>');
                    }else if(params.min==params.defaultNum&&params.defaultNum==params.max){
                        html.push('<input type="text" class="change_click_num" value="'+params.defaultNum+'"/>');
                    }

                    //当默认值大于或等于最大值，最小值等于最大值时添加的HTML
                    if(params.defaultNum>=params.max){
                        html.push('<span class="change_click_el change_add_Click disable_change">+</span>');
                    }else if(params.min==params.max){
                        html.push('<span class="change_click_el change_add_Click disable_change">+</span>');
                    }else{
                        html.push('<span class="change_click_el change_add_Click">+</span>');
                    }

                }

            }

            $(thisEl).html(html.join(''));

            //HTML加载完之后绑定加减事件
            this.addNum(thisEl,params);
            this.reduceNum(thisEl,params);
        },
        /**
         * 验证输入的值是否符合规则，只能为正数（不包含小数）
         * @param thisEl
         */
        blur:function(thisEl,params){
            var that=this;
            var inputEl=$(thisEl).find("input");
            inputEl.blur(function(){
                var inputVal=inputEl.val();
                //验证输入是否合法
                if(inputEl.val().length>0){
                    var reg=/^(0|([1-9]\d*))$/.test(inputEl.val());
                    if(!reg){
                        inputEl.val("").focus();
                    }
                }
                //验证输入范围，如果小于最小值，则自动填充为最小值，大于最大值则填充为最大值
                if(inputVal>=params.max){
                    inputEl.val(params.max);
                    that.changeStatus(thisEl,"up")
                }else if(inputVal<=params.min){
                    inputEl.val(params.min);
                    that.changeStatus(thisEl,"down")
                }else{
                    that.changeStatus(thisEl,"middle")
                }
            })
        },
        /**
         *
         * @param thisEl 获取的容器元素
         * @param isAdd  按钮样式修改
         */
        changeStatus:function(thisEl,isAdd){
            switch (isAdd){
                case "up":
                    $(thisEl).find(".change_add_Click").addClass("disable_change")
                        .parent().find(".change_reduce_click").removeClass("disable_change");
                    break;
                case "down":
                    $(thisEl).find(".change_reduce_click").addClass("disable_change")
                        .parent().find(".change_add_Click").removeClass("disable_change");
                    break;
                default :
                    $(thisEl).find(".change_reduce_click").removeClass("disable_change")
                        .parent().find(".change_add_Click").removeClass("disable_change");
                    break;
            }

        },
        /**
         *  点击增加数量
         * @param thisEl 获取的容器元素
         * @param params 传入的参数
         */
        addNum:function(thisEl,params){
            $(thisEl).find(".change_add_Click").off("click").click(function(){
                if($(this).hasClass("disable_change")){
                    return false;
                }
                var num=parseInt($(thisEl).find("input").val());
                if(num>=params.max-1){
                    $(thisEl).find("input").val(params.max);
                    $(this).addClass("disable_change");
                    return false;
                }
                num++;
                $(this).parent().find(".change_reduce_click").removeClass("disable_change");
                $(thisEl).find("input").val(num);
            })
        },
        /**
         *  点击减少数量
         * @param thisEl 获取的容器元素
         * @param params 传入的参数
         */
        reduceNum:function(thisEl,params){
            $(thisEl).find(".change_reduce_click").off("click").click(function(){
                if($(this).hasClass("disable_change")){
                    return false;
                }
                var num=parseInt($(thisEl).find("input").val());
                if(num<=params.min+1){
                    $(thisEl).find("input").val(params.min);
                    $(this).addClass("disable_change");
                    return;
                }
                num--;
                $(this).parent().find(".change_add_Click").removeClass("disable_change");
                $(thisEl).find("input").val(num);
            })
        },
        /**
         * 解除加减事件绑定
         * @param thisEl 获取的容器元素
         */
        removeBind:function(thisEl){
            $(thisEl).find(".change_add_Click").off("click");
            $(thisEl).find(".change_reduce_click").off("click");
        }
    };

})(window,lwjui);


lwjui.directive('ui-number',function(){
    return {
        scope:{
            min:'min',              //可输入的最小值
            max:'max',              //可输入的最大值
            defaultNum:'default',   //默认值
            fn:'~callback'          //传入的方法,验证请求是否通过，通过则可以进行加减数量，此函数为非必填
        },
        link:function(el){
            var config=el.scope,service=el.fn.changeNUM,thisEl=el.element;
            //初始化
            service.init(thisEl,config);

            /**
             * 与页面函数交互的方法
             * @param data 页面出入的参数(布尔值)，
             * @returns {boolean}
             */
            function changeISPassed(data){
                if(!data){
                    //解除加减事件绑定
                    service.removeBind(thisEl);
                }
            }

            /**
             * 如果元素上有函数绑定，则在元素函数内部进行判断再加载事件
             */
            if(config.fn){
                config.fn(changeISPassed);
            }
        }
    }
});