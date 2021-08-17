const createFiveSessionArr = require('./createFiveSessionArr')
const calcLeftSessionDate = require('./calcLeftSessionDate')
const createOpenAttrArr = require('./createOpenAttrArr')

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

describe('createOpenAttrArr()', () => {
    it('create array of DAY+HOUR string with DAY of the date', () => {
        const testDateInWED = new Date('2021-08-17')
        const testDateInTHU = new Date('2021-08-18')

        expect(createOpenAttrArr(testDateInWED))
            .toEqual([
                'WED0', 'WED1', 'WED2', 'WED3', 'WED4', 'WED5',
                'WED6', 'WED7', 'WED8', 'WED9', 'WED10', 'WED11',
                'WED12', 'WED13', 'WED14', 'WED15', 'WED16', 'WED17',
                'WED18', 'WED19', 'WED20', 'WED21', 'WED22', 'WED23'
            ])
            
        expect(createOpenAttrArr(testDateInTHU))
            .toEqual([
                'THU0', 'THU1', 'THU2', 'THU3', 'THU4', 'THU5',
                'THU6', 'THU7', 'THU8', 'THU9', 'THU10', 'THU11',
                'THU12', 'THU13', 'THU14', 'THU15', 'THU16', 'THU17',
                'THU18', 'THU19', 'THU20', 'THU21', 'THU22', 'THU23'
            ])
    })
})