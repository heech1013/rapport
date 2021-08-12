const createFiveSessionArr = require('./createFiveSessionArr')

describe('createFiveSessionArr()', () => {
    it('creates array of 5 session dates', () => {
        const testDate = new Date('2021-08-12')
        expect(createFiveSessionArr(testDate)).toEqual(['2021-08-12', '2021-08-19', '2021-08-26', '2021-09-02', '2021-09-09'])
    })
})