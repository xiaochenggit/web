import React , { Component } from 'react';
import MsgComment from '../../common/msgComment/';
import FollowsCares from './FollowsCares';
import ChangeUser from './ChangeUser';
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
     * {Array} follows 用户粉丝数组
     * {Array} cares 用户关注者数组
     */
    this.state = {
      lookUserId: this.props.match.params.userId,
      lookUser: {},
      user: {},
      isSelf: false,
      follows: [],
      cares: [],
      domain: 'http://localhost:80'
    }
  } 
  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps.match.params.userId);
    this.getCare(nextProps.match.params.userId);
    this.setState({
      lookUserId: nextProps.match.params.userId
    });
  }
  componentWillMount () {
    let { lookUserId } = this.state;
    this.getDetail(lookUserId);
    this.getCare(lookUserId);
    // 监控 用户的登录状态!
    PubSub.subscribe("changeUser", ( msg, user ) => {
      this.setState({
        user
      })
    });
    // 留言更新
    PubSub.publish('getUser');
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
  /**
   * 关注和取消关注的方法
   * @param  {Number} _id  [用户id]
   * @param  {String} type [类型 add | cancel 添加或者取消关注]
   */
  care = (_id, type) => {
    let { user, lookUserId } = this.state;
    if (!user._id) { // 如果没有登录弹出登录框
      return this.Login();
    }
    $.ajax({
      type: 'POST',
      url: '/api/users/care',
      data: { type, _id},
      success: (data) => {
        if (data.status === 200) {
          this.getCare(lookUserId);
        }
      }
    })
  }
  // 改变用户信息后 重新获得用户的信息，和留言列表
  changeInfo = () => {
    this.getDetail(this.state.lookUserId);
    PubSub.publish('getUser');
  }
  componentWillUnmount () {
    PubSub.unsubscribe('changeUser');
    this.timer && clearInterval(this.timer);
  }
  render () {
    const { lookUser, lookUserId, user, follows, cares, domain} = this.state;
    return (
      <div className='userdetail'>
        <div className='public'>
          {/* 信息部分 */}
          {
            lookUser._id ? 
            <div className='userInfoBox shadowBox'>
            <div className='userImgBg'></div>
            <div className='userInfo'>
              <div className='userInfoInner'>
                <div className='userImg'>
                  <img
                   alt={lookUser.userName}
                   src={domain + '/userAvatar/'+ (lookUser.avatar ?
                    lookUser.avatar
                    : 'user.a1f8e6e5.png') }>
                  </img>
                </div>
                <div className='userDes'>
                  <h2>
                    <span className='userName'>{lookUser.userName}
                      <span className={'userSex iconfont icon-'+ lookUser.sex}></span>
                    </span>
                    <span>单身程序狗</span>
                  </h2>
                  <div className='item'>
                    <span className='iconfont icon-email-two'></span>{lookUser.email} 
                  </div>
                  <div className='item'>
                    <span className='iconfont icon-phone'></span>{lookUser.phone} 
                  </div>
                  <div className='btnGroup'>
                    {
                      lookUserId === user._id ? 
                      <ChangeUser user={lookUser} changeInfo={this.changeInfo}/> : 
                      this.getIsCare(follows, user._id) ? 
                      <Button type="dashed" onClick={()=>this.care(lookUser._id, 'cancel')}>已关注</Button> : 
                      <Button type="primary" onClick={()=>this.care(lookUser._id, 'add')}>关注他</Button> }
                  </div>
                </div>
              </div>
            </div>
          </div>
          : '正在加载'
          }
          <div className='userCommentAch'>
            <div className='userComments shadowBox'>
              <Card 
                title="留言板" 
                bordered={false} 
                style={{ width: '100%' }}
              >
                <MsgComment 
                  user={user}
                  typeId={lookUserId}
                  createURL={'/api/usercomment/create'}
                  listURL={'/api/usercomment/list'}
                  deleteURL={'/api/usercomment/delete'}
                  page={0}
                  pageNum={5}
                />
              </Card>
            </div>
            <div className='userAch shadowBox'>
              <Card title="个人成就" bordered={false} style={{ width: '100%' }}>
                <FollowsCares cares={cares} follows={follows}/>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDetail;