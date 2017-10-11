import React , { Component } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import FollowsCares from './FollowsCares';
import { Button, Card  } from 'antd';
import $ from 'jquery';
import PubSub from 'pubsub-js';

class UserDetail extends Component {
  constructor (props) {
    super(props);
    /**
     * {String} lookUserId 被浏览用户id
     * {Oject} lookUser 被浏览用户信息
     * {Boolean} isSelf 是否是自己浏览自己
     * {Array} userCommentsList 留言板数组
     * {Boolean} isSortTime 是否按照时间排序
     * {Number} to 回复用户的id
     * {Number} cId 回复主留言的 id
     * {String} toUser 回复用户名字
     */
    this.state = {
      lookUserId: this.props.match.params.userId,
      lookUser: {},
      user: {},
      isSelf: false,
      userCommentsList: [],
      isSortTime: true,
      to: 0,
      cId: 0,
      toUser: '',
      follows: [],
      cares: []
    }
  } 
  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps.match.params.userId);
    this.getUserComments(nextProps.match.params.userId);
    this.getCare(nextProps.match.params.userId);
    this.setState({
      lookUserId: nextProps.match.params.userId,
      to: 0,
      cId: 0,
      toUser: ''
    });
  }
  componentWillMount () {
    this.getDetail(this.state.lookUserId);
    this.getCare(this.state.lookUserId);
    this.getUserComments(this.state.lookUserId)
    // 监控 用户的登录状态!
    PubSub.subscribe("changeUser", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
    // 留言更新
    this.timer = setInterval(()=> {
      this.getUserComments(this.state.lookUserId)
    }, 60000)
  }
  // 登录
  Login = () => {
    PubSub.publish('userLogin');
  }
  // 获得关注(被关注)信息.
  getCare = (lookUserId) => {
    $.ajax({
      type: 'POST',
      url: '/api/users/getcare',
      data: {
        _id: lookUserId
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            follows: data.result.follows,
            cares: data.result.cares
          })
        }
      }
    })
  }
  // 关注者中是否包含 该用户!
  getIsCare = (follows, userId) => {
    let isCare = false;
    follows.forEach((item) => {
      if (item.user._id === userId) {
        isCare = true;
        return false;
      }
    });
    return isCare;
  }
  // 获得用户信息
  getDetail = (lookUserId) => {
    $.ajax({
      type: 'POST',
      url: '/api/users/detail',
      data: {
        userId: lookUserId
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            lookUser: data.result.user,
            isSelf: data.result.isSelf
          })
        } else {
          this.props.history.push('/')
        }
      }
    })
  }
  // 获得回复留言
  getToComment = (cId, to, toUser) => {
    this.setState({
      cId,
      to,
      toUser
    });
    if (this.state.user._id) {
      document.getElementById('content').focus();
    } else {
      this.Login();
    }
  }
  // 初始化回复留言
  reductToComment = () => {
    this.setState({
      cId: 0,
      to: 0,
      toUser: ''
    })
  }
  // 获得留言板信息
  getUserComments = (lookUserId) => {
    $.ajax({
      type: 'POST',
      url: '/api/usercomment/getlist',
      data: {
        user: lookUserId
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            userCommentsList: this.state.isSortTime ? data.result.reverse() : data.result
          })
        }
      }
    })
  }
  // 删除留言!
  deleteUserComment = (id) => {
    let userCommentsList = this.state.userCommentsList;
    userCommentsList.forEach((item, index) => {
      if (item._id === id) {
        userCommentsList.splice(index, 1)
        return;
      }
    });
    this.setState({
      userCommentsList
    })
  }
  // 改变排序方式
  changeSortTime = () => {
    this.setState({
      isSortTime: !this.state.isSortTime
    })
    this.getUserComments(this.state.lookUserId)
  }
  // 添加关注
  care = (_id, t) => {
    if (!this.state.user._id) {
      return this.Login();
    }
    $.ajax({
      type: 'POST',
      url: '/api/users/care',
      data: {
        type: t,
        _id
      },
      success: (data) => {
        if (data.status === 200) {
          this.getCare(this.state.lookUserId);
        }
      }
    })
  }
  componentWillUnmount () {
    PubSub.unsubscribe('changeUser');
    this.timer && clearInterval(this.timer);
  }
  render () {
    return (
      <div className='userdetail'>
        <div className='public'>
          {/* 信息部分 */}
          <div className='userInfoBox shadowBox'>
            <div className='userImgBg'></div>
            <div className='userInfo'>
              <div className='userInfoInner'>
                <div className='userImg'>
                  <img alt={this.state.lookUser.userName} src={require('../../../images/admin.jpg')}></img>
                </div>
                <div className='userDes'>
                  <h2>
                    <span className='userName'>{this.state.lookUser.userName}
                      <span className={'userSex iconfont icon-'+ this.state.lookUser.sex}></span>
                    </span>
                    <span>单身程序狗</span>
                  </h2>
                  <div className='item'>
                    <span className='iconfont icon-email-two'></span>{this.state.lookUser.email} 
                  </div>
                  <div className='item'>
                    <span className='iconfont icon-phone'></span>{this.state.lookUser.phone} 
                  </div>
                  <div className='btnGroup'>
                    {
                      this.state.lookUserId === this.state.user._id ? 
                      <Button type="dashed" className='changeUserInfo'>修改信息</Button> : 
                      this.getIsCare(this.state.follows, this.state.user._id) ? 
                      <Button type="dashed" onClick={()=>this.care(this.state.lookUser._id, 'cancel')}>已关注</Button> : 
                      <Button type="primary" onClick={()=>this.care(this.state.lookUser._id, 'add')}>关注他</Button> }
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='userCommentAch'>
            <div className='userComments shadowBox'>
              <Card 
                title="留言板" 
                bordered={false} 
                style={{ width: '100%' }}
                extra={<span><span className={'icon-time iconfont' + (this.state.isSortTime ? ' on' : '')} onClick={this.changeSortTime}></span>{this.state.userCommentsList.length + '条'}</span>}
              >
                <CommentList 
                  commentList={this.state.userCommentsList} 
                  lookUserId={this.state.lookUserId} 
                  user={this.state.user} 
                  deleteUserComment={this.deleteUserComment}
                  getToComment={this.getToComment}
                  success={() => this.getUserComments(this.state.lookUserId)}
                />
                {
                  this.state.user.userName ? 
                  <CommentForm 
                  lookUserId={this.state.lookUserId}
                  cId={this.state.cId}
                  to={this.state.to}
                  toUser={this.state.toUser} 
                  reductToComment={this.reductToComment}
                  success={() => this.getUserComments(this.state.lookUserId)}
                  /> 
                    : <Button type="primary" onClick={this.Login}>请先登录</Button>}
              </Card>
            </div>
            <div className='userAch shadowBox'>
              <Card title="个人成就" bordered={false} style={{ width: '100%' }}>
                <FollowsCares cares={this.state.cares} follows={this.state.follows}/>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDetail;