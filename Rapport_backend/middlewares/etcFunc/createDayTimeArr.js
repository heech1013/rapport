const HOUR_START = 0, HOUR_END = 23

const createDayTimeArr = () => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
    const dayTimeArr = []
    
    for (let dayIdx = 0; dayIdx < days.length; dayIdx++) {
        for (let time = HOUR_START; time <= HOUR_END; time++) {
            dayTimeArr.push(days[dayIdx] + `${time}`)
        }
    }

    return dayTimeArr
}

module.exports = createDayTimeArr