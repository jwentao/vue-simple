/* eslint-disable */
let _Vue = null;
export default class VueRouter {
  static install (Vue) {
    // 判断插件是否已经安装
    if (VueRouter.install.installed) {
      return;
    }
    VueRouter.install.installed = true;
    // Vue构造函数记录到全局变量
    _Vue = Vue;
    // 把创建vue实例时传入的router对象注入到Vue实例
    // 混入
    _Vue.mixin({
      beforeCreate() {
        // vue实例才写入
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      }
    });
  }

  constructor(options ) {
    this.options = options;
    this.routeMap = {};
    this.data = _Vue.observable({
      current: '/'
    });
  }

  init () {
    this.createRouteMap();
    this.initComponents(_Vue);
  }

  createRouteMap () {
    // 遍历所有路由规则，存储到routeMap
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }

  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      template: `<a :href="to"><slot></slot></a>`
    });
  }
}
