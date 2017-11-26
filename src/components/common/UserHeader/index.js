import React , { Component } from 'react';
import PubSub from 'pubsub-js';
import { Link } from 'react-router-dom';
import Login from './Login';
import { Menu, Dropdown, Icon, Modal, Tabs, Avatar} from 'antd';
import Register from './Register';

const TabPane = Tabs.TabPane;

class UserHeader extends Component {
  constructor () {
   super()
   /**
    * {String} nickName 用户名 默认为空
    * {String} userId 用户id 默认为空
    * {Boolean} isLogin 用户是否登录 
    * {Boolean} visible 登录注册弹窗是否显示
    */
   this.state = {
     user: '',
     isLogin: false,
     visible: false,
     domain: 'http://localhost:80'
   }
  }
  // 显示弹窗
  showModal = () => {
    this.setState({
      visible: true
    });
  }
  // 关闭弹窗
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  // 登录成功
  loginSuccess(user) {
    this.handleCancel();
    this.setState({
      isLogin: true,
      user
    });
    PubSub.publish('changeUser', user);
  }
  componentDidMount() {
    this.chekLogin();
    // 监控其他组件模拟登录的信息!
    PubSub.subscribe('userLogin', () => {
      this.showModal();
    });
    PubSub.subscribe('getUser', () => {
      this.chekLogin();
    });
  }
  // 验证是否登录
  chekLogin = () => {
    fetch('/api/users/cheklogin',{
      method: 'GET',
      credentials: "include"
    }).then(res => res.json()).then(data => {
      if (data.status === 200) {
        this.loginSuccess(data.result);
      } else {
        PubSub.publish('changeUser', {});
      }
    })
  }
  // 登出
  logOut = () => {
    fetch('/api/users/logout',{
      method: 'GET',
      credentials: "include"
    }).then(res => res.json()).then(data => {
      if (data.status === 200) {
        this.setState({
          isLogin: false,
          user: ''
        });
        PubSub.publish('changeUser', {});
      }
    })
  }
  componentWillUnmount () {
    PubSub.unsubscribe('userLogin');
    PubSub.unsubscribe('getUser');
  }
  render () {
    const { user, visible, domain } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={'/user/detail/' + user._id }>个人中心</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={'/list?author=' + user._id }>你的文章</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={'/article/create'}>发布文章</Link>
        </Menu.Item>
        {
          user.role > 0 ? 
          <Menu.Item>
            <Link to={'/user/list'}>用户列表</Link>
          </Menu.Item> 
          : ''
        }
        {
          user.role > 0 ? 
          <Menu.Item>
            <Link to={'/articlecategory/create'}>创建分类</Link>
          </Menu.Item> 
          : ''
        }
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={this.logOut}>退出</a>
        </Menu.Item>
      </Menu>
    );
    let html = this.state.isLogin ?
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link">
      <Avatar src={ domain + '/userAvatar/'+ (user.avatar ? user.avatar : 'user.a1f8e6e5.png') } />
        {user.userName}
        <span className={'iconfont icon-' + user.sex}></span>
        <Icon type="down" />
      </a>
    </Dropdown>
    :
    <div className='login' onClick={this.showModal}>{'登录/注册'}
      <Modal
          title=""
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          width={400}
        >
        <Tabs defaultActiveKey="1" size="small" animated={false} class='usetTabs'>
          <TabPane tab="登录" key="1">
            <Login success={this.loginSuccess.bind(this)}/>
          </TabPane>
          <TabPane tab="注册" key="2">
            <Register success={this.loginSuccess.bind(this)}/>
          </TabPane>
        </Tabs>
        </Modal>
    </div>;
    return (
      <div className='user-header'>
        {html}
      </div>
    )
  }
}

export default UserHeader;