const createFiveSessionArr = require('./createFiveSessionArr')
const calcLeftSessionDate = require('./calcLeftSessionDate')

describe('createFiveSessionArr()', () => {
    it('creates array of 5 session dates', () => {
        const testDate = new Date('2021-08-12')
        
        expect(createFiveSessionArr(testDate))
            .toEqual(['2021-08-12', '2021-08-19', '2021-08-26', '2021-09-02', '2021-09-09'])
    })
})

describe('calcLeftSessionDate()', () => {
    it('calculate left session from current session', () => {
        const testDate = new Date('2021-08-26')

        expect(calcLeftSessionDate(testDate, 3))
            .toEqual(['2021-08-26', '2021-09-02', '2021-09-09'])
    })

    it('calculate left session from the first session', () => {
        const testDate = new Date('2021-08-12')

        expect(calcLeftSessionDate(testDate, 1))
            .toEqual(['2021-08-12', '2021-08-19', '2021-08-26', '2021-09-02', '2021-09-09'])
    })

    it('calculate left session from the last session', () => {
        const testDate = new Date('2021-09-09')

        expect(calcLeftSessionDate(testDate, 5))
            .toEqual(['2021-09-09'])
    })
})