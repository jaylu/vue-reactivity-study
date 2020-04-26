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
});