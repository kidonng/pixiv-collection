import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

import zh_CN from 'dayjs/locale/zh-cn'

dayjs.extend(LocalizedFormat)

const languages = {
  'zh-CN': zh_CN
}

export default (time, navigator) => {
  const lang = navigator.languages.find(lang =>
    Object.keys(languages).includes(lang)
  )
  return lang ? dayjs(time).locale(languages[lang]) : dayjs(time)
}
