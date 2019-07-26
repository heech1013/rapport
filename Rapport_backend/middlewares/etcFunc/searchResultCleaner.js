const searchResultCleaner = (resultsArr) => {
  return new Promise((resolve) => {
    resolve (
      resultsArr.map((obj) => {
        const rObj = {
          "id": obj["id"],
          "CounselorProfile" : {
            "name": obj["CounselorProfile"]["name"],
            "price": obj["CounselorProfile"]["price"]
          },
          "Certification": obj["Certification"]
        };
        return rObj;
      })
    )
  });
}

module.exports = searchResultCleaner;