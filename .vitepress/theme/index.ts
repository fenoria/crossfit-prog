import DefaultTheme from 'vitepress/theme'
import TimerApp from './components/TimerApp.vue'
import './custom.css'
import './timer.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TimerApp', TimerApp)
  },
}
