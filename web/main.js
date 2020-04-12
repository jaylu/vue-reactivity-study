function compile(template, model) {
    let result = template
    Object.keys(model).forEach((key) => {
        let regex = new RegExp(`{{${key}}}`, 'g')
        result = result.replace(regex, model[key])
    })
    return result
}