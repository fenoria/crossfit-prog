import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import HomeRedirect from './components/HomeRedirect.vue'
import TimerApp from './components/TimerApp.vue'
import PercentagesApp from './components/PercentagesApp.vue'
import WeightliftingApp from './components/WeightliftingApp.vue'
import './custom.css'
import './tools.css'
import './timer.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      'layout-top': () => h(HomeRedirect),
    }),
  enhanceApp({ app }) {
    app.component('TimerApp', TimerApp)
    app.component('PercentagesApp', PercentagesApp)
    app.component('WeightliftingApp', WeightliftingApp)
  },
}
