/*
相当于Vue的构造函数
 */
function MVVM(options) {
  // 保存配置对象到vm
  this.$options = options;
  // 保存data对象到vm和局部变量data上
  var data = this._data = this.$options.data;
  // 保存vm到me变量
  var me = this;
  // 遍历data中所有属性
  Object.keys(data).forEach(function (key) { // key: 属性名 name
    // 对指定属性实现数据代理
    me._proxy(key);
  });

  observe(data, this);

  this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
  $watch: function (key, cb, options) {
    new Watcher(this, key, cb);
  },

  _proxy: function (key) {
    // 保存vm
    var me = this;
    // 给vm添加属性: 与data同名, 使用属性描述符指定getter/setter
    Object.defineProperty(me, key, {
      configurable: false, // 防止重复定义
      enumerable: true, // 可以枚举
      // 当通过vm.xxx读取属性值时自动调用
      get: function proxyGetter() {
        // 从data中取出对应的属性值返回
        return me._data[key];
      },
      // 当通过vm.xxx = value设置了新的值时自动调用
      set: function proxySetter(newVal) {
        // 将最新的值保存到data中对应的属性上
        me._data[key] = newVal;
      }
    });
  }
};

// MVVM.prototype.constructor = MVVM