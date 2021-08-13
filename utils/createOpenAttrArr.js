const { HOUR_START, HOUR_END, DAYS }  = require('../lib/constant')

const createOpenAttrArr = (date) => {
  const dayNum = new Date(date).getDay()
  const dayStr = DAYS[dayNum]

  const openAttrArr = []
  
  for (let hour = HOUR_START; hour < HOUR_END; hour++) {
    openAttrArr.push(`${dayStr}${hour}`)
  }

  return openAttrArr
}

module.exports = createOpenAttrArr