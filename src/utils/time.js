import dayjs from 'dayjs'
import format from 'dayjs/plugin/localizedFormat'
import zh_CN from 'dayjs/locale/zh-cn'

dayjs.extend(format)

export default time =>
  navigator.language === 'zh-CN' ? dayjs(time).locale(zh_CN) : dayjs(time)
