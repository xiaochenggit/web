import React , { Component } from 'react';
import MsgComment from '../../common/msgComment/';
import ChangeUser from './ChangeUser';
import LoadModel from '../../common/loadModel/';
import { Button, Card  } from 'antd';
import $ from 'jquery';
import PubSub from 'pubsub-js';

class UserDetail extends Component {
  constructor (props) {
    super(props);
    /**
     * {String} lookUserId 被浏览用户id
     * {Oject} lookUser 被浏览用户信息
     * {Array} follows 用户粉丝数组
     * {Array} cares 用户关注者数组
     */
    this.state = {
      lookUserId: this.props.match.params.userId,
      lookUser: {},
      user: {},
      domain: 'http://localhost:80'
    }
  } 
  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps.match.params.userId);
    this.setState({
      lookUserId: nextProps.match.params.userId
    });
  }
  componentWillMount () {
    let { lookUserId } = this.state;
    this.getDetail(lookUserId);
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
  /**
   * 是否关注
   * @param  {Array} follows 关注者数组
   * @param  {Number} userId  用户id
   */
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
  /**
   * 获得观看用户的信息 成功之后赋值，失败跳转到首页。
   * @param  {Nmuber} lookUserId 用户id
   * @return {[type]}            [description]
   */
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
            lookUser: data.result.user
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
          this.getDetail(lookUserId);
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
  }
  render () {
    const { lookUser, lookUserId, user, domain} = this.state;
    let { follows , cares } = lookUser;
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
                      this.getIsCare(lookUser.follows, user._id) ? 
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
                  canDelete={user._id === lookUser._id}
                  page={0}
                  pageNum={5}
                />
              </Card>
            </div>
            <div className='userAch shadowBox'>
              <Card title="个人成就" bordered={false} style={{ width: '100%' }}>
                <div className='followsCares'>
                  <div className='left'>
                    <p className='name'>关注了</p>
                    {
                      cares ?
                      <LoadModel
                        title={"关注了"}
                        arr={cares}
                      /> : ''
                    }
                  </div>
                  <div className='right'>
                    <p className='name'>关注者</p>
                    {
                      follows ? 
                      <LoadModel
                        title={"关注者"}
                        arr={follows}
                      /> : ''
                    }
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDetail;