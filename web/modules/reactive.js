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
export function reactive(target) {
    if (target.__isReactive) {
        return target
    }
    Object.entries(target).forEach(([key, value]) => {
        const dep = new Dep()
        let internalValue = typeof value === 'object' ? reactive(value) : value
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