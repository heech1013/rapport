const searchResultCleaner = (resultsArr) => {
  return new Promise((resolve) => {
    resolve (
      resultsArr.map((obj) => {
        const rObj = {
          "id": obj["id"],
          "CounselorProfile" : obj["CounselorProfile"]
        };
        return rObj;
      })
    )
  });
}

module.exports = searchResultCleaner;