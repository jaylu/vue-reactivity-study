import {
    reactive,
    Dep,
    watchEffect,
    computed,
    ref,
    isReactive,
    isRef
} from "./reactive";

describe('reactive', () => {
    it('De class - can register and notify', () => {

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
        const result = reactive(raw);
        expect(result.quantity).toEqual(10)
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
        const result = reactive(raw);
        expect(result.b.d.e).toEqual('e')
        expect(isReactive(result)).toBeTruthy()
    });

    it('isReactive()', () => {
        const model = reactive({
            a: 'a'
        });
        expect(isReactive(model)).toBeTruthy()
        expect(isReactive({a: 'a'})).toBeFalsy()
    });

    it('ref()', () => {
        const price = ref(10)
        expect(price.value).toBe(10)
        expect(isRef(price)).toBe(true)
    });


    it('watchEffect() - single layer', () => {
        const obj = reactive({
            a: 'a'
        });

        let callback = jest.fn()
        let watcherValue
        watchEffect(() => {
            callback()
            watcherValue = obj.a
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toEqual('a')

        obj.a = 'x'
        expect(callback).toHaveBeenCalledTimes(2)
        expect(watcherValue).toEqual('x')
        // expect(callback.mock.calls[1]).toBe([])
    });

    it('watchEffect() - deeper layer', () => {
        const obj = reactive({
            a: 'a',
            b: {
                c: 'c',
                d: {
                    e: 'e'
                }
            }
        });

        let callback = jest.fn()
        let watcherValue
        watchEffect(() => {
            callback()
            watcherValue = obj.b.d.e
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toEqual('e')

        obj.b.d.e = 'x'
        expect(callback).toHaveBeenCalledTimes(2)
        expect(watcherValue).toEqual('x')
    });

    it('watchEffect() - replace object', () => {
        const obj = reactive({
            a: 'a',
            b: {
                c: 'c',
            }
        });

        let callback = jest.fn()
        let watcherValue
        watchEffect(() => {
            callback()
            watcherValue = obj.b
        })
        expect(callback).toHaveBeenCalledTimes(1)
        expect(watcherValue).toMatchObject({
            c: 'c',
        })

        obj.b = {
            d: 'd'
        }
        expect(callback).toHaveBeenCalledTimes(2)
        expect(watcherValue).toMatchObject({
            d: 'd'
        })
    });

    it('computed()', () => {
        const model = reactive({
            price: 20,
            quantity: 10
        })

        const total = computed(() => model.price * model.quantity)
        expect(total.value).toEqual(200)
        expect(isRef(total)).toBeTruthy()

        model.price = 30
        expect(total.value).toEqual(300)
    });




});