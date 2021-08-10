const searchResultCleaner = (results) => {
  return results.map(result => ({
    id: result.id,
    CounselorProfile: {
      name: result.CounselorProfile.name,
      price: result.CounselorProfile.price,
      profileImgSrc: result.CounselorProfile.profileImgSrc,
    },
    Certification: result.Certification
  }))
}

module.exports = searchResultCleaner;