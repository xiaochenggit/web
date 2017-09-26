import React , { Component } from 'react';
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
     visible: false
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
  }
  componentDidMount() {
    this.chekLogin()
  }
  // 验证是否登录
  chekLogin = () => {
    fetch('/api/users/cheklogin',{
      method: 'GET',
      credentials: "include"
    }).then(res => res.json()).then(data => {
      if (data.status === 200) {
        this.loginSuccess(data.result);
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
      }
    })
  }
  render () {
    const menu = (
      <Menu>
        <Menu.Item>
          <Link to={'/user/detail/' + this.state.user._id }>个人中心</Link>
        </Menu.Item>
        {this.state.user.role > 0 ? <Menu.Item>
          <Link to={'/user/list'}>用户列表</Link>
        </Menu.Item> : ''}
        <Menu.Item>
          <a rel="noopener noreferrer" onClick={this.logOut}>退出</a>
        </Menu.Item>
      </Menu>
    );
    let html = this.state.isLogin ?
    <Dropdown overlay={menu}>
      <a className="ant-dropdown-link">
      <Avatar src={require('../../../images/user.png')} />
        {this.state.user.userName}<Icon type="down" />
      </a>
    </Dropdown>
    :
    <div className='login' onClick={this.showModal}>{'登录/注册'}
      <Modal
          title=""
          visible={this.state.visible}
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