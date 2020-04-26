import {inflate} from './utils.js'
import {reactive, watchEffect} from './reactive.js'

class Vue {
    constructor(options) {
        this.$el = null;
        this.$data = null;
        this.$options = options;
        this.$mountSelector = null;
        this.init();
    }
    init() {
        // prepare data
        this.$data = this.$options.data();
        Object.assign(this, this.$data);
        reactive(this)
    }
    $mount(selector) {
        this.$mountSelector = selector;
        const render = () => {
            const template = document.querySelector(this.$options.template).innerHTML;
            this.$el = inflate(template, this);
            if (this.$mountSelector) {
                document.querySelector(this.$mountSelector).innerHTML = this.$el;
            }
        }
        render();
    }
}

export default Vue