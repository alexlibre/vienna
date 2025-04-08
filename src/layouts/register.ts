import type { App, Component } from 'vue'

/**
 * Register layouts in the app instance
 *
 * @param {App<Element>} app
 */
export function registerLayouts(app: App<Element>) {
  console.log('registerLayouts')
  const modules = import.meta.glob<{ default: Component }>('@/layouts/*.vue', { eager: true })
  Object.entries(modules).forEach(([key, component]) => {
    const name = key.split('/').slice(-1)[0].replace('.vue', '')
    console.log('layout', name)
    app.component(name, component.default)
  })
}