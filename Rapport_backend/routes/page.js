/**
 * isLoggedIn, isNotLoggedIn 구현
 * 검색필터, 기본값 최신순 설정 등 구현
 * (req, res, next)에서 next의 자세한 역할 알아보고, 불필요한 next 제거하기(혹은 req나 res도?)
 */
const express = require('express');
const { Counselor, Case } = require('../models');

const router = express.Router();

/* 일반 사용자 회원가입 페이지 */
router.get('/join/user', (req, res, next) => {
  res.render('join_user');
});

/* 상담사 회원가입(등록) 페이지 */
router.get('/join/counselor', (req, res, next) => {
  res.render('join_counselor');
});

/* 메인 페이지 */
router.get('/', async (req, res, next) => {
  try{
    let counselorList = await Counselor.findAll({})  
  res.render('main', {
    user: req.user,
    counselorList
  });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* GET '/logout' : 로그아웃 */
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;