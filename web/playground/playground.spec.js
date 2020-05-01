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
});