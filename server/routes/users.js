let express = require('express');
let router = express.Router();
let User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 登录
router.post('/login', (req, res, next) => {
  let user = {
    userName: req.body.userName,
    password: req.body.password
  };
  User.findOne(user, (err, user) => {
    if (err) {
      res.json({
        status: 400,
        msg: err.message
      })
    } else {
      if (user) {
        req.session.user = user;
        // 写入 cookie
        // res.cookie('persernalweb', JSON.stringify(cookieUser), {
        //   path: '/',
        //   maxAge: 1000 * 60 * 60 * 1
        // })
        res.json({
          status: 200,
          msg: '登录成功!',
          result: {
            userName: user.userName,
            _id: user._id
          }
        })
      } else {
        res.json({
          status: 201,
          msg: '账号或密码错误！'
        })
      }
    }
  })
});

// 验证登录 
router.get('/cheklogin', (req, res, next) => {
  let user = req.session.user;
  if (user) {
    res.json({
      status: 200,
      msg: '已登录!',
      result: {
        userName: user.userName,
        _id: user._id
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '未登录!'
    })
  }
});
module.exports = router;
