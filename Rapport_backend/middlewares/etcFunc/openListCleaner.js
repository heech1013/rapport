// put in order `openList` in the way server part wanted to get
const openListCleaner = (openList) => openList.map(open => ({
  ...open,
  startDate: open.Open.startDate,
  endDate: open.Open.endDate,
}))

module.exports = openListCleaner;