const { HOUR_START, HOUR_END, DAYS } = require('../../lib/constant')

const createDayTimeArr = () => {
    const dayTimeArr = []
    
    for (let dayIdx = 0; dayIdx < DAYS.length; dayIdx++) {
        for (let time = HOUR_START; time <= HOUR_END; time++) {
            dayTimeArr.push(DAYS[dayIdx] + `${time}`)
        }
    }

    return dayTimeArr
}

module.exports = createDayTimeArr