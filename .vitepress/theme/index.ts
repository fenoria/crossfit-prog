import DefaultTheme from 'vitepress/theme'
import CurrentWeekRedirect from './components/CurrentWeekRedirect.vue'
import PercentagesApp from './components/PercentagesApp.vue'
import WeightliftingApp from './components/WeightliftingApp.vue'
import AnKpis from './components/AnKpis.vue'
import AnTimeline from './components/AnTimeline.vue'
import AnConstats from './components/AnConstats.vue'
import AnNext from './components/AnNext.vue'
import AnLifts from './components/AnLifts.vue'
import AnVolumes from './components/AnVolumes.vue'
import AnDeviations from './components/AnDeviations.vue'
import AnSignals from './components/AnSignals.vue'
import './custom.css'
import './tools.css'
import './analytics.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('CurrentWeekRedirect', CurrentWeekRedirect)
    app.component('PercentagesApp', PercentagesApp)
    app.component('WeightliftingApp', WeightliftingApp)
    app.component('AnKpis', AnKpis)
    app.component('AnTimeline', AnTimeline)
    app.component('AnConstats', AnConstats)
    app.component('AnNext', AnNext)
    app.component('AnLifts', AnLifts)
    app.component('AnVolumes', AnVolumes)
    app.component('AnDeviations', AnDeviations)
    app.component('AnSignals', AnSignals)
  },
}
