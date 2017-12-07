import React , { Component } from 'react';
import $ from 'jquery';
import { message } from 'antd';
import PubSub from 'pubsub-js';

class ProjectForm extends Component {
	constructor () {
		super();
		/**
		 * @type {String} content 回复内容
		 */
		this.state = {
			content: ''
		}
	}
	/**
	 * 创建项目留言
	 */
	createComment = () => {
		let { content } = this.state;
		if (!content.trim()) {
			return message.error('评论不能为空!');
		}
		let { typeId, cId, to, createCommentAfter } = this.props;
		$.ajax({
			url: '/api/projectcomment/create',
			type: 'POST',
			data: {
				typeId,
				content,
				cId,
				to
			},
			success: (data) => {
				if (data.status === 200) {
					createCommentAfter(cId,data.result.opinion);
					this.setState({
						content: ''
					})
					if (!cId) { // 一级表单回复成功之后清除内容获得焦点
						this.text.value = "";
						this.text.focus();
					}
				} else {
					message.error(data.msg)
				}
			}
		})
	}
	/**
	 * 内容编写
	 */
	changeContent = (event) => {
		this.setState({
			content: event.target.value
		})
	}

	login = () => {
		PubSub.publish('userLogin');
	}
	/**
	 * 清除表单默认提交事件
	 */
	submit = (event) => {
		event.preventDefault();
	}
	render () {
		let { user, content } = this.props;
		return (
				<div className="project-dialogue-from">
					<form id="project-dialogue-from" onSubmit={this.submit}>
						<input 
							placeholder="请输入内容"
							type="text"
							className="text"
							name="content"
							value={content}
							onChange={this.changeContent}
							ref={ content => this.text = content }
						/>
						{
							user._id ? 
							<button
								type="button"
								className="btn btn-primary"
								onClick={this.createComment}
							>确认</button> :
							<button type="button" className="btn btn-primary" onClick={this.login}>请先登录</button>
						}
					</form>
				</div>
			)
	}
}

export default ProjectForm;