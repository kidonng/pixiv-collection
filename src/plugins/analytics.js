import galite from 'ga-lite'
import { googleAnalyticsID } from '../config'

if (googleAnalyticsID) {
  galite('create', googleAnalyticsID, 'auto')
  galite('send', 'pageview')
}
