import React , { Component } from 'react';
import { Button } from 'antd';
import $ from 'jquery';
class UserDetail extends Component {
  constructor (props) {
    super(props);
    /**
     * {String} userId 被浏览用户id
     * {Oject} user 被浏览用户信息
     * {Boolean} isSelf 是否是自己浏览自己
     */
    this.state = {
      userId: this.props.match.params.userId,
      user: {},
      isSelf: false
    }
  }
  componentWillReceiveProps(nextProps) {
    this.getDetail(nextProps.match.params.userId);
  }
  componentDidMount () {
    this.getDetail(this.state.userId);
  }
  // 获得用户信息
  getDetail = (userId) => {
    $.ajax({
      type: 'POST',
      url: '/api/users/detail',
      data: {
        userId
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            user: data.result.user,
            isSelf: data.result.isSelf
          })
        } else {
          this.props.history.push('/')
        }
      }
    })
  }
  render () {
    return (
      <div className='userdetail'>
        <div className='public'>
          <div className='userInfoBox'>
            <div className='userImgBg'></div>
            <div className='userInfo'>
              <div className='userInfoInner'>
                <div className='userImg'>
                  <img alt={this.state.user.userName} src={require('../../../images/admin.jpg')}></img>
                </div>
                <div className='userDes'>
                  <h2>
                    <span className='userName'>{this.state.user.userName}
                      <span className={'userSex iconfont icon-'+ this.state.user.sex}></span>
                    </span>
                    <span>单身程序狗</span>
                  </h2>
                  <div className='item'>
                    <span className='iconfont icon-email-two'></span>{this.state.user.email} 
                  </div>
                  <div className='item'>
                    <span className='iconfont icon-phone'></span>{this.state.user.phone} 
                  </div>
                  {this.state.isSelf ? <Button type="dashed" className='changeUserInfo'>修改信息</Button> : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default UserDetail;