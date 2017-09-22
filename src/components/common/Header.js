import React , { Component } from 'react';
import UserHeader from './UserHeader/';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
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
    return (
      <header className='header'>
        <div className='public'>
          <div className='logo'>
            <img src={logo} alt='logo'></img>
          </div>
          <nav>
            <Menu
              onClick={this.handleClick}
              selectedKeys={[this.state.current]}
              mode="horizontal"
            >
              <Menu.Item key="/">
              <Link to="/"><Icon type="mail" />首页</Link>
              </Menu.Item>
              <Menu.Item key="app" disabled>
                <Icon type="appstore" />Navigation Two
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
                <Link to="/list">列表页面</Link>
              </Menu.Item>
            </Menu>
          </nav>
          <UserHeader />
        </div>
      </header>
    )
  }
}

export default Header;