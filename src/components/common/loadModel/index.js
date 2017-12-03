import React , { Component } from 'react';
import { Modal, Card , Avatar} from 'antd';
import { Link } from 'react-router-dom';
import './style.css';
require('moment/locale/zh-cn');
let moment = require('moment');

export default class LoadModel extends Component {
  constructor (props) {
    super(props);
    /* 
     * 下拉加載用戶
     * {Boolean} visible 模态框的显示与隐藏! 默认隐藏
     * {String} title 模态框的 title
     * {Array} arr 显示的数据!
     * {Number} index 当前显示的页码 
     * {Number} pageNum 每页的数量!
     */
    this.state = {
      visible: false,
      title: this.props.title || '模态框',
      arr: [],
      index: 0,
      pageNum: this.props.pageNum || 10,
      domain: 'http://localhost:80'
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setArr(nextProps.arr);
  }
  componentWillMount () {
    this.setArr(this.props.arr);
  }
  /**
   * 截取数组
   * @param  {Array} arr 被截取的信息数组
   */
  setArr = (arr) => {
    let { pageNum, index } = this.state;
    this.setState({
      arr: arr.slice(0, (index + 1) * pageNum)
    });
  }
  // 隐藏
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  // 显示
  showModel = () => {
    let { arr } = this.state;
    if (arr.length) {
      this.setState({
        visible: true
      })
    }
  }
  onScroll = () => {
    let that = this;
    let { index, pageNum, arr } = that.state;
    let propsArr = this.props.arr;
    let modelBox = this.modelBox;
    let offsetHeight = modelBox.offsetHeight;
    let scrollTop = modelBox.scrollTop;
    let scrollHeight = modelBox.scrollHeight;
    if (offsetHeight + scrollTop == scrollHeight && arr.length < propsArr.length) {
      that.setState({
        index: index ++,
        arr: propsArr.slice(0, (index + 1) * pageNum),
      })
    }
  }
  render () {
    const { visible, title , arr, domain } = this.state;
    return (
      <div className='loadModel'>
        <p className='number' onClick={this.showModel}>{this.props.arr.length}</p>
        <Modal title={title}
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          className='modelBox'
        >
          <div
          className='users'
          onScroll={this.onScroll}
          ref={ modelBox => this.modelBox = modelBox }>
            {
              arr.map((item,index) => 
              <Card  key={index} bordered={false}>
                <div className='user'>
                  <Link to={'/user/detail/' + item.user._id} onClick={this.handleCancel}>
                    <Avatar src={domain + '/userAvatar/'+ (item.user.avatar ? item.user.avatar : 'user.a1f8e6e5.png') } />
                    {item.user.userName}
                    <span className={'iconfont icon-' + item.user.sex}></span>
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