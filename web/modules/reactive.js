import {mapValue} from '../modules/utils.js'

export class Dep {
    constructor() {
        this.subscribers = []
    }

    register(callback) {
        if (!this.subscribers.includes(callback)) {
            this.subscribers.push(callback)
        }
    }

    notify(oldValue, newValue) {
        this.subscribers.forEach(callback => {
            callback(oldValue, newValue)
        })
    }
}

let trackingFunction = null;


function reactiveES5(target) {
    if (target.__isReactive) {
        return target
    }
    Object.entries(target).forEach(([key, value]) => {
        const dep = new Dep()
        let internalValue = typeof value === 'object' ? reactiveES5(value) : value
        Object.defineProperty(target, key, {
            enumerable: true,
            get() {
                if (trackingFunction) {
                    dep.register(trackingFunction)
                }
                return internalValue
            },
            set(newValue) {
                let oldValue = internalValue
                internalValue = typeof newValue === 'object' ? reactive(newValue) : newValue
                dep.notify(oldValue, newValue)
            }
        })
    })
    target.__isReactive = true
    return target
}

function reactiveES6(targetParam) {
    if (targetParam.__isReactive) {
        return targetParam
    }

    const keyToDepMap = new Map()
    function getDepMapByKey(key) {
        if (!keyToDepMap.has(key)){
            keyToDepMap.set(key, new Dep())
        }
        return keyToDepMap.get(key)
    }

    let proxy = new Proxy({
        ...mapValue(targetParam, value => (typeof value === 'object') ? reactiveES6(value): value)
    }, {
        get(target, key){
            if (trackingFunction) {
                const dep = getDepMapByKey(key);
                dep.register(trackingFunction)
            }
            return target[key]
        },
        set(target, key, newValue) {
            let oldValue = target[key]
            target[key] = newValue
            const dep = getDepMapByKey(key);
            dep.notify(oldValue, newValue)
            return true
        }
    })

    proxy.__isReactive = true
    return proxy;

}

export const reactive = reactiveES6

export function isReactive(object) {
    return object !== null && object !== undefined && object.__isReactive
}

export function ref(initValue) {
    let result = reactive({
        value: initValue
    })
    result.__isRef = true
    return result
}

export function isRef(object) {
    return object !== null && object !== undefined && object.__isRef
}

export function toRef(object, key) {
    return {
        __isRef: true,
        get value() {
            return object[key]
        },
        set value(newValue) {
            object[key] = newValue
        }
    }
}

export function toRefs(object) {
    let result = {}
    Object.keys(object).forEach((key) => {
        result[key] = toRef(object, key)
    })
    return result
}

export function watchEffect(fn) {
    trackingFunction = fn
    fn()
    trackingFunction = null
}

export function computed(fn) {
    let reference = ref()
    watchEffect(() => {
        reference.value = fn()
    })
    return reference
}
