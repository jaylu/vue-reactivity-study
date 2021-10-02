import { inflate } from '../modules/utils.js'

// 定义一个数据结构表示依赖
// 例如data对象的每一个字段都新建一个该对象，表示该字段的依赖
export class Dep {
    constructor() {
        this.listeners = []
    }

    // 加入和这相依赖相关的函数
    register(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener)
        }
    }

    // 通知这些函数执行一次
    notify() {
        this.listeners.forEach((listener) => {
            listener()
        })
    }
}

// 可以理解为一个暂时的指针，指向reactive运行时的上下文函数
// 在 watchEffect 里使用
let trackFunction = null

export function watchEffect(fn) {
    trackFunction = fn
    // 该fn()执行时会触发 getter 调用，从而 fn 函数会被收集
    fn()
    trackFunction = null
}

export function reactive(object) {
    let reactiveObject = {}
    for (const [key, value] of Object.entries(object)) {
        let internalValue = typeof value === 'object' && !isReactive(value) ? reactive(value) : value
        let dep = new Dep()

        // Vue 3 使用的是Proxy
        Object.defineProperty(reactiveObject, key, {
            enumerable: true,

            // 收集依赖
            get() {
                if (trackFunction) {
                    dep.register(trackFunction)
                }
                return internalValue
            },

            // 触发依赖
            set(newValue) {
                internalValue = newValue
                dep.notify()
            }
        })
    }

    reactiveObject.__isReactive = true
    return reactiveObject
}

export function isReactive(object) {
    return object && object.__isReactive
}

export function createApp(options) {
    let { template, setup } = options
    let model = setup()

    // 模板渲染，替换data的字段
    const render = selector => {
        let dom = document.querySelector(selector)
        if (dom) {
            dom.innerHTML = inflate(template, model)
        }
    }

    // 入口
    let mount = (selector) => {
        watchEffect(() => {
            render(selector)
        })
        return {
            ...model
        }
    }

    return {
        mount
    }
}

export function ref(value) {
    let reference = reactive({
        value
    })
    reference.__isRef = true
    return reference
}

export function isRef(object) {
    return object && object.__isRef
}

export function computed(fn) {
    let reference = ref()
    watchEffect(() => {
        reference.value = fn()
    })
    return reference
}
