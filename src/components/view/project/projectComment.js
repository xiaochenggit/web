import React , { Component } from 'react';
import $ from 'jquery';
import { Modal, message } from 'antd';
import ProjectForm from './projectForm';

const confirm = Modal.confirm;

// 是否在请求状态
let isAjax = false;

class ProjectComment extends Component {
	constructor (props) {
		super(props);
		/**
		 * @type {Array} comments 项目留言数组
		 * @type {Number} formIndex 二级回复表单位置 默认为1
		 * @type {Number} page 页码
		 * @type {Number} pageNum 每页的条目
		 * @type {Boolean} isGetComment 是否可以继续下拉加载
		 */
		this.state = {
			domain: 'http://localhost:80',
			comments: [],
			formIndex: -1,
			page: 0,
			pageNum: 5,
			isGetComment: false
		}
	}
	componentWillMount () {
		let { pageNum, page } = this.state;
		this.getCommentsList(page, pageNum);
	}
	componentDidMount () {
		// 绑定滚动事件
		let that = this;
		$(function(){
			$(window).bind('scroll',function () {
	      let { page, isGetComment, pageNum } = that.state;
	      const $this = $(this);
	      let nDivHight = $this.height();
				let nScrollHight = $(document.body).outerHeight(true);
	      let nScrollTop = $this.scrollTop();
	    	// 判断到底&&可以加载数据 && 此时没有请求数据状态
	      if(nScrollTop + nDivHight >= nScrollHight - 100 && isGetComment && !isAjax) {
	        that.getCommentsList(page + 1, pageNum);
	      }
	    })
		})
	}
	/**
	 * 获得项目留言
	 * @param  {Number} page    页码
	 * @param  {Numebr} pageNum 条目
	 */
	getCommentsList = (page, pageNum) => {
		isAjax = true
		let { projectId } = this.props;
		$.ajax({
      url: '/api/projectcomment/list',
      type: 'GET',
      data: {
        typeId: projectId,
        page,
        pageNum
      },
      success: (data) => {
        if (data.status === 200) {
        	// 添加到留言数组 改变页码 判断是否可以继续下拉加载
        	let comments = this.state.comments;
        	let opinions = data.result.opinions;
        	comments = comments.concat(opinions);
          this.setState({
            comments,
            isGetComment: opinions.length === pageNum ? true : false,
            page
          })
        }
        isAjax = false;
      }
    })
	}

	/**
   * 添加回复表单
   * @param  {Number} opinionId [一级回复id]
   * @param  {Number} toId      [回复给谁 id]
   * @param  {Number} index     [数组下标]
   */
  getToComment = (commentId, toId, index) => {
  	let { comments, formIndex } = this.state;
  	// 默认为 -1 的时候不存在回复表单 所以就不删除了
  	if (formIndex !== -1) { 
  		delete comments[formIndex]['form']
  	}
  	// 数据信息修改 此条信息里面添加表单信息
  	comments[index]['form']  = {
  		commentId,
  		toId
  	}
  	this.setState({
  		formIndex: index,
  		comments
  	});
  }
  /**
   * 是否删除留言选择框
   * @param  {Number} id      [一级 id]
   * @param  {Number} replyId [二级 id]
   * @return {[type]}         [description]
   */
  showConfirm = (id, replyId) => {
    let that = this;
    confirm({
      title: '你确定要删除该留言吗?',
      onOk() {
        that.deleteComment(id, replyId);
      }
    });
  }
  /**
   * 删除请求
   * @param  {Number} id      [一级 id]
   * @param  {Number} replyId [二级 id]
   * @return {[type]}         [description]
   */
  deleteComment = (id, replyId) => {
    $.ajax({
      url: '/api/projectcomment/delete',
      type: 'POST',
      data: { id, replyId },
      success: (data) => {
        if (data.status === 200) {
          message.success(data.msg);
          this.catDeleteComment(id, replyId);
        } else {
          message.error(data.msg);
        }
      }
    })
  }
  /**
   * 删除成功之后的操作
   * @param  {Number} id      [一级 id]
   * @param  {Number} replyId [二级 id]
   * @return {[type]}         [description]
   */
  catDeleteComment = (id, replyId) => {
  	let { comments } = this.state;
  	if (!replyId) { // 删除一级留言
  		comments.forEach((item, index) => {
  			if (item._id === id) {
  				comments.splice(index, 1);
  				return false;
  			}
  		})
  	} else { // 删除二级留言
  		comments.forEach((item, index) => {
  			if (item._id === id) {
  				comments[index].reply.forEach((element, num) => {
  					if (element._id === replyId) {
  						comments[index].reply.splice(num, 1)
  						return false;
  					}
  				});
  			}
  		})
  	}
  	this.setState({
  		comments
  	});
  }
  /**
   * 留言创建成功的回调
   * @param  {[type]} cId     回复留言的id
   * @param  {[type]} comment 留言的详细信息
   */
	createCommentAfter = (cId, comment ) => {
		let { comments, formIndex } = this.state;
		if (!cId) { // 一级
			comments.unshift(comment);
		} else { // 如果是二级
  		comments.splice(formIndex, 1, comment);
  	}
		this.setState({
			comments
		})
	}
	componentWillUnmount () {
    $(window).unbind('scroll');
  }
	render () {
		let { domain, comments } = this.state;
		let { project, user} = this.props;
		return (
			<div className="project-dialogue">
				<ul>
					{
						comments.map((item, index) => 
							<li className='project-dialogue-one' key={index}>
								<div className="user">
									<img 
										src={ domain + '/userAvatar/' + item.from.avatar }
										alt={ item.from.userName } className="user-avator"
									/>
									<p className='name'>
										<a href={'/user/detail/' + item.from._id }>
											{item.from.userName}
										</a>
									</p>
								</div>
								<div className="project-dialogue-message">
									<p className="project-dialogue-mes">{item.content}</p>
									<div className="project-dialogue-operation">
										<span className="reply" onClick={() => this.getToComment(item._id, item.from._id, index)}>回复</span>
										{
											user._id === item.from._id || user.role >= 10 || user._id === project.user._id ?
											<span className="delete" onClick={() => this.showConfirm(item._id)}>删除</span> : ''
										}
									</div>
									<ul>
										{
											item.reply.map((ele, num) =>
												<li className='project-dialogue-two' key={num}>
													<div className="user">
														<a href={'/user/detail/' + ele.from._id }>
															<img 
																src={ domain + '/userAvatar/' + ele.from.avatar } 
																alt={ ele.from.userName } className="user-avator"
															/>
														</a>
														<p className='name'>
															<a href={'/user/detail/' + ele.from._id }>
																{ ele.from.userName }
															</a>
														</p>
													</div>
													<div className="project-dialogue-message">
														<p className="project-dialogue-mes">{ ele.content }</p>
														<div className="project-dialogue-operation">
															<span className="reply" onClick={() => this.getToComment(item._id, ele.from._id, index)}>回复</span>
															{
																user._id === ele.from._id || user.role >= 10 || user._id === project.user._id ?
																<span className="delete" onClick={() => this.showConfirm(item._id, ele._id)}>删除</span> : ''
															}
														</div>
													</div>
												</li>
											)
										}
									</ul>
									{
										item.form ?
											<ProjectForm
												user={user}
												cId={item.form.commentId}
												to={item.form.toId}
												createCommentAfter={this.createCommentAfter}
											/>
										: ''
									}
								</div>
							</li>
						)
					}
				</ul>
				<ProjectForm
					user={user}
					typeId={project._id}
					createCommentAfter={this.createCommentAfter}
				/>
			</div>
		)
	}
}

export default ProjectComment;