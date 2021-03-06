import React , { Component } from 'react';
import UserHeader from './UserHeader/';
import { Link } from 'react-router-dom';
import { Menu, Icon , BackTop } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

require('./header.css');
const logo = require('../../images/yeoman.png');
class Header extends Component {
  state = {
    current: window.location.pathname
  }
  handleClick = (e) => {
    this.setState({
      current: e.key
    });
  }
  render() {
    let { current } = this.state;
    return (
      <header className='header'>
        <div className='public'>
          <div className='logo'>
            <img src={logo} alt='logo'></img>
          </div>
          <nav>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[current]}
              mode="horizontal"
            >
              <Menu.Item key="/">
              <Link to="/"><Icon type="mail" />首页</Link>
              </Menu.Item>
              <Menu.Item key="/project/list">
                <Link to="/project/list">项目列表</Link>
              </Menu.Item>
              <SubMenu title={<span><Icon type="setting" />Navigation Three - Submenu</span>}>
                <MenuItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
              <Menu.Item key="/list">
                <Link to="/list">文章列表</Link>
              </Menu.Item>
              <Menu.Item key="/opinion">
                <Link to="/opinion">意见反馈</Link>
              </Menu.Item>
            </Menu>
          </nav>
          <UserHeader />
        </div>
        <div id='components-back-top-demo-custom'>
          <BackTop>
            <div className="ant-back-top-inner">UP</div>
          </BackTop>
        </div>
      </header>
    )
  }
}

export default Header;