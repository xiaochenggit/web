import React , { Component } from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;

class FooterHTML extends Component {
  render () {
    return (
      <Footer style={{ textAlign: 'center' }}>
        xxx xxx ©2016 xxxx by React and Antd
      </Footer>
    )
  }
}

export default FooterHTML;
