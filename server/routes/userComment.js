let express = require('express');
let router = express.Router();
let UserComment = require('../models/userComment');


// 获取留言
router.post('/getlist', (req, res, next) => {
  let user = req.body.user;
  if (user) {
    UserComment.find({user})
    .populate({path: 'user from', select: 'userName sex' })
    .exec((err, userComments) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else {
        res.json({
          status: 200,
          msg: '获取留言成功!',
          result:  userComments
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '用户不存在获取信息失败!'
    });
  }
});
// 留言创建
router.post('/create', (req, res, next) => {
  let cookieUser = req.session.user;
  if (cookieUser) {
    let userComment = {
      ...req.body,
      from: cookieUser._id, 
      createTime: new Date().getTime()
    }
    let newUserComment = new UserComment(userComment);
    newUserComment.save((err) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        });
      } else {
        res.json({
          status: 200,
          msg: '留言成功!'
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '请用户登录!'
    })
  }
});
module.exports = router;