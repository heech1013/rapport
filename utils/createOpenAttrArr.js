const createOpenAttrArr = (date) => {
  const FIRST_HOUR = 0, LAST_HOUR = 23

  const weekArr = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const dayNum = new Date(date).getDay()
  const dayStr = weekArr[dayNum]

  const openAttrArr = []
  
  for (let hour = FIRST_HOUR; hour <= LAST_HOUR; hour++) {
    openAttrArr.push(`${dayStr}${hour}`)
  }

  return openAttrArr
}

module.exports = createOpenAttrArr