# Rapport

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2015.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2015.png)

`라포`는 **상담사 매칭 서비스**입니다.

<br>

---

<br>

## UPDATE: 리팩토링

(2021.08 ~ 진행 중)

- write test code
  - commit `fbf6b`, `17457`, ...
- function names should say what they do
  - commit `e9b3f`
- update directory structure
  - commit `d674a`
  - commit `bdf42`
- remove duplicate code
  - commit `f613c`
  - commit `15bb0`
  - commit `befa6`
- only comment things that have business logic complexity
  - commit `74f59`
- function arguments(2 or fewer ideally)
  - commit `2adf7`
- eliminate useless promises
  - commit `abf24`
  - commit `4da7f`

## 진행 기간

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2015.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/schedule.png)

## 구성원

- 허익선(기획/마케팅)
- 정현우(개발)
- 신희창(개발)

## 담당 역할

- 기획 / 디자인
- 서버 구축
- 배포

## 기술 스택

- back-end: **Node.js**, **MySQL**
- dev-ops: **AWS**

## 배포

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%208.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%208.png)

## 서비스의 목적

- **자신에게 맞는** 상담사를 **쉽게** 찾을 수 있도록 도와줍니다.
- **쉽고 간편하게** 상담을 **예약**할 수 있도록 합니다.
- **공인된 자격증**을 가진 상담사를 선별합니다.
- **상담 비용**을 **투명하게 공개**합니다.

## 서비스 둘러보기

**메인 페이지**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled.png)

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%214.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2014.png)

- 라포의 브랜드 가치를 보여줍니다.
- 서비스 이용 방법을 안내합니다.

**상담사 검색 페이지**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/__.jpg](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/__.jpg)

- 라포에 등록된 상담사의 공인 자격증과 상담 비용을 확인할 수 있습니다.
- 다음과 같은 필터로 상담사를 검색할 수 있습니다.
  - 상담사의 전문 분야 / 상담 가능 지역 / 상담 가능 날짜

**상담사 자세히 보기**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%203.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%203.png)

- 상담사의 자세한 프로필을 확인할 수 있습니다.
  - 상담사 소개 / 전문 영역 / 상세 경력 / 상담 비용 / 상담 가능 지역 / 상담 가능 날짜
- 상담을 원하는 날짜와 시간을 선택하는 것만으로도 쉽게 예약할 수 있습니다.

**상담사 마이 페이지**
![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%204.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%204.png)

- 상담사는 마이 페이지에서 서비스 상 보여지는 자신의 프로필을 관리할 수 있습니다.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%205.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%205.png)

- 상담사는 마이 페이지에서 자신의 예약 가능 시간을 관리할 수 있습니다.
- 상담 가능 지역을 설정할 수 있습니다.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%206.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%206.png)

- 상담사의 예약 가능 시간 내에서 별도의 휴무 상태를 한시간 단위로 설정할 수 있습니다.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%207.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%207.png)

- 자신에게 접수된 예약 케이스를 관리할 수 있습니다.
- 각 예약 케이스의 상세 정보와 상담 신청서를 조회할 수 있습니다.

## 문서 활용

**서비스 플로우 차트**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2011.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2011.png)

- 팀원들에게 서비스의 로직을 쉽게 보여주기 위해 작성했습니다.

**API 문서**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2012.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2012.png)

- 각 엔드포인트의 사용 목적 / HTTP method / headers / 요청 및 응답 형식 / 에러 목록 / 특이사항 등에 대해 기재되어 있습니다.

**협업 문서**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2013.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2013.png)

- 프론트엔드, 백엔드 개발자 간 원활한 커뮤니케이션을 위해 작성했습니다.
- 각자 영역의 개발 진행 상황, 이슈, 요청 사항 등을 작성할 수 있습니다.

## 성과

- 한국심리학회 소속 공인 상담사 **12명** 활동

수상 및 선정

- 2019 예비창업패키지(중소벤처기업부, 창업진흥원 주관) **35,000,000원** 지원
- 2018 K-STARTUP 대학 창업유망팀 300 **최종선발팀 300** 진출
- 중앙대학교 제1회 다빈치 소프트웨어 창업캠프 **은상**
- 2018 중앙대학교 산학협력단 **창업 우수 동아리(A등급)** 선정
