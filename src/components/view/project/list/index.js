import React , { Component } from 'react';
import $ from 'jquery';
import './style.css';

require('moment/locale/zh-cn');
let moment = require('moment');

class ProjectList extends Component {

	constructor (props) {
		super(props);
		/**
		 * @type {Array} projects 项目数组
		 */
		this.state = {
			domain: 'http://localhost:80',
			projects: []
		}
	}
	componentWillMount () {
		this.getProjectList()
	}
	/**
	 * 跳转到对应的项目页面
	 * @param  {String} _id [项目id]
	 * @return {[type]}     [description]
	 */
	reLinkDetail = (_id) => {
		this.props.history.push('/project/detail/' + _id);
	}
	/**
	 * 获得项目列表数组
	 */
	getProjectList = () => {
		$.ajax({
			url: '/api/project/list',
			type: 'GET',
			success: (data) => {
				if (data.status === 200) {
					this.setState({
						projects: data.result.projects
					})
				}
			}
		})
	}
	render () {
		let { projects, domain } = this.state;
		let projectsHTML = projects.length > 0 ? 
			projects.map((item, index) =>
				<div className="project-list-box" key={index} onClick={() => this.reLinkDetail(item._id)}>
					<div className="project-des">
						<div className="project-user">
							<div className="project-user-avator">
								<img 
									src={ domain + '/userAvatar/' + item.user.avatar }
									alt={ item.user.userName }
									className="avator"
								/>
							</div>
							<div className="project-user-des">
								<p className="name">{ item.user.userName }</p>
								<p className="time">Time：<span>{ moment(item.createTime).format('YYYY.MM.DD') }</span></p>
							</div>
						</div>
						<h2 className="project-name">{ item.name }</h2>
						<div className="project-content">{ item.content }</div>
						<div className="project-oper">
							<p className="fl overtime">截止日期：<span>{ moment(item.time).format('YYYY.MM.DD') }</span></p>
							<span className="btn btn-primary btn-xs fr">{ item.schedule }</span>
						</div>
					</div>
				</div>
			)
		: '暂无项目'
		return (
				<div className='public'>
					<div className="project-list public">
						{ projectsHTML }
					</div>
				</div>
			)
	}
}

export default ProjectList;