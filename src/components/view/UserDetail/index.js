import React , { Component } from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
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
     */
    this.state = {
      lookUserId: this.props.match.params.userId,
      lookUser: {},
      user: {},
      isSelf: false,
      userCommentsList: []
    }
  } 
  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps.match.params.userId);
    this.getUserComments(nextProps.match.params.userId)
    this.setState({
      lookUserId: nextProps.match.params.userId
    });
    PubSub.subscribe("getUser", ( msg, user ) => {
      this.setState({
        user
      })
    });
  }
  componentDidMount () {
    this.getDetail(this.state.lookUserId);
    this.getUserComments(this.state.lookUserId)
    // 监控 用户的登录状态!
    PubSub.subscribe("changeUser", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
    this.timer = setInterval(()=> {
      this.getUserComments(this.state.lookUserId)
    }, 60000)
  }
  // 登录
  Login = () => {
    PubSub.publish('userLogin');
  }
  componentWillNnmount () {
    PubSub.unsubscribe('changeUser');
    this.timer && clearInterval(this.timer);
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
            userCommentsList: data.result
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
                  {this.state.isSelf ? <Button type="dashed" className='changeUserInfo'>修改信息</Button> : ''}
                </div>
              </div>
            </div>
          </div>
          <div className='userCommentAch'>
            <div className='userComments shadowBox'>
              <Card title="留言板" bordered={false} style={{ width: '100%' }}>
                <CommentList 
                  commentList={this.state.userCommentsList} 
                  lookUserId={this.state.lookUserId} 
                  user={this.state.user} 
                  deleteUserComment={this.deleteUserComment}
                />
                {this.state.user.userName ? <CommentForm lookUserId={this.state.lookUserId} 
                success={() => this.getUserComments(this.state.lookUserId)}/> : <Button type="primary" onClick={this.Login}>请先登录</Button>}
              </Card>
            </div>
            <div className='userAch shadowBox'>
              <Card title="个人成就" bordered={false} style={{ width: '100%' }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDetail;