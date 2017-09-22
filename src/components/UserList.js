import React , { Component } from 'react';
import { Table, Icon } from 'antd';
import {Link} from 'react-router-dom';

import $ from 'jquery';

const columns = [{
  title: '用户名',
  dataIndex: 'userName',
  key: 'userName',
  render: (text, record) => <Link to={'/user/detail/' + record._id }>{text}</Link>,
}, {
  title: 'email',
  dataIndex: 'email',
  key: 'email',
}, {
  title: 'phone',
  dataIndex: 'phone',
  key: 'phone',
}, {
  title: 'role',
  dataIndex: 'role',
  key: 'role',
}, {
  title: '注册时间',
  dataIndex: 'createTime',
  key: 'createTime',
}, {
  title: '最新登录时间',
  dataIndex: 'loadTime',
  key: 'loadTime',
}, {
  title: '操作',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#"><Icon type="delete" /></a>
    </span>
  ),
}];

// const data = [{
//   key: '1',
//   name: 'John Brown',
//   age: 32,
//   address: 'New York No. 1 Lake Park',
// }, {
//   key: '2',
//   name: 'Jim Green',
//   age: 42,
//   address: 'London No. 1 Lake Park',
// }, {
//   key: '3',
//   name: 'Joe Black',
//   age: 32,
//   address: 'Sidney No. 1 Lake Park',
// }];

class UserList extends Component {
  constructor () {
    super();
    /**
     * {Array} userArray 用户数组
     */
    this.state = {
      userArray: []
    }
  }
  componentDidMount () {
    // 请求用户数组
    $.ajax({
      url: '/api/users/list',
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            userArray: data.result
          })
        } else {
          this.props.history.push('/')
        }
      }
    })
  }
  render () {
    return (
      <div className='userList'>
        <div className='public'>
          <Table columns={columns} dataSource={this.state.userArray} pageSize={1}/>
        </div>
      </div>
    )
  }
}

export default UserList;