import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import { Card, Modal, message } from 'antd';
require('moment/locale/zh-cn');

let moment = require('moment');
const confirm = Modal.confirm;

class CommentList extends Component {
  // 确认删除
  showConfirm = (id) => {
    let that = this;
    confirm({
      title: '你确定要删除该留言吗?',
      onOk() {
        that.deleteUserComment(id);
      }
    });
  }
  // 删除留言
  deleteUserComment = (id) => {
    $.ajax({
      url: '/api/usercomment/delete',
      type: 'POST',
      data: {
        id
      },
      success: (data) => {
        if (data.status === 200) {
          message.success(data.msg);
          this.props.deleteUserComment(id);
        } else {
          message.error(data.msg);
        }
      }
    })
  }
  render () {
    let lookUserId = this.props.lookUserId;
    let user = this.props.user;
    let commentList = this.props.commentList;
    let html = commentList.length > 0 ? 
    commentList.map((item, index) => 
    <Card 
      title={<Link to={'/user/detail/' + item.from._id}>{item.from.userName}</Link>} 
      extra={moment((item.createTime)).fromNow()} bordered={true} key={index}>
      <p>{item.content}</p>
      <span className='operation'>
        {<span className='iconfont icon-liuyan'></span>}
        {/* 判断权限 */}
        {
          lookUserId === user._id || user._id === item.from._id || user.role > 0 ?
          <span className='iconfont icon-shanchu' onClick={() => this.showConfirm(item._id)}></span>
          : ''
        }
      </span>
    </Card>
    )
    : '暂无评论';
    return (
      <div className='userCommentList'>
        {html}
      </div>
    )
  }  
}

export default CommentList;