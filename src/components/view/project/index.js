import React , { Component } from 'react';
import $ from 'jquery';
import { message } from 'antd';
import PubSub from 'pubsub-js';
import ProjectComment from './projectComment';
import './style.css';

require('moment/locale/zh-cn');
let moment = require('moment');

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
      url: '/api/project/detail',
      type: 'POST',
      data: {
        _id: projectId
      },
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
	 */
	projectCare = (_id) => {
		$.ajax({
			url: '/api/project/care',
			type: 'POST',
			data: { _id },
			success: (data) => {
				if (data.status === 200) {
					console.log('收藏项目成功!')
				} else {
					message.error(data.msg);
				}
			}
		})
	}
	/**
	 * 项目操作按钮切换状态
	 */
	oper = () => {
		this.setState({
			isOper: !this.state.isOper
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
				<div className="btn btn-primary" id="project-oper-btn" onClick={() => this.oper()}>操作 &or;</div>
				<div className={"project-oper" + (isOper ? " on" : "")} id="project-oper">
					<ul>
						<li onClick={() => this.projectCare(project._id)}>收藏</li>
						<li>下载附件</li>
					</ul>
				</div>
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
		</div>
		<div className="project-intr">{ project.content }</div>
		<ProjectComment 
			user={user}
			projectId={project._id}
			project={project}
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