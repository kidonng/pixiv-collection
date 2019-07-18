import galite from 'ga-lite'
import config from '../../config'

if (config.googleAnalyticsID) {
  galite('create', config.googleAnalyticsID, 'auto')
  galite('send', 'pageview')
}
