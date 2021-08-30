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
    this.initEvents();
  }

  createRouteMap () {
    // 遍历所有路由规则，存储到routeMap
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component;
    });
  }

  initComponents (Vue) {
    const self = this;
    Vue.component('router-link', {
      props: {
        to: String
      },
      // template: `<a :href="to"><slot></slot></a>` // template，运行时版本的vue不支持
      render(h, context) {
        return h('a', {
          attrs: {
            href: this.to
          },
          on: {
            click: this.clickHandler
          }
        }, [this.$slots.default])
      },
      methods: {
        clickHandler(e) {
          history.pushState({}, '', this.to);
          this.$router.data.current = this.to;
          e.preventDefault();
        }
      }
    });

    Vue.component('router-view', {
      render(h, context) {
        const component = self.routeMap[self.data.current];
        return h(component);
      }
    });
  }

  initEvents () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname;
      console.log(this);
    })
  }
}
