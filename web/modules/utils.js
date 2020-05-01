import { isRef } from "./reactive.js";

export function get(object, key) {
    if (!object && !key && (typeof key !== 'string')) {
        throw new Error('param not valid')
    }
    const splits = key.split('.');
    let currentValue = object
    for (const currentKey of splits) {
        currentValue = currentValue[currentKey]
        if (currentValue === null || currentValue === undefined) {
            break
        }
    }
    return currentValue
}

export function inflate(template, model) {
    let result = template;
    const matches = [...template.matchAll(/{{(.*)}}/g)];
    const keys = matches.map(item => item[1]);
    keys.forEach((key) => {
        let regex = new RegExp(`{{${key}}}`, 'g');
        let value = get(model, key);
        if (isRef(value)) {
            value = value.value
        }
        result = result.replace(regex, value);
    });
    return result;
}



