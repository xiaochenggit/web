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
        user.loadTime = new Date().getTime();
        user.save((err, user) => {
          res.json({
            status: 200,
            msg: '登录成功!',
            result: {
              userName: user.userName,
              _id: user._id,
              role: user.role
            }
          })
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
    User.findOne({_id: user._id}, (err, user) => {
      if (user) {
        user.loadTime = new Date().getTime();
        user.save((err, user) => {
          res.json({
            status: 200,
            msg: '已登录!',
            result: {
              userName: user.userName,
              _id: user._id,
              role: user.role
            }
          })
        })
      } else {
        res.json({
          status: 201,
          msg: '未登录!'
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '未登录!'
    })
  }
});

// 登出
router.get('/logout', (req, res, next) => {
   req.session.user = '';
   res.json({
     status: 200,
     msg: '登出成功!'
   })
})
// 注册
router.post('/register', (req, res, next) => {
  let userPost = {...req.body};
  if (!userPost.userName.trim() || !userPost.password.trim()) {
    res.json({
      status: 201,
      msg: '账号密码不能为空!'
    })
  }
  User.findOne({
    userName: userPost.userName
  }, (err, user) => {
    if (err) {
      res.json({
        status: 401,
        msg: err.message
      })
    } else {
      if (user) {
        res.json({
          status: 201,
          msg: '用户名已被占用!'
        })
      } else {
        userPost.createTime = userPost.loadTime = new Date().getTime();
        let newUser = new User(userPost);
        newUser.save((err, user) => {
          if (err) {
            res.json({
              status: 401,
              msg: err.message
            })
          } else {
            req.session.user = user;
            res.json({
              status: 200,
              msg: '注册成功!',
              result: {
                userName: user.userName,
                _id: user._id,
                role: user.role
              }
            })
          }
        })
      }
    }
  });
});

// 获得用户详情
router.post('/detail', (req, res, next) => {
  let _id = req.body.userId;
  User.findById({ _id }, (err, user) => {
    if (err) {
      res.json({
        status: 401,
        msg: err.message
      })
    } else {
      if (user) {
        res.json({
          status: 200,
          msg: '获得用户数据成功!',
          result: {
            user: user,
            isSelf: user._id == req.session.user._id
          }
        })
      } else {
        res.json({
          status: 201,
          msg: '未获得用户数据!'
        })
      }
    }
  })
});


// 用户列表
router.get('/list', (req, res, next) => {
  let user = req.session.user;
  if (user && user.role > 0) {
    User.find({}, (err, users) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else {
        res.json({
          status: 200,
          msg: '获得用户列表成功！',
          result: users
        });
      }
    });
  } else {
    res.json({
      status: 201,
      msg: '用户未登录或权限不够!'
    })
  }
})

// 删除用户
router.post('/delete', (req, res, next) => {
  let cookieUser = req.session.user;
  let _id = req.body.id;
  console.log(_id);
  if (cookieUser && cookieUser.role > 0) {
    User.remove({_id}, (err) => {
      if (err) {
        res.json({
          status: 401,
          msg: '删除用户出错!'
        })
      } else {
        res.json({
          status: 200,
          msg: '删除用户成功!'
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '没有权限删除此用户!'
    });
  }
});
module.exports = router;