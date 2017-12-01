import React , { Component } from 'react';
import { Button, Card, Avatar, message, Modal } from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import MsgForm from './msgForm';
import PubSub from 'pubsub-js';
import './style.css';
require('moment/locale/zh-cn');
let moment = require('moment');
const confirm = Modal.confirm;
// 回复组件

let isAjax = false;
class MsgComment extends Component {
	constructor (props) {
		super(props);
		/**
		 * @type {Array} comments 回复组件的数组
		 */
		this.state = {
			domain: 'http://localhost:80',
			comments: [],
			page: this.props.page,
			pageNum: this.props.pageNum,
			typeId: this.props.typeId,
			isGetComment: true,
			formIndex: -1
		}
	}
	componentWillMount () {
		let { pageNum, page } = this.state;
		this.getComments(page, pageNum);
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
	        that.getComments(page + 1, pageNum);
	      }
	    })
		})
	}
	/**
	 * 请求数据 意见数据
	 * @param  {Number} page    [页码]
	 * @param  {Number} pageNum [条目]
	 */
	getComments= (page, pageNum) => {
		let { comments, typeId } = this.state;
		isAjax = true;
		$.ajax({
			url: this.props.listURL,
			type: 'GET',
			data: { typeId, page, pageNum },
			success: (data) => {
				if (data.status === 200) {
					// 成功之后添加数据 判断是否还可以请求数据
					let newComments = data.result.opinions;
					comments = comments.concat(newComments) 
					this.setState({
						comments,
						isGetComment: newComments.length === pageNum,
						page
					});
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
  	if (!this.props.user._id) {
			return this.Login();
		}
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
  	})
  }
  /**
   * [回复成功之后的操作]
   * @param  {Striing} cId     [二级回复会有值，一级回复没有值]
   * @param  {Object} opinion [此条留言数据]
   */
  createSuccess = (cId, comment) => {
  	let { comments, formIndex } = this.state;
  	if (!cId) { // 如果是一级
  		comments.unshift(comment);
  	} else { // 如果是二级
  		comments.splice(formIndex, 1, comment);
  	}
  	this.setState({
  		comments
  	})
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
      url: this.props.deleteURL,
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
	Login = () => {
		PubSub.publish('userLogin');
	}
	componentWillUnmount () {
    $(window).unbind('scroll');
  }
	render() {
		let { user, typeId, createURL } = this.props;
		let { comments, domain } = this.state;
		let msgFormHTML = user._id ? 
		<MsgForm
			typeId={typeId}
			success={this.createSuccess}
			url={createURL}
		/>
		: <Button type="primary" onClick={this.Login}>请先登录</Button>;
		// 列表区域
		let commentHtml = comments.length > 0 ? 
    comments.map((item, index) => 
	    // 主留言
	    <Card 
	      title={
	        <Link to={'/user/detail/' + item.from._id}>
	          <Avatar src={domain + '/userAvatar/'+ (item.from.avatar ? item.from.avatar : 'user.a1f8e6e5.png') } />
	          {item.from.userName}
	          <span className={'iconfont icon-' + item.from.sex}></span>
	        </Link>} 
	      extra={moment((item.createTime)).fromNow()} bordered={true} key={index}
	      className='listOne'
	      >
	      <div className='content'>
	        <p className='one'>{item.content}
	          <span className='operation'>
	            {
	              <span 
	                className='iconfont icon-liuyan' 
	                onClick={() => this.getToComment(item._id, item.from._id, index)}>
	              </span>
	            }
	            {/* 判断权限 */}
	            {
	              user._id === item.from._id || user.role > 0 ?
	              <span className='iconfont icon-shanchu' onClick={() => this.showConfirm(item._id)}></span>
	              : ''
	            }
	          </span>
	        </p>
	        {/* 回复 */}
	      	{item.reply.map((cont, count) => 
		        <Card title={
		            <span>
		              <Link to={'/user/detail/' + cont.from._id}>
		              <Avatar src={domain + '/userAvatar/'+ (cont.from.avatar ? cont.from.avatar : 'user.a1f8e6e5.png') } />
		                {cont.from.userName}
		                <span className={'iconfont icon-' + cont.from.sex}></span>
		              </Link>
		              &nbsp;回复:&nbsp;
		              <Link to={'/user/detail/' + cont.to._id}>
		              <Avatar src={domain + '/userAvatar/'+ (cont.to.avatar ? cont.to.avatar : 'user.a1f8e6e5.png') } />
		                {cont.to.userName}
		                <span className={'iconfont icon-' + cont.to.sex}></span>
		              </Link>
		            </span>
		          }
		          extra={moment((cont.createTime)).fromNow()} bordered={true} key={count}
		          className='listTwo'
		          >
		          <div className='content'>
		            <p className='two'>{cont.content}
		            <span className='operation'>
		              {
		                <span 
		                  className='iconfont icon-liuyan' 
		                  onClick={() => this.getToComment(item._id, cont.from._id, index)}>
		                </span>
		              }
		              {/* 判断权限 */}
		              {
		                user._id === cont.from._id || user.role > 0 ?
		                <span className='iconfont icon-shanchu' 
		                  onClick={() => this.showConfirm(item._id, cont._id)}>
		                </span>
		                : ''
		              }
		            </span>
		            </p>
		          </div>
		        </Card>
	        )}
	      	{/*二级form*/}
	        {
	        	item.form && user._id ? 
	        	<MsgForm
	        		cId={item.form.commentId}
	        		to={item.form.toId}
							success={this.createSuccess}
							url={createURL}
						/> : ''
	        }
	      </div>
	    </Card>
    )
    : '暂无评论';
		return (
			<div className='msgComment'>
				<div className='msgForm'>
					{msgFormHTML}
				</div>
				<div className='userCommentList'>
					{commentHtml}
				</div>
			</div>
		)
	}
}

export default MsgComment;