describe('playground', () => {
    test('entries', () => {
        const raw = {
            a: 'a',
            b: {
                c: 'c',
                d: {
                    e: 'e'
                }
            }
        }

        const entries = Object.entries(raw);
        for (const [key, value] of entries) {
            raw[key] = 'b'
        }
        expect(raw).toEqual({
            a: 'b',
            b: 'b'
        })
    });

    test('pointer', () => {
        let a = {
            a: 'a'
        }

        let old = a
        a = {
            a: 'b'
        }

        expect(a).toEqual({
            a: 'b'
        })
        expect(old).toEqual({
            a: 'a'
        })
    });

    test('proxy', () => {
        let raw = {
            a: 'a',
            b: {
                c: 'c',
                d: {
                    e: 'e'
                }
            }
        }

        let result = new Proxy(raw, {
            get(target, prop) {
                return target[prop]
            },
            set(target, prop, newValue) {
                target[prop] = newValue
                return true
            }
        })

        expect(result.a).toEqual('a')
        result.a = 12
        expect(result.a).toEqual(12)
    });

    test('... operator', () => {
        let raw = {
            a: 'a',
            b: 'b',
            c: {
                d: 'd'
            }
        }

        let result = {...raw}
        expect(result).not.toBe(raw)
        expect(result.a).toEqual(raw.a)
        expect(result.c).toEqual(raw.c)
        
        expect(Object.keys(raw).length).toEqual(3)
        expect(Object.keys(result).length).toEqual(3)
    });
});