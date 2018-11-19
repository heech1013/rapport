/** 이슈
 * createdAt, updatedAt 기본값 미설정으로 인해 SQL insert 오류 (ERR:1364) / Case, User도 마찬가지.
  ㄴ> workbench로 삽입할 때만 발생. 클라이언트를 통해 넣으면 넣은 시간이 createdAt, updatedAt에 입력됨.
 * mvp에서는 상담사의 개인 공간에서 상담이 이루어진다.
  추후 커버가능지역 등이 추가되면 역정규화를 통한 multiple values나 따로 스키마를 빼는 등의 방법을 도입해야 함.
 * 상담 단가를 정해놓으면(물론 나중에 수정할 수 있다.) 상담케이스를 열 때 무조건 그 가격으로 열리도록 하는 것이 좋을 것 같다.
 */

/* 상담사용 프로필 정보 */
module.exports = (sequelize, DataTypes) => {
  const CounselorProfile = sequelize.define('counselorProfile', {

    // id: 자동생성
    
    name: {  // 상담사 이름
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: false,
    },
    // field: {  // 상담 분야(선택형:하나만) ???
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    location: {  // 개인 상담사의 개인공간 주소
      type: DataTypes.STRING(),
      allowNull: true,
    },
    price: {  // 상담 비용
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    career: {  // 경력 & 연혁 (데이터 형식에 대해 프론트에게 의견을 물어봐야)
      type: DataTypes.TEXT,
      allowNull: true,
    },
    simpleIntroduction: {  // 한 줄 인사
      type: DataTypes.TEXT,
      allowNull: true,
    },
    detailIntroduction: {  // 소개 & 특이사항 (데이터 형식에 대해 프론트에게 의견을 물어봐야)
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // updatedAt : 자동 생성

    // createdAt : 자동 생성

  }, {
    timestamps: true,  // updatedAt, createdAt 자동 생성
    underscored: false,  // camelCase style(updatedAt, createdAt)
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return CounselorProfile;
};