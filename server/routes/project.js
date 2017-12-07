var express = require('express');
var router = express.Router();
let Project = require('../models/project');
let User = require('../models/user');

// 项目类型要与前端对应
const TYPE = {
	xcx: '小程序',
	h5: 'h5',
	app: 'APP',
	android: 'Android',
	qd: '前端',
	php: 'PHP'
}
router.post('/create', (req, res, next) => {
	let data = req.body;
	let cookieUser = req.session.user;
	if (cookieUser) {
		if (!data._id) { // 判断是否是修改
			data.user = cookieUser._id;
			data.type = TYPE[data.type]; // 添加对应的类型
			let newProject = new Project(data);
			newProject.save((err, project) => {
				// 项目人添加项目到 createProjects
				User.findOne({_id: cookieUser._id }, (err, user) => {
					console.log(user);
					if (user) {
						user.createProjects.unshift({ 
							project: project._id,
							time: new Date().getTime() 
						});
						user.save();
					}
				})
				res.json({
					status: 200,
					msg: '创建项目成功',
					result: {
						project
					}
				})
			})
		}
	} else {
		res.json({ status: 201, msg: '请先登录' });
	}
});

// 获得项目列表
router.get('/list', (req, res, next) => {
	Project.find({})
	.populate({path: "user", select: 'sex userName avatar role'})
	.exec((err, projects) => {
		if (err) {
			res.json({ status: 401, msg: err.message });
		} else {
			res.json({ 
				status: 200, 
				msg: '获取项目列表成功',
				result: {
					projects
				}
			})
		}
	})
})

// 获得项目详情
router.post('/detail', (req, res, next) => {
	let { _id } = req.body;
	Project.findOne({_id})
	.populate({path: "user", select: 'sex userName avatar role'})
	.exec((err, project) => {
		if (err) {
			res.json({ status: 401, msg: err.message });
		} else {
			if (project) {
				res.json({ 
					status: 200, 
					msg: '获取项目列表成功',
					result: {
						project
					}
				})
			} else {
				res.json({status: 201, msg: '没有找到该项目!'});
			}
		}
	})
})

router.post('/care', (req, res, next) => {
	let { _id } = req.body;
	let cookieUser = req.session.user;
	if (cookieUser) {
		Project.findOne({_id})
		.exec((err, project) => {
			if (err) {
				res.json({ status: 401, msg: err.message })
			} else {
				if (project) {
					// 用户收藏的项目列表 添加项目
					User.findOne({_id: cookieUser._id},(err, user) => {
						user.careProjects.forEach((item, index) => {
							if ((item.project + "") == (project._id + "")) {
								console.log("1");
								user.careProjects.splice(index, 1)
								return;
							}
						});
						user.careProjects.unshift({
							project: project._id,
							time: new Date().getTime()
						});
						user.save();
					})
					// 项目收藏者列表 添加用户
					project.careUsers.forEach((item, index) => {
						if (item.user == cookieUser._id) {
							project.careUsers.splice(index, 1)
							return;
						}
					});
					project.careUsers.unshift({
						user: cookieUser._id,
						time: new Date().getTime()
					});
					project.save(() => {
						res.json({
							status: 200,
							msg: '收藏项目成功!'
						})
					})
				} else {
					res.json({ status: 202, msg: '没有此项目' })
				}
			}
		})
	} else {
		res.json({ status: 201, msg: '请先登录!' })
	}
	
})


module.exports = router;