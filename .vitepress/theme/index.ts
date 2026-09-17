import DefaultTheme from 'vitepress/theme'
import PercentagesApp from './components/PercentagesApp.vue'
import WeightliftingApp from './components/WeightliftingApp.vue'
import './custom.css'
import './tools.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('PercentagesApp', PercentagesApp)
    app.component('WeightliftingApp', WeightliftingApp)
  },
}
