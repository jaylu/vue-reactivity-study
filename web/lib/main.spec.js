import { Dep, reactive, isReactive, watchEffect, ref, isRef, computed } from './main.js'

describe('main', function () {
    it('class Dep - can register and notify', () => {

        let dep = new Dep()

        let callback = jest.fn()
        dep.register(callback)
        dep.register(callback)

        dep.notify()
        expect(callback).toHaveBeenCalledTimes(1)
    });

    it('reactive() - can define reactive', () => {
        let raw = {
            quantity: 10
        }
        const proxy = reactive(raw);
        expect(proxy.quantity).toEqual(10)
    });

    it('reactive() - can define reactive and get deeper layer value', () => {
        let raw = {
            a: 'a',
            b: {
                c: 'c',
                d: {
                    e: 'e'
                }
            }
        }
        const proxy = reactive(raw);
        expect(proxy.b.d.e).toEqual('e')
        expect(isReactive(proxy)).toBeTruthy()
    });

    it('isReactive()', () => {
        const proxy = reactive({
            a: 'a'
        });
        expect(isReactive(proxy)).toBeTruthy()
        expect(isReactive({
            a: 'a'
        })).toBeFalsy()
    });

    it('watchEffect() - single layer', () => {
        const proxy = reactive({
            a: 'a'
        });

        let callback = jest.fn()
        let watcherValue = null
        watchEffect(() => {
            callback()
            watcherValue = proxy.a
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toEqual('a')

        proxy.a = 'x'
        expect(callback).toHaveBeenCalledTimes(2)
        expect(watcherValue).toEqual('x')
    });

    it('watchEffect() - deeper layer', () => {
        const proxy = reactive({
            a: 'a',
            b: {
                c: 'c',
                d: {
                    e: 'e'
                }
            }
        });

        let callback = jest.fn()
        let watcherValue = null
        watchEffect(() => {
            callback()
            watcherValue = proxy.b.d.e
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toEqual('e')

        proxy.b.d.e = 'x'
        expect(watcherValue).toEqual('x')
        expect(callback).toHaveBeenCalledTimes(2)
    });

    it('watchEffect() - replace object', () => {
        const proxy = reactive({
            a: 'a',
            b: {
                c: 'c',
            }
        });

        let callback = jest.fn()
        let watcherValue = null
        watchEffect(() => {
            callback()
            watcherValue = proxy.b
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toMatchObject({
            c: 'c',
        })

        proxy.b = {
            d: 'd'
        }
        expect(callback).toHaveBeenCalledTimes(2)
        expect(watcherValue).toMatchObject({
            d: 'd'
        })
    });

    it('ref()', () => {
        const price = ref(10)
        expect(price.value).toBe(10)
        expect(isRef(price)).toBe(true)
    });

    it('computed() - self++', () => {
        const state = reactive({
            foo: 1
        })
        const statePlus = computed(() => state.foo + 1)
        expect(state.foo).toEqual(1)
        expect(statePlus.value).toEqual(2)

        state.foo++

        expect(state.foo).toEqual(2)
        expect(statePlus.value).toEqual(3)
    });

    it('computed()', () => {
        const state = reactive({
            price: 20,
            quantity: 10
        })

        const total = computed(() => state.price * state.quantity)
        expect(total.value).toEqual(200)
        expect(isRef(total)).toBeTruthy()

        state.price = 30
        expect(total.value).toEqual(300)
    });

})
