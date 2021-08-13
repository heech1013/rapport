const { HOUR_START, HOUR_END, DAYS } = require('../../lib/constant')

const createDefaultDayTimeObj = () => {
    const defaultDayTimeObj = {}
    
    for (let dayIdx = 0; dayIdx < DAYS.length; dayIdx++) {
        for (let time = HOUR_START; time <= HOUR_END; time++) {
            const key = DAYS[dayIdx] + time
            defaultDayTimeObj[key] = false
        }
    }

    return defaultDayTimeObj
}

module.exports = createDefaultDayTimeObj