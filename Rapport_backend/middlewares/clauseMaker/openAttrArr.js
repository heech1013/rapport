const openAttrArrMaker = (date) => {
  return new Promise((resolve, reject) => {
    const week = new Array('SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT');
    const numOfDay = new Date(date).getDay();
    const day = week[numOfDay];

    const openAttrArr = [];
    for (let i = 9; i <= 18; i++) {
      openAttrArr.push(day + i);
    }
    resolve(openAttrArr);
  })
}

module.exports = openAttrArrMaker;