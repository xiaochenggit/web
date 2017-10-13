let express = require('express');
let router = express.Router();
let ArticleCategory = require('../models/articleCategory');

// 获得信息

router.get('/create', (req, res, next) => {
  let cookieUser = req.session.user;
  if (cookieUser && cookieUser.role >= 10) {
    ArticleCategory.find({}, (err, artCates) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else {
        res.json({
          status: 200,
          msg: '获得文章分类信息成功!',
          result: {
            articleCategories: artCates
          }
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '没有权限!'
    })
  }
});

// 创建分类
router.post('/create', (req, res, next) => {
  let cookieUser = req.session.user;
  if (cookieUser && cookieUser.role >= 10) {
    ArticleCategory.findOne({name: req.body.name} , (err, artCate) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else {
        if (artCate) {
          res.json({
            status: 202,
            msg: '文章分类已经存在!'
          })
        } else {
          let newArticleCategory = new ArticleCategory({
            ...req.body,
            createTime: new Date().getTime()
          });
          newArticleCategory.save(()=> {
            res.json({
              status: 200,
              msg: '文章分类创建成功！'
            })
          })
        }
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '没有权限!'
    })
  }
})
router.post('/delete', (req, res, next) => {
  let cookieUser = req.session.user;
  if (cookieUser && cookieUser.role >= 10) {
    ArticleCategory.remove({_id: req.body._id}, (err) => {
      if (err) {
        res.json({
          status: 401,
          msg: err.message
        })
      } else {
        res.json({
          status: 200,
          msg: '删除分类成功！'
        })
      }
    })
  } else {
    res.json({
      status: 201,
      msg: '没有权限!'
    })
  }
});
module.exports = router;