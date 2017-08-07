! function(window, undefined) {
  "use strict";
  //内置方法。
  var $ser = {
    // 判断依赖是否注入
    isPlugin: function() {
      return $ ? layer ? true : this.error("layer") : this.error("jquery");
    },
    // 设置默认配置
    host: {
      userLogin: "/security/lv_check", //密码登录
      mobileLogin: "/services/mCaptcha/getLogin", //手机验证码登录
      islogin: "/services/user/isLogin",
      captcha: function() {
        return "/security/captcha?t=" + Math.random();
      },
    },
    getCookie: function(name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
      else
        return null;
    },
    //载入CSS配件
    link: function(href, fn, cssname) {

      //未设置路径，则不主动加载css
      if (!login.path) return;

      var head = $('head')[0],
        link = document.createElement('link');
      if (typeof fn === 'string') cssname = fn;
      var app = (cssname || href).replace(/\.|\//g, '');
      var id = 'layuicss-' + app,
        timeout = 0;

      link.rel = 'stylesheet';
      link.href = login.path + href;
      link.id = id;

      if (!$('#' + id)[0]) {
        head.appendChild(link);
      }

      if (typeof fn !== 'function') return;

      //轮询css是否加载完毕
      (function poll() {
        if (++timeout > 8 * 1000 / 100) {
          return window.console && console.error('login.css: Invalid');
        };
        parseInt($('#' + id).css('width')) === 1989 ? fn() : setTimeout(poll, 100);
      }());
    },
    // ajax封装
    ajax: function(obj, callback, error) {
      error = error ? error : function() {};
      var $this = this;
      obj.url = obj.url + "?t=" + Math.random();
      obj.type = obj.type ? obj.type : "post";
      obj.dataType = obj.dataType ? obj.dataType : "json";
      obj.headers = {
          "LX-REQUEST-LOGIN-MODE": "ajax"
        },
        obj.data = obj.data ? obj.data : {};
      obj.error = obj.error ? obj.error : function(data) {
        layer.closeAll('loading');
        $this.messages(data, function() {
          error(data);
        });
      };
      obj.success = function(data) {
        layer.closeAll('loading');
        callback(data);
        
      };
      $.ajax(obj);
    },
    // 服务器回调封装
    messages: function($data, callback) {
      var text = "";
      if (typeof $data.status != "undefined") {
        switch ($data.status) {
          case 0:
            layer.msg("\u60a8\u6ca1\u6709\u6743\u9650\u8bbf\u95ee\u63a5\u53e3\uff01");
            break;
          case 404:
            layer.msg("\u0034\u0030\u0034\u9875\u9762\u5730\u5740\u9519\u8bef\uff01");
            break;
          case 500:
            if ($data.responseText[0] == "<") {
              layer.open({
                title: '\u60a8\u63a5\u53e3\u53c8\u62a5\u9519\u4e86\uff01',
                shadeClose: true,
                shade: 0.8,
                area: ['90%', '90%'],
                content: $data.responseText //iframe的url
              });
            } else {
              layer.msg(messages(eval("(" + $data.responseText + ")")));
            }
            break;
          case 405:
            if ($data.responseText[0] == "<") {
              layer.open({
                title: '\u60a8\u63a5\u53e3\u53c8\u62a5\u9519\u4e86\uff01',
                shadeClose: true,
                shade: 0.8,
                area: ['90%', '90%'],
                content: $data.responseText //iframe的url
              });
            } else if ($data.responseText != "") {
              layer.msg(messages(eval("(" + $data.responseText + ")")));
            } else {
              layer.msg($data.responseText);
            }

            break;
          case 422:
          case 422:
            layer.msg(messages(eval("(" + $data.responseText + ")")));
            break;
          case 401:
            window.location.href = "/login?returnUrl=" + window.location.href;
            break;
          case 200:
            callback();
            break;
          case undefined:
            messages($data);
            break;
          default:
            messages(eval("(" + $data.responseText + ")") || {});
        }
        return false;
      }
      messages($data);

      function messages(_$data) {
        if (_$data.code > 0) {
          $.each(_$data.messages, function(index, val) {
            text = text + val.$srvmessage + " ";
          });
          setTimeout(function() {
            var messagesindex = layer.msg(text);
            $(".layui-layer-msg").unbind('click').click(function() {
              layer.close(messagesindex);
            });
          }, 200);
          return false;
        } else {
          callback();
        }
      }

    },
    // 获取插件路径
    ready: function() {
      return $("script").last().attr("src").match(/(http|https):\/\/([^\/]+)\//)[0];
    },
    // 判断lwjui是否注入目录注入优先使用框架目录
    dir: function() {
      return window.lwjui ? window.lwjui.dir || false : false;
    },
    // 异常提示
    error: function(type) {
      console.log(type + "is not defined");
      return false;
    }
  };
  // 对外暴露结构
  var login = function() {
    this.debug = true,
      this.index = (window.login && window.login.v) ? 100000 : 0,
      this.path = $ser.dir() ? $ser.dir() || $ser.ready : $ser.ready,
      this.config = function($data) {
        return $data ? $.extend(serivce.host, $data) : $data;
      },
      this.isfomrm = function(_dom, fn) {
        var username = _dom.find("input[name='lv_username']"),
          password = _dom.find("input[name='lv_password']"),
          imgCaptchaCode = _dom.find("input[name='imgCaptchaCode']"),
          isname = /^0?1[3|4|5|8|7][0-9]\d{8}$|^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        if ((username.val() == "" || !isname.test(username.val())) && username.length != 0) {
          layer.tips("请输入正确的账号！", username, {
            tips: [3, '#000']
          });
          return false;
        }
        if ((imgCaptchaCode.val() == "") && imgCaptchaCode.length != 0) {
          layer.tips("请输入手机验证码！", imgCaptchaCode, {
            tips: [3, '#000']
          });
          return false;
        }
        if ((password.val() == "") && password.length != 0) {
          layer.tips("请输入密码！", password, {
            tips: [3, '#000']
          });
          return false;
        }
        return _dom.serialize();
      },
      // 判断是否登录并设置tocken
      this.islogin = function(callback,callbacktow) {
        var _$this = this;
        $ser.ajax({
          url: $ser.host.islogin,
          method: "GET",
          dataType: "json",
        }, function(data) {
          if (!data.result.id) {
            $.ajaxSetup({
              async: false,
              beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("LX-WXSRF-JTOKEN", $ser.getCookie('LX-WXSRF-JTOKEN'));
              }
            });
            callback();
          } else {
            layer.msg('您已登录!');
            callbacktow(data,_$this) || function() {};
          }
        });
      },
      // 发送验证码
      this.ismobile = function(_dom, callback, url) {
        var _$this = this;
        var username = _dom.find("input[name='lv_username']"),
          isname = /^0?1[3|4|5|8|7][0-9]\d{8}$|^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
        if ((username.val() == "" || !isname.test(username.val())) && username.length != 0) {
          layer.tips("请输入正确的账号！", username, {
            tips: [3, '#000']
          });
          return false;
        }

        layer.load();
        _$this.code(_dom, function(imgCaptchaCode) {
          url = $ser.host.mobileLogin + "/" + username.val() + '/' + imgCaptchaCode + '/' + $ser.getCookie("LX-WXSRF-JTOKEN");
          $ser.ajax({
            url: url,
            method: "GET",
            dataType: "json",
          }, function() {
            layer.close();
            callback();
          });

        }, url);

      },
      // 解决刷短信校验
      this.code = function(_dom, callback, url) {
        var $this = this;
        var tpl = '<input type="text" name="imgCaptchaCode" placeholder="请输入图形验证码" style="text-indent: .5em;width:200px;height:35px;float: left;line-height:35px; border:solid 1px #eee; color:#555;" />' +
          '<img style="height:33px; border:solid 1px #eee;cursor: pointer;" src="' + $ser.host.captcha() + '" />'
        layer.confirm(tpl, {
          title: "请输入验证码",
          skin: "loginCode",
          btn: ['提交', '取消'], //按钮
          success: function() {
            $(".loginCode img").unbind('click').on("click", function() {
              $(this).attr("src", $ser.host.captcha());
            });
          }
        }, function() {
          if ($(".loginCode input[name='imgCaptchaCode']").val() == "") return false;

          callback($(".loginCode input[name='imgCaptchaCode']").val());

          //$this.ismobile(_dom, callback, url + "/" + $(".loginCode input[name='imgCaptchaCode']").val());
        }, function() {});
      };
    // 引用方式
    this.userLogin = function(_dom, callback) {
        _dom = $(_dom);
        var $this = this;
        var formData = this.isfomrm(_dom);
        //var returnUrl = _dom.attr("returnUrl");
        if (formData) {
          layer.load();
          this.islogin(function() {
            $ser.ajax({
              url: $ser.host.userLogin,
              method: "POST",
              dataType: "json",
              data: formData,
            }, function(data) {
              layer.msg("登录成功！");
              callback(data,$this) || function() {};
            });
          },callback);
        };
        return false;
      },
      this.init = function(_dom, callback, $data) {
        $data = $data || {};
        var $this = this;

        var set = setInterval(function() {
          if ($ser.isPlugin()) {
            formsubmit();
            clearInterval(set);
          }
        }, 200);

        function formsubmit() {
          $.ajaxSetup({
            async: false,
            beforeSend: function(xhr, settings) {
              xhr.setRequestHeader("LX-WXSRF-JTOKEN", $ser.getCookie('LX-WXSRF-JTOKEN'));
            }
          });
          $this.config($data.host);
          var sendout = $(_dom).find("*[data-sendout]");
          if (sendout.length != 0) {
            sendout.unbind('click').click(function(event) {
              var _$this = this;
              // 集成发短信校验
              var sm =60;
              $this.ismobile(_dom, function() {
                // 短的发送成功
                $(_$this).addClass('btn-default').removeClass('btn-primary');

                var setInt = setInterval(function() {
                  if (sm > 0) {
                    $(_$this).html(sm + "s后,重新获取").val(sm + "s后,重新获取");
                    sm--;
                  } else {
                    $(_$this).removeClass('btn-default').addClass('btn-primary');
                    $(_$this).html("获取手机动态密码").val("获取验证码");
                    clearInterval(setInt);
                  }
                }, 1000);

              });
            });
          }
          $(_dom).unbind('submit').submit(function() {
            $this.userLogin(this, callback);
            return false;
          });
        }
      }
  };
  window.login = new login();
}(window);