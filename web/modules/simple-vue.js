import { inflate } from './utils.js'
import {watchEffect} from './reactive.js'

export * from './reactive.js'
export function createApp(options) {
    const mount = (selector) => {
        const { template, setup } = options
        const model = setup()

        const render = () => {
            const renderedDom = inflate(template, model)
            const dom = document.querySelector(selector)
            if (dom) {
                dom.innerHTML = renderedDom
            }
        }

        watchEffect(() => {
            render()
        })

        return {
            ...model
        }
    }
}
