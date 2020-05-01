import { inflate, get, cloneDeep } from "./utils.js";

describe('utils.js', () => {

    test('get()', () => {
       const object = {
           a: 'a',
           b: {
               c: 'c',
               d: {
                   e: 'e'
               }
           }
       } 

       expect(get(object, 'a')).toEqual('a')
       expect(get(object, 'b.c')).toEqual('c')
       expect(get(object, 'b.d')).toEqual({
           e: 'e'
       })
       expect(get(object, 'b.d.e')).toEqual('e')
       expect(get(object, 'b.k')).toEqual(undefined)
    });

    test('inflate() - single layer', () => {
        const template = `<div>{{name}}</div>`
        const model = {
            name: 'Jay'
        }
        const result = inflate(template, model)
        expect(result).toEqual('<div>Jay</div>')
    });

    it('inflate() - multiple layer', () => {
        const template = `<div>{{data.name}}</div>`
        const model = {
            data: {
                name: 'Jay'
            }
        }
        const result = inflate(template, model)
        expect(result).toEqual('<div>Jay</div>')
    });
});