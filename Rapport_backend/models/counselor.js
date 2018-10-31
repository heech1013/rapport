/** 이슈
 * createdAt, updatedAt 기본값 미설정으로 인해 SQL insert 오류 (ERR:1364) / Case, User도 마찬가지.
  ㄴ> workbench로 삽입할 때만. 클라이언트에서 넣으면 넣은 시간이 createdAt, updatedAt에 입력됨.
 * id의 옵션에 Primary Key 옵션이 저절로 들어가는지 확인 필요.
 * 닉네임 중복 / 비밀번호 제한 등 프론트단에서 제한 필요.
 * 한 column에 배열이나 여러 데이터를 넣을 수 없다(여러 column을 넣을 수는 있어도). 어쩔 수 없이 location과 field 영역을 한 개 선택으로 제한(프론트단에서 제한해야 함)
   location 혹은 field 정보만을 담는 또 다른 schema를 만들어서 associate하면 충분히 구현할 수는 있지만.. 굳이? 다른 방법이 있을지 고민 중.
 * 상담 단가를 정해놓으면(물론 나중에 수정할 수 있다.) 상담케이스를 열 때 무조건 그 가격으로 열리도록 하는 것이 좋을 것 같다.
 * 
 */

module.exports = (sequelize, DataTypes) => {
  const Counselor = sequelize.define('counselor', {
    // id
    userType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: 'counselor',
    },
    authed: {  // 자격 인증 여부. 자격 인증이 완료되어야 케이스를 오픈할 수 있다.
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,  // (SNS 로그인 염두)
    },
    name: {  // 상담사 이름
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: false,
    },
    field: {  // 상담 분야(선택형:하나만)
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location: {  // 상담 가능 지역(선택형:하나만)
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price: {  // 상담 비용
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    career: {  // 경력 & 연혁
      type: DataTypes.TEXT,
      allowNull: true,
    },
    detail: {  // 소개 & 특이사항
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true,
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });

  return Counselor;
};