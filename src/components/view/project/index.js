import React , { Component } from 'react';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { message, Tooltip , Button , Modal} from 'antd';
import PubSub from 'pubsub-js';
import ProjectComment from './projectComment';
import './style.css';

require('moment/locale/zh-cn');
let moment = require('moment');
const confirm = Modal.confirm;

class Project extends Component {
	constructor (props) {
		super(props);
		/**
		 * @type {String} projectId 项目的id
		 * @type {Object} project 项目信息
		 * @type {Object} user 当前用户的信息
		 * @type {Boolean} isOper 操作是否下拉
		 */
		this.state = {
			domain: 'http://localhost:80',
			projectId: this.props.match.params.projectId,
			project: {},
			user: {},
			isOper: false,
		}
	}
	componentWillMount () {
		this.getProjectDetail();
		// 监控 用户的登录状态!
    PubSub.subscribe("changeUserProjectDetail", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
	}
	/**
	 * 获得项目的详细信息
	 */
	getProjectDetail = () => {
		let { projectId } = this.state;
    $.ajax({
      url: '/api/project/detail?projectId=' + projectId,
      type: 'GET',
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            project: data.result.project
          })
        } else { // 获取不到跳转到首页
          this.props.history.push('/')
        }
      }
    })
	}
	/**
	 * 项目收藏
	 * @param  {String} _id [项目id]
	 * @param {String} cancel 取消
	 */
	projectCare = (_id,cancel) => {
		$.ajax({
			url: '/api/project/care',
			type: 'POST',
			data: { _id, cancel },
			success: (data) => {
				if (data.status === 200) {
					this.getProjectDetail();
				} else {
					message.error(data.msg);
				}
			}
		})
	}
	/**
	 * 判断用户是否收藏了该项目
	 * @param  {Array} careUsers  收藏数组
	 * @param  {Number} userId    用户ID
	 * @return {Boolean}   				false 为没有收藏 true收藏
	 */
	isCareProject = (careUsers,userId) => {
		let isCare = false;
		careUsers.forEach((item, index) => {
			if (item.user === userId) {
				isCare = true;
				return;
			}
		})
		return isCare;
	}
	/**
	 * 项目操作按钮切换状态
	 */
	oper = () => {
		this.setState({
			isOper: !this.state.isOper
		})
	}
	/**
	 * 设置项目承接人 成功之后回调
	 * @param  {Number} projectId 项目id
	 * @param  {Number} userId    用户id
	 * @param {String} cancel 是否取消，有值的时候代表取消
	 */
	setEndUser = (projectId, userId, cancel) => {
		$.ajax({
			url: '/api/project/setenduser',
			type: 'POST',
			data: { projectId, userId , cancel},
			success: (data) => {
				if (data.status === 200) {
					this.getProjectDetail();
				} else {
					message.error(data.msg);
				}
			}
		})
	}
	/**
	 * 删除结单人确认选择框
	 */
	showConfirm = (projectId, userId, cancel) => {
		let { user, project } = this.state;
		if (project.user._id != user._id) {
			return;
		}
		let that = this;
	  confirm({
	    title: '你确定要删除该接单人吗?',
	    content: '删除后不可恢复！',
	    onOk() {
	      that.setEndUser(projectId, userId, cancel)
	    },
	    onCancel() {},
	  });
	}
	/**
	 * 删除项目
	 * @param  {Number} projectId 项目id
	 * 成功之后跳转到,列表页面
	 */
	deleteProject = (projectId) => {
		$.ajax({
			url: '/api/project/delete',
			type: 'POST',
			data: { projectId },
			success: (data) => {
				if (data.status) {
					this.props.history.push('/project/list');
				} else {
					message.error(data.msg);
				}
			}
		})
	}
	componentWillUnmount () {
    PubSub.unsubscribe('changeUserProjectDetail');
  }
	render () {
		let { project, domain, isOper, user } = this.state;
		let projectHTML = project._id ?
		<div className="project-market">
		<div className="project-market-top">
			<div className="user-img">
				<a href={'/user/detail/' + project.user._id }>
					<img 
						src={ domain + '/userAvatar/' + project.user.avatar }
						alt="头像" className="user-avator"
					/>
				</a>
			</div>
			<div className="project-message">
				<p className="name">
					<a href={'/user/detail/' + project.user._id }>{ project.user.userName }</a>
				</p>
				<p className="time">Time: { moment(project.createTime).format('YYYY.MM.DD') }</p>
			</div>
			<div className="project-operation">
				{
					isOper ? 
					<div className="btn btn-primary" onClick={() => this.oper()}>操作 &and;</div>
					:
					<div className="btn btn-primary" onClick={() => this.oper()}>操作 &or;</div>
				}
				
				{
					isOper ? 
					<div className="project-oper" id="project-oper">
						{
							user._id == project.user._id ?
							<ul>
								{
									project.isOverdue ? "": 
									<li>
										<Link
											to={'/project/create?projectId=' + project._id }>
											修改
										</Link>
									</li>
								}
								<li onClick={() => this.deleteProject(project._id)}>删除</li>
							</ul>
							: 
							<ul>
								{
									this.isCareProject(project.careUsers, user._id) ? 
									<li onClick={() => this.projectCare(project._id, 'cancel')}>已收藏</li>
									: 
									<li onClick={() => this.projectCare(project._id)}>收藏</li>
								}
								<li>下载附件</li>
							</ul>
						}
					</div>: ''
				}
			</div>
		</div>
		<div className="project-theme">
			<div className="btn btn-primary btn-small">{ project.type }</div>
			<p className="project-theme-name">{ project.name }</p>
		</div>
		<div className="project-des">
			<dl>
				<dt>预&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;算：</dt>
				<dd className="project-budget">{ project.budget }<span className="money">￥</span><span className='btn btn-xs btn-primary'>有附件</span></dd>
			</dl>
			<dl>
				<dt>交付日期：</dt>
				<dd>{ moment(project.time).format('YYYY.MM.DD') }</dd>
				<dt>联系方式：</dt>
				<dd>{ project.concat }</dd>
			</dl>
			<dl>
				{
					project.endUser ? 
					<Tooltip title={project.endUser.userName}>
						<Button type="primary" onClick={() => this.showConfirm(project._id,project.endUser._id,'cancel')}>已结单</Button>
					</Tooltip>
					: ''
				}
				{
					project.isOverdue ? 
					<Button type="danger">已过期</Button>
					: ''
				}
			</dl>
		</div>
		<div className="project-intr">{ project.content }</div>
		<ProjectComment 
			user={user}
			projectId={project._id}
			project={project}
			setEndUser={this.setEndUser}
		/>
		</div>:
		<div className="project-market">正在加载</div>
		return (
				<div className='public'>
					{ projectHTML }
				</div>
			)
	}
}

export default Project;