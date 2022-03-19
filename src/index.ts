import Vue, { ComponentOptions } from 'vue'
import { VueClass } from './declarations'
import { componentFactory, $internalHooks } from './component'

export { createDecorator, VueDecorator, mixins } from './util'

// Component 装饰器兼容带 options 和 不带 options 两种写法，即：
// @Component({ ... }) class VueComponent extends Vue { ... } 和 @Component class VueComponent extends Vue { ... }
function Component <V extends Vue>(options: ComponentOptions<V> & ThisType<V>): <VC extends VueClass<V>>(target: VC) => VC
function Component <VC extends VueClass<Vue>>(target: VC): VC
function Component (options: ComponentOptions<Vue> | VueClass<Vue>): any {
  // 1. options 是函数时，说明 @Component 直接装饰类型，此时 Component 是装饰器函数
  // 对应这种情况：@Component class VueComponent extends Vue { ... }
  if (typeof options === 'function') {
    return componentFactory(options)
  }
  // 2. 否则，说明 @Component 接受 options 参数，然后在装饰类型，此时 Component 是装饰器工厂函数，即生成装饰器的函数
  // 对应这种情况：@Component({ ... }) class VueComponent extends Vue { ... }
  return function (Component: VueClass<Vue>) {
    return componentFactory(Component, options)
  }
}

Component.registerHooks = function registerHooks (keys: string[]): void {
  $internalHooks.push(...keys)
}

export default Component
