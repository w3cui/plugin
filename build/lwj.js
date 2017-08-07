/** lwj-v MIT License By  */
 ;! function(win) {
  "use strict";
  var lwjui = function() {
    this.v = '1.0.0';
  };

  lwjui.fn = lwjui.prototype;
  var doc = document,
    config = lwjui.fn.cache = {},

    //获取lwjui所在目录
    getPath = function() {
      var js = doc.scripts,
        jsPath = js[js.length - 1].src;
      return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }(),

    //异常提示
    error = function(msg) {
      win.console && console.error && console.error('lwjui hint: ' + msg);
    },

    isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',


    //内置模块
    modules = typeof modsConfig == "object" ? modsConfig.moduleUrl : {
      layer: 'modules/layer', //弹层

      jquery: 'modules/jquery', //DOM库（第三方）

      directive: 'modules/directive', //指令插件

      box: 'modules/box', //弹窗   

      validate: 'modules/validate', //表单验证   

      mobile: '' //移动大模块 | 若当前为开发目录，则为移动模块入口，否则为移动模块集合
    };

  config.modules = {}; //记录模块物理路径
  config.status = {}; //记录模块加载状态
  config.timeout = 30; //符合规范的模块请求最长等待秒数
  config.event = {}; //记录模块自定义事件
  config.directive = {}; //记录所有directive指令
  config.version = (new lwjui()).v =="" ?  (new Date()).getTime() : (new lwjui()).v;
  //定义模块
  lwjui.fn.define = function(deps, callback) {
    var that = this,
      type = typeof deps === 'function',
      mods = function() {
        typeof callback === 'function' && callback(function(app, exports) {
          lwjui[app] = exports;
          config.status[app] = true;
        });
        return this;
      };

    type && (
      callback = deps,
      deps = []
    );

    if (lwjui['lwjui.all'] || (!lwjui['lwjui.all'] && lwjui['lwjui.mobile'])) {
      return mods.call(that);
    }

    that.uses(deps, mods);
    return that;
  };

  /* 使用特定模块 */
  lwjui.fn.uses = function(apps, callback, exports) {
    var that = this,
      dir = config.dir = config.dir ? config.dir : getPath;
    var head = doc.getElementsByTagName('head')[0];

    apps = typeof apps === 'string' ? [apps] : apps;

    //如果页面已经存在jQuery1.7+库且所定义的模块依赖jQuery，则不加载内部jquery模块
    if (window.jQuery && jQuery.fn.on) {
      that.each(apps, function(index, item) {
        if (item === 'jquery') {
          apps.splice(index, 1);
        }
      });
      lwjui.jquery = jQuery;
    }

    var item = apps[0],
      timeout = 0;
    exports = exports || [];

    //静态资源host
    config.host = config.host || (dir.match(/\/\/([\s\S]+?)\//) || ['//' + location.host + '/'])[0];

    if (apps.length === 0 || (lwjui['lwjui.all'] && modules[item]) || (!lwjui['lwjui.all'] && lwjui['lwjui.mobile'] && modules[item])) {
      return onCallback(), that;
    }

    //加载完毕
    function onScriptLoad(e, url) {
      var readyRegExp = navigator.platform === 'PLaySTATION 3' ? /^complete$/ : /^(complete|loaded)$/
      if (e.type === 'load' || (readyRegExp.test((e.currentTarget || e.srcElement).readyState))) {
        config.modules[item] = url;
        head.removeChild(node);
        var addStatus = url.match(/\/([^\/]+)\.js/)[1];
        config.status[item] = addStatus;
        (function poll() {
          if (++timeout > config.timeout * 1000 / 4) {
            return error(item + ' is not a valid module');
          };
          config.status[item] ? onCallback() : setTimeout(poll, 4);
        }());
      }
    }

    //加载模块 str.substr(0, 4)
    var node = doc.createElement('script'),
      url = (
        modules[item] ? (dir + 'js/') : (config.base || '')
      ) + (that.modules[item] || (item.substr(0, 4)=="http" ? item :  dir + item) ) + ( item.match(/.*\.js.*/) ? "" : '.js' );
    node.async = true;
    node.charset = 'utf-8';
    node.src = url + function() {
      var version = config.version === true ? (config.v || (new Date()).getTime()) : (config.version || '');
      return version ? ('?v=' + version) : '';
    }();

    //首次加载
    if (!config.modules[item]) {
      head.appendChild(node);
      if (node.attachEvent && !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) && !isOpera) {
        node.attachEvent('onreadystatechange', function(e) {
          onScriptLoad(e, url);
        });
      } else {
        node.addEventListener('load', function(e) {
          onScriptLoad(e, url);
        }, false);
      }
    } else {
      (function poll() {
        if (++timeout > config.timeout * 1000 / 4) {
          return error(item + ' is not a valid module');
        };
        (typeof config.modules[item] === 'string' && config.status[item]) ? onCallback(): setTimeout(poll, 4);
      }());
    }

    config.modules[item] = url;

    //回调
    function onCallback() {
      exports.push(lwjui[item]);
      apps.length > 1 ?
        that.uses(apps.slice(1), callback, exports) : (typeof callback === 'function' && callback.apply(lwjui, exports));
    }

    return that;

  };

  //获取节点的style属性值
  lwjui.fn.getStyle = function(node, name) {
    var style = node.currentStyle ? node.currentStyle : win.getComputedStyle(node, null);
    return style[style.getPropertyValue ? 'getPropertyValue' : 'getAttribute'](name);
  };

  //css外部加载器
  lwjui.fn.link = function(href, fn, cssname) {
    var that = this,
      link = doc.createElement('link');
    var head = doc.getElementsByTagName('head')[0];
    if (typeof fn === 'string') cssname = fn;
    var app =  (href.match(/.*\.css.*/) ? href : config.dir + 'css/' + href + '.css');
    cssname = app.match(/\/([^\/\.]+)\.css/)[1];
    
    var id = link.id = 'lwj-ui-css-' + cssname,
      timeout = 0;
    if(doc.getElementById(id)) return that;
    link.rel = 'stylesheet';
    link.href = app + function() {
      var version = config.version === true ? (config.v || (new Date()).getTime()) : (config.version || '');
      return version ? ('?v=' + version) : '';
    }();
    link.media = 'all';

    if (!doc.getElementById(id)) {
      head.appendChild(link);
    }

    if (typeof fn !== 'function') return that;

    //轮询css是否加载完毕
    (function poll() {
      if (++timeout > config.timeout * 1000 / 100) {
        return error(href + ' timeout');
      };
      doc.getElementById(id) ? function() {
        fn();
      }() : setTimeout(poll, 100);
    }());

    return that;
  };

  //css内部加载器
  lwjui.fn.addcss = function(firename, fn, cssname) {
    firename = typeof firename =="object" ? firename : [firename];
    for(var key = 0; key < firename.length; key++ ){
      lwjui.fn.link(firename[key], fn, key);
    }
    
  };

  //图片预加载
  lwjui.fn.img = function(url, callback, error) {
    var img = new Image();
    img.src = url;
    if (img.complete) {
      return callback(img);
    }
    img.onload = function() {
      img.onload = null;
      callback(img);
    };
    img.onerror = function(e) {
      img.onerror = null;
      error(e);
    };
  };

  //全局配置
  lwjui.fn.config = function(options) {
    options = options || {};
    for (var key in options) {
      config[key] = options[key];
    }
    return this;
  };

  //记录全部模块
  lwjui.fn.modules = function() {
    var clone = {};
    for (var o in modules) {
      clone[o] = modules[o];
    }
    return clone;
  }();

  //拓展模块
  lwjui.fn.extend = function(options) {
    var that = this;

    //验证模块是否被占用
    options = options || {};
    for (var o in options) {
      if (that[o] || that.modules[o]) {
        error('\u6A21\u5757\u540D ' + o + ' \u5DF2\u88AB\u5360\u7528');
      } else {
        that.modules[o] = options[o];
      }
    }

    return that;
  };


  //本地存储
  lwjui.fn.data = function(table, settings) {
    table = table || 'lwjui';

    if (!win.JSON || !win.JSON.parse) return;

    //如果settings为null，则删除表
    if (settings === null) {
      return delete localStorage[table];
    }

    settings = typeof settings === 'object' ? settings : {
      key: settings
    };

    try {
      var data = JSON.parse(localStorage[table]);
    } catch (e) {
      var data = {};
    }

    if (settings.value) data[settings.key] = settings.value;
    if (settings.remove) delete data[settings.key];
    localStorage[table] = JSON.stringify(data);

    return settings.key ? data[settings.key] : data;
  };

  //设备信息
  lwjui.fn.device = function(key) {
    var agent = navigator.userAgent.toLowerCase();

    //获取版本号
    var getVersion = function(label) {
      var exp = new RegExp(label + '/([^\\s\\_\\-]+)');
      label = (agent.match(exp) || [])[1];
      return label || false;
    };

    var result = {
      os: function() { //底层操作系统
        if (/windows/.test(agent)) {
          return 'windows';
        } else if (/linux/.test(agent)) {
          return 'linux';
        } else if (/mac/.test(agent)) {
          return 'mac';
        } else if (/iphone|ipod|ipad|ios/.test(agent)) {
          return 'ios';
        }
      }(),
      ie: function() { //ie版本
        return (!!win.ActiveXObject || "ActiveXObject" in win) ? (
          (agent.match(/msie\s(\d+)/) || [])[1] || '11' //由于ie11并没有msie的标识
        ) : false;
      }(),
      weixin: getVersion('micromessenger') //是否微信
    };

    //任意的key
    if (key && !result[key]) {
      result[key] = getVersion(key);
    }

    //移动设备
    result.android = /android/.test(agent);
    result.ios = result.os === 'ios';

    return result;
  };

  //提示
  lwjui.fn.hint = function() {
    return {
      error: error
    }
  };

  //遍历
  lwjui.fn.each = function(obj, fn) {
    var that = this,
      key;
    if (typeof fn !== 'function') return that;
    obj = obj || [];
    if (obj.constructor === Object) {
      for (key in obj) {
        if (fn.call(obj[key], key, obj[key])) break;
      }
    } else {
      for (key = 0; key < obj.length; key++) {
        if (fn.call(obj[key], key, obj[key])) break;
      }
    }
    return that;
  };

  //阻止事件冒泡
  lwjui.fn.stope = function(e) {
    e = e || win.event;
    e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
  };

  //自定义模块事件
  lwjui.fn.onevent = function(modName, events, callback) {
    if (typeof modName !== 'string' || typeof callback !== 'function') return this;
    config.event[modName + '.' + events] = [callback];

    return this;
  };

  //执行自定义模块事件
  lwjui.fn.event = function(modName, events, params) {
    var that = this,
      result = null,
      filter = events.match(/\(.*\)$/) || []; //提取事件过滤器
    var set = (events = modName + '.' + events).replace(filter, ''); //获取事件本体名
    var callback = function(_, item) {
      var res = item && item.call(that, params);
      res === false && result === null && (result = false);
    };
    lwjui.each(config.event[set], callback);
    filter[0] && lwjui.each(config.event[events], callback); //执行过滤器中的事件
    return result;
  };

  // 构建指令逻辑
  lwjui.fn.directive = function(dirName, events) {
    // 记录 注册事件 directive
    config.directive[dirName] = !config.directive[dirName] ? events : config.directive[dirName];
    var events = events(),
      $this = this,
      result = {},
      isUses = 0;
    result.init = function(_$this, callback) {
      var _$scope = {};
      _$scope.fn = $this;
      _$scope.element = _$this;
      if (_$scope.element.length == 0) {
        return $this;
      }
      for (var key in events) {
        this.isType(key, events[key], _$scope, callback);
      }
    };
    result.isType = function($type, $value, _$scope, callback) {
      switch ($type) {
        // 模板
        case "template":
          _$scope.template = $value;
          break;
        // 需要加载的模块
        case "uses":
          isUses = 1;
          $this.uses($value, function() {
            isUses = 2;
          });
          break;
        // 需要加载的css
        case "addcss":
          isUses = 1;
          $this.addcss($value, function(){
            isUses = 2;
          }, $value)

          break;
        // 获取参数
        case "scope":
          _$scope.scope = {};
          for (var key in $value) {
            _$scope.scope[key] = this.isScope(key, $value[key], _$scope);
          }
          break;
        // 获取参数
        case "link":
          setTimeout(function() {
            if (isUses === 1 || isUses === 2) {
              var set = setInterval(function() {
                if (isUses === 2) {
                  clearInterval(set);
                  callback(_$scope);
                }
              }, 100);
            }
          }, 100);
          break;
          // 未知参数
        default:
          error($type + "未知参数！");
      }

    };
    result.isScope = function($key, $value, _$scope) {
      switch ($value[0]) {
        case "=":
          return eval("(" + valAttr(_$scope.element, $value.substr(1)) + ")");
          break;
        default:
          return valAttr(_$scope.element, $value);
      }

      function valAttr(_$this, _$value) {
        return _$this.attr(_$value) ? _$this.attr(_$value) :
          _$this.data(_$value);
      };
    };
    $.each($("*[" + dirName + "]"), function(index, val) {
      result.init($(this), events.link);
    });
    return this;
  };
  // 重新绑定directive
  lwjui.fn.init = function($name) {
    switch ($name) {
      case "directive":
        for (var key in config.directive) {
          this.directive(key, config.directive[key]);
        }
        break;
      default:
        for (var key in config.directive) {
          this.directive(key, config.directive[key]);
        }
    };
  };
  win.lwjui = new lwjui();
}(window);