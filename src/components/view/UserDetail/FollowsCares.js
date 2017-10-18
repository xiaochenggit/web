import React , { Component } from 'react';
import { Modal, Card , Avatar} from 'antd';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import './FollowsCares.css';
require('moment/locale/zh-cn');
let moment = require('moment');

export default class FollowsCares extends Component {
  /* 
   * @memberof FollowsCares
   * 数据在props中传过来 一个 follows 一个 cares
   * {Boolean} visible 模态框的显示与隐藏!
   * {String} title 模态框的 title
   * {String} 当前取值. 是follows 还是 cares 
   * {Array} arr 显示的数据!
   * {Number} index 当前显示的页码 
   * {Number} maxIndex 最大显示的页码 
   * {Number} pageNum 每页的数量!
   * {Number} time 是否是第一次显示! 用于添加事件!
   */
  state = {
    visible: false,
    title: '',
    type: '',
    arr: [],
    index: 1,
    maxIndex: 2,
    pageNum: 10,
    time: 0
  }
  showModal = (type) => {
    /**
     * 判断点击的是哪个type 然后获得数据 初始化index为1 计算maxIndex 当第一次打开的时候添加滚动事件
     */
    let { pageNum, time } = this.state;
    this.setState({
      visible: this.props[type].length > 0 ? true : false,
      index: 1,
      arr: this.props[type].slice(0, 1 * pageNum),
      maxIndex: Math.ceil(this.props[type].length / pageNum),
      title: type === 'cares' ? '关注了' : '关注者',
      type,
      time: time + 1
    }, function() {
      if (this.state.time === 1) {
        this.addUsersScroll();
      }
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  addUsersScroll = () => {
    // 滚动到底部时候 页码 + 1 数据更新
    let that = this;
    $("#users").scroll(function() {
      let {index, maxIndex, type, pageNum} = that.state;
      const $this = $(this);
      let nDivHight = $this.height();
			let nScrollHight = $this[0].scrollHeight;
      let nScrollTop = $this[0].scrollTop;
      if(nScrollTop + nDivHight >= nScrollHight && index < maxIndex) {
        that.setState({
          index: index + 1,
          arr: that.props[type].slice(0, (index + 1) * pageNum),
        })
      }
    })
  }
  render () {
    const { visible, title , arr } = this.state;
    const { follows, cares } = this.props; 
    return (
      <div className='followsCares'>
        <div className='left' onClick={()=>this.showModal('cares')}>
          <p className='name'>关注了</p>
          <p className='number'>{cares.length}</p>
        </div>
        <div className='right' onClick={()=>this.showModal('follows')}>
          <p className='name'>关注者</p>
          <p className='number'>{follows.length}</p>
        </div>
        <Modal title={title}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          className='modelBox'
        >
          <div id='users' className='users'>
            {
              arr.map((item,index) => 
              <Card  key={index} bordered={false}>
                <div className='user'>
                  <Link to={'/user/detail/' + item.user._id} onClick={this.handleCancel}>
                    <Avatar src={'http://localhost:3000/userAvatar/'+ (item.user.avatar ? item.user.avatar : 'user.a1f8e6e5.png') } />
                    {item.user.userName}
                  </Link>
                  <span className='time'>
                    {moment((item.time)).fromNow()}
                  </span>
                </div>
              </Card>
              )
            }
          </div>
        </Modal>
      </div>
    )
  }
}