import { inflate, getByPath } from "./utils.js";

describe('utils.js', () => {

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