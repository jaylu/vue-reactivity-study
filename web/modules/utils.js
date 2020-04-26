import {get} from '../lib/lodash.js'

export function inflate(template, model) {
    let result = template;
    const matches = [...template.matchAll(/{{(.*)}}/g)];
    const keys = matches.map(item => item[1]);
    keys.forEach((key) => {
        let regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, get(model, key));
    });
    return result;
}

