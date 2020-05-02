import {
    reactive,
    Dep,
    watchEffect,
    computed,
    ref,
    isReactive,
    isRef,
    toRef,
    toRefs
} from "./reactive";

describe('reactive', () => {
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

    it('reactive() - self++', () => {
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

    it('isReactive()', () => {
        const model = reactive({
            a: 'a'
        });
        expect(isReactive(model)).toBeTruthy()
        expect(isReactive({
            a: 'a'
        })).toBeFalsy()
    });

    it('ref()', () => {
        const price = ref(10)
        expect(price.value).toBe(10)
        expect(isRef(price)).toBe(true)
    });

    it('toRef()', () => {
        const state = reactive({
            foo: 1,
            bar: 2
        })

        const fooRef = toRef(state, 'foo')

        expect(fooRef.value).toEqual(1)

        state.foo++
        expect(fooRef.value).toEqual(2)

        fooRef.value++
        expect(state.foo).toEqual(3)
    });

    it('toRefs()', () => {
        const state = reactive({
            foo: 1,
            bar: 2
        })

        const stateAsRefs = toRefs(state)
        expect(stateAsRefs.foo.value).toEqual(1)
        expect(stateAsRefs.bar.value).toEqual(2)

        state.foo++
        expect(stateAsRefs.foo.value).toEqual(2)

        stateAsRefs.foo.value ++
        expect(state.foo).toEqual(3)
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
        expect(watcherValue).toEqual('x')
        expect(callback).toHaveBeenCalledTimes(2)
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