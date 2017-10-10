import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import { Card, Modal, message, Pagination } from 'antd';
require('moment/locale/zh-cn');

let moment = require('moment');
const confirm = Modal.confirm;

class CommentList extends Component {
  constructor (props) {
    super(props);
    /**
     * {Array} commentListArray 当前留言数组
     * {Number} pageSize 留言每页默认条目
     * {Number} defaultCurrent 默认页码
     * {Number} current 当前页码
     */
    this.state = {
      commentListArray: [],
      pageSize: 10,
      defaultCurrent: 1,
      current: 1
    }
  }
  componentWillReceiveProps (nextProps) {
    let commentList = nextProps.commentList;
    let commentListArray = commentList.slice((this.state.current - 1) * this.state.pageSize,
     this.state.current * this.state.pageSize);
    this.setState({
      commentListArray
    })
  }
  // 确认删除
  showConfirm = (id, cId) => {
    let that = this;
    confirm({
      title: '你确定要删除该留言吗?',
      onOk() {
        that.deleteUserComment(id, cId);
      }
    });
  }
  // 页码改变回调
  changePage = (page, pageSize) => {
    let commentList = this.props.commentList;
    let commentListArray = commentList.slice((page - 1) * pageSize, page * pageSize);
    this.setState({
      commentListArray,
      current: page
    })
  }
  // 删除留言
  deleteUserComment = (id, cId) => {
    cId = cId || 0;
    $.ajax({
      url: '/api/usercomment/delete',
      type: 'POST',
      data: {
        id,
        cId
      },
      success: (data) => {
        if (data.status === 200) {
          message.success(data.msg);
          this.props.success();
        } else {
          message.error(data.msg);
        }
      }
    })
  }
  render () {
    let lookUserId = this.props.lookUserId;
    let user = this.props.user;
    let commentListArray = this.state.commentListArray;
    let html = commentListArray.length > 0 ? 
    commentListArray.map((item, index) => 
    // 主留言
    <Card 
      title={<Link to={'/user/detail/' + item.from._id}>{item.from.userName}</Link>} 
      extra={moment((item.createTime)).fromNow()} bordered={true} key={index}
      className='listOne'
      >
      <div className='content'>
        <p className='one'>{item.content}
          <span className='operation'>
            {
              <span 
                className='iconfont icon-liuyan' 
                onClick={() => this.props.getToComment(item._id, item.from._id, item.from.userName)}>
              </span>
            }
            {/* 判断权限 */}
            {
              lookUserId === user._id || user._id === item.from._id || user.role > 0 ?
              <span className='iconfont icon-shanchu' onClick={() => this.showConfirm(item._id)}></span>
              : ''
            }
          </span>
        </p>
      </div>
      {/* 回复 */}
      {item.reply.map((cont, count) => 
        <Card title={
            <span>
              <Link to={'/user/detail/' + cont.from._id}>{cont.from.userName}</Link>
              &nbsp;回复:&nbsp;
              <Link to={'/user/detail/' + cont.to._id}>{cont.to.userName}</Link>
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
                  onClick={() => this.props.getToComment(item._id, cont.from._id, cont.from.userName)}>
                </span>
              }
              {/* 判断权限 */}
              {
                lookUserId === user._id || user._id === cont.from._id || user.role > 0 ?
                <span className='iconfont icon-shanchu' 
                  onClick={() => this.showConfirm(cont._id, item._id)}>
                </span>
                : ''
              }
            </span>
            </p>
          </div>
        </Card>
      )}
    </Card>
    )
    : '暂无评论';
    return (
      <div className='userCommentList'>
        {html}
        {/* 有第二页时候才会显示分页信息, 大于5页时候，才有跳页操作 */}
        {this.props.commentList.length > this.state.pageSize ? <Pagination 
          pageSize={this.state.pageSize}
          defaultCurrent={this.state.defaultCurrent} 
          total={this.props.commentList.length}
          onChange={this.changePage}
          current={this.state.current}
          showQuickJumper={this.props.commentList.length / this.state.pageSize > 5} 
        /> : ''}
      </div>
    )
  }  
}

export default CommentList;