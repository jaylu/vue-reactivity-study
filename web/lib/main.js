import { inflate } from '../modules/utils.js'

export class Dep {
    constructor() {
        this.listeners = []
    }

    register(listener) {
        if (!this.listeners.includes(listener)) {
            this.listeners.push(listener)
        }
    }

    notify() {
        this.listeners.forEach((listener) => {
            listener()
        })
    }
}

let trackingFunction = null
export function reactive(object) {
    let reactiveObject = {}
    for (const [key, value] of Object.entries(object)) {
        let internalValue = typeof value === 'object' ? reactive(value): value
        let dep = new Dep()
        Object.defineProperty(reactiveObject, key, {
            enumerable: true,
            get() {
                if (trackingFunction) {
                    dep.register(trackingFunction)
                }
                return internalValue
            },
            set(newValue) {
                internalValue = newValue
                dep.notify()
            }
        })
    }
    reactiveObject.__isReactive = true
    return reactiveObject
}

export function watchEffect(fn) {
    trackingFunction = fn
    fn()
    trackingFunction = null
}

export function isReactive(object) {
    return object && object.__isReactive;
}

export function ref(value) {
    let refObject = reactive({
        value
    })
    refObject.__isRef = true
    return refObject
}

export function isRef(object){
    return object && object.__isRef
}

export function computed(fn) {
    let reference = ref()
    watchEffect(() => {
        reference.value = fn()
    })
    return reference
}

export function createApp(option) {
    let {template, setup} = option
    let model = setup()
    const render = selector => {
        let dom = document.querySelector(selector)
        if (dom) {
            dom.innerHTML = inflate(template, model)
        }
    }

    let mount = (selector) => {
        watchEffect(() => {
            render(selector)
        })
        return {
            ...model
        }
    }

    return {
        ...model,
        mount
    }
}

