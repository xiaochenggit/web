import React , { Component } from 'react';
import PubSub from 'pubsub-js';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import { Button, Card, Avatar, message, Modal } from 'antd';
import OpinionForm from './OpinionForm';
import './style.css';
require('moment/locale/zh-cn');
let moment = require('moment');
const confirm = Modal.confirm;
let isAjax = false; // 是否处于请求状态
class Opinion extends Component {
	constructor () {
		super();
		/**
		 * @type {Object} user 用戶對象
		 * @type {Array} opinions 意见数组
		 * @type {String} domain 服务器地址
		 * @type {Number} formIndex 回复表单位置 默认为-1
		 * @type {Number} page 页码
		 * @type {Number} pageNum 每页的数据条数
		 * @type {Boolean} isGetOpinion 是否还可以多加载意见 默认true
		 */
		this.state = {
			user: {},
			opinions: [],
			domain: 'http://localhost:80',
			formIndex: -1,
			page: 0,
			pageNum: 5,
			isGetOpinion: true
		}
	}
	componentWillMount () {
		// 监控 用户的登录状态!
    PubSub.subscribe("changeUserOpinion", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
    let { page, pageNum} = this.state;
    this.getOpinions(page, pageNum);
	}
	componentDidMount () {
		// 绑定滚动事件
		let that = this;
		$(function(){
			$(window).bind('scroll',function () {
	      let { page, isGetOpinion, pageNum } = that.state;
	      const $this = $(this);
	      let nDivHight = $this.height();
				let nScrollHight = $(document.body).outerHeight(true);
	      let nScrollTop = $this.scrollTop();
	    	// 判断到底&&可以加载数据 && 此时没有请求数据状态
	      if(nScrollTop + nDivHight >= nScrollHight - 100 && isGetOpinion && !isAjax) {
	        that.getOpinions(page + 1, pageNum);
	      }
	    })
		})
	}
	/**
	 * 请求数据 意见数据
	 * @param  {Number} page    [页码]
	 * @param  {Number} pageNum [条目]
	 */
	getOpinions = (page, pageNum) => {
		isAjax = true;
		let { opinions } = this.state;
		$.ajax({
			url: '/api/opinion/list',
			type: 'GET',
			data: { page, pageNum },
			success: (data) => {
				if (data.status == 200) {
					// 成功之后添加数据 判断是否还可以请求数据
					let newOpinions = data.result.opinions;
					opinions = opinions.concat(newOpinions) 
					this.setState({
						opinions: opinions,
						isGetOpinion: newOpinions.length == pageNum,
						page
					});
				}
				isAjax = false;
			}
		})
	}
  /**
   * [触发登录]
   */
  Login = () => {
  	PubSub.publish('userLogin');
  }
  /**
   * [回复成功之后的操作]
   * @param  {Striing} cId     [二级回复会有值，一级回复没有值]
   * @param  {Object} opinion [此条留言数据]
   */
  opinionCreateSuccess = (cId, opinion) => {
  	let { opinions, formIndex } = this.state;
  	if (!cId) { // 如果是一级
  		opinions.unshift(opinion);
  	} else { // 如果是二级
  		opinions.splice(formIndex, 1, opinion);
  	}
  	this.setState({
  		opinions
  	})
  }
  /**
   * 添加回复表单
   * @param  {Number} opinionId [一级回复id]
   * @param  {Number} toId      [回复给谁 id]
   * @param  {Number} index     [数组下标]
   */
  getToComment = (opinionId, toId, index) => {
  	let { opinions, formIndex } = this.state;
  	// 默认为 -1 的时候不存在回复表单 所以就不删除了
  	if (formIndex !== -1) { 
  		delete opinions[formIndex]['form']
  	}
  	// 数据信息修改 此条信息里面添加表单信息
  	opinions[index]['form']  = {
  		opinionId,
  		toId
  	}
  	this.setState({
  		formIndex: index,
  		opinions
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
        that.deleteOpinion(id, replyId);
      }
    });
  }
  /**
   * 删除请求
   * @param  {Number} id      [一级 id]
   * @param  {Number} replyId [二级 id]
   * @return {[type]}         [description]
   */
  deleteOpinion = (id, replyId) => {
    $.ajax({
      url: '/api/opinion/delete',
      type: 'POST',
      data: { id, replyId },
      success: (data) => {
        if (data.status === 200) {
          message.success(data.msg);
          this.catdeleteOpinion(id, replyId);
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
  catdeleteOpinion = (id, replyId) => {
  	let { opinions } = this.state;
  	if (!replyId) { // 删除一级留言
  		opinions.forEach((item, index) => {
  			if (item._id == id) {
  				opinions.splice(index, 1);
  				return false;
  			}
  		})
  	} else { // 删除二级留言
  		opinions.forEach((item, index) => {
  			if (item._id == id) {
  				opinions[index].reply.forEach((element, num) => {
  					if (element._id == replyId) {
  						opinions[index].reply.splice(num, 1)
  						return false;
  					}
  				});
  			}
  		})
  	}
  	this.setState({
  		opinions
  	});
  }
  componentWillUnmount () {
    PubSub.unsubscribe('changeUserOpinion');
    $(window).unbind('scroll');
  }
	render () {
		let { user, opinions, domain } = this.state;
		let OpinionFormHTML = 
			user._id ? 
			<OpinionForm 
				success={this.opinionCreateSuccess}
			/>
			: <Button type="primary" onClick={this.Login}>请先登录</Button>;
		let opinionHtml = opinions.length > 0 ? 
    opinions.map((item, index) => 
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
	        	<OpinionForm
	        		cId={item.form.opinionId}
	        		to={item.form.toId}
							success={this.opinionCreateSuccess}
						/> : ''
	        }
	      </div>
	    </Card>
    )
    : '暂无评论';
		return(
			<div className='opinion'>
				<div className='public'>
					<div className='inner'>
						<h2>留下你的意见吧!</h2>
						<div className='opinionList userCommentList'>
							{opinionHtml}
						</div>
						<div className='opinionForm'>
							{OpinionFormHTML}
						</div>
					</div>
				</div>
			</div>
		)
	}

}

export default Opinion;