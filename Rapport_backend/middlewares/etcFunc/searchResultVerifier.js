const searchResultVerifier = (searchResult) => {
  return new Promise( async(resolve, reject) => {
    const verified = searchResult.filter((obj) => {
      let flag = false;
      for (let i = 9; i <= 18; i++) {
        // 9시 ~ 18시 중 휴무일 데이터에 없는 시간이 있는 경우 true(flag)를 반환, filter를 통과한다.
        obj["Close"].forEach((timeObj) => {
          if (timeObj["time"] != i) {
            flag = true;
          }
        });
        obj["Reserved"].forEach((timeObj) => {
          if (timeObj["time"] != i) {
            flag = true;
          }
        });
      }
      return flag; // 판별식이 true로 강제되는 배열을 리턴한다.
    });
    resolve(verified);
  })
};

module.exports = searchResultVerifier;