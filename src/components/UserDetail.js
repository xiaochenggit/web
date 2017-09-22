import React , { Component } from 'react';
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
      <div className='index'>
        UserDetail
      </div>
    )
  }
}

export default UserDetail;