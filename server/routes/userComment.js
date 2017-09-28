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
// 删除留言
router.post('/delete', (req, res, next) => {
  let cookieUser = req.session.user;
  let _id = req.body.id;
  if (cookieUser) { // 判断有没有登录
    UserComment.findOne({_id}, (err, usercomment) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else{
        if (usercomment) { // 是否存在该留言
          if (cookieUser._id == usercomment.user 
            || cookieUser.role > 0 
            || cookieUser._id == usercomment.from) { // 权限问题
            UserComment.remove({_id}, () => {
              res.json({
                status: 200,
                msg: '删除留言成功!'
              });
            })
          } else {
            res.json({
              status: 201,
              msg: '你没有权限删除该留言!'
            })
          }
        } else {
          res.json({
            status: 201,
            msg: '该留言已经删除!'
          })
        }
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '请先登录!'
    });
  }
})
module.exports = router;