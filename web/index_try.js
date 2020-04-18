(function () {

    function inflate(template, model) {
        let result = template
        const matches = [...template.matchAll(/{{(.*)}}/g)]
        const keys = matches.map(item => item[1])
        keys.forEach((key) => {
            let regex = new RegExp(`{{${key}}}`, 'g')
            result = result.replace(regex, model[key])
        })
        return result
    }

    function reactive() {

    }

    class Vue {
        constructor(options) {
            this.$options = options
            this.init();
        }

        init() {
            // prepare data
            this.$mountSelector = ''
            this.$data = this.$options.data()
            Object.assign(this, this.$data)
            this.$template = document.querySelector(this.$options.template).innerHTML
            
            // life cycle
            this.$options.created.apply(this)
            setInterval(() => {
              this.render()
            }, 200)
        }

        render() {
            this.$el = inflate(this.$template, this)
            if (this.$mountSelector) {
                document.querySelector(this.$mountSelector).innerHTML = this.$el
            }
        }

        $mount(selector) {
            this.$mountSelector = selector
            this.render()
        }
    }

    window.Vue = Vue
})()