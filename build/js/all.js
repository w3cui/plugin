/** lwj-v MIT License By  */
 ;// 合并打包配置
lwjui.define(function(exports){
  var cache = lwjui.cache;
  lwjui.config({
    dir: cache.dir.replace(/js\/dest\/$/, '')
  });
  exports('lwjui.all', lwjui.v);
});
