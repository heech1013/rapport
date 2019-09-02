const searchResultCleaner = (resultsArr) => {
  return new Promise((resolve) => {
    resolve (
      resultsArr.map((obj) => {
        const rObj = {
          "id": obj["id"],
          "CounselorProfile" : {
            "name": obj["CounselorProfile"]["name"],
            "price": obj["CounselorProfile"]["price"],
            "profileImgSrc": obj["CounselorProfile"]["profileImgSrc"]
          },
          "Certification": obj["Certification"]
        };
        return rObj;
      })
    )
  });
}

module.exports = searchResultCleaner;