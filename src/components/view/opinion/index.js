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

class Opinion extends Component {
	constructor () {
		super();
		this.state = {
			user: {},
			opinions: [],
			domain: 'http://localhost:80',
			formIndex: -1
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
    this.getOpinions();
	}
	// 获得 options 列表
	getOpinions = () => {
		$.ajax({
			url: '/api/opinion/list',
			type: 'GET',
			success: (data) => {
				if (data.status == 200) {
					this.setState({
						opinions: data.result.opinions
					});
				}
			}
		})
	}
	componentWillUnmount () {
    PubSub.unsubscribe('changeUserOpinion');
  }
  Login = () => {
  	PubSub.publish('userLogin');
  }
  // 回复成功之后的数组操作
  opinionCreateSuccess = (cId, opinion) => {
  	let { opinions, formIndex } = this.state;
  	if (!cId) { // 如果是一级
  		opinions.unshift(opinion);
	  	this.setState({
	  		opinions
	  	})
  	} else { // 如果是二级
  		opinions.splice(formIndex, 1, opinion);
	  	this.setState({
	  		opinions
	  	})
  	}
  }
  // 添加回复form 表单
  getToComment = (opinionId, toId, index) => {
  	let { opinions, formIndex } = this.state;
  	if (formIndex !== -1) { // 存在的时候 先删除 后添加
  		delete opinions[formIndex]['form']
  	}
  	opinions[index]['form']  = {
  		opinionId,
  		toId
  	}
  	this.setState({
  		formIndex: index,
  		opinions
  	})
  }
  // 确认删除
  showConfirm = (id, replyId) => {
    let that = this;
    confirm({
      title: '你确定要删除该留言吗?',
      onOk() {
        that.deleteOpinion(id, replyId);
      }
    });
  }
  // 删除留言
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
  // 删除留言成功之后 的数组操作
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