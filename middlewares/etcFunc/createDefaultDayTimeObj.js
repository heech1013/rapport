const HOUR_START = 0, HOUR_END = 23

const createDefaultDayTimeObj = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const defaultDayTimeObj = {}
    
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        for (let time = HOUR_START; time <= HOUR_END; time++) {
            const key = days[dayIdx] + time
            defaultDayTimeObj[key] = false
        }
    }

    return defaultDayTimeObj
}

module.exports = createDefaultDayTimeObj