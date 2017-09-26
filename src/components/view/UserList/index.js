import React , { Component } from 'react';
import { Table, Icon, Modal, message} from 'antd';
import { Link } from 'react-router-dom';
import '../../../js/dateformat';
import $ from 'jquery';

const confirm = Modal.confirm;

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
  //  过滤一下 用户数组里的参数
  addKey = (arr) => {
    arr.forEach(function(item, index) {
      item.key = index + 1 + '';
      item.createTime = new Date(item.createTime).Format('yyyy-MM-dd hh:mm:ss');
      item.loadTime = new Date(item.loadTime).Format('yyyy-MM-dd hh:mm:ss');
      item.email = item.email ? item.email : '未填写';
      item.phone = item.phone ? item.phone : '未填写';
    });
    return arr;
  }
  /**
   * 删除用户操作
   * id 用户id
   * success 成功返回函数
   */
  delete = (id) => {
    $.ajax({
      url: '/api/users/delete',
      type: 'POST',
      data: {
        id
      },
      success: (data) => {
        if (data.status === 200) {
          let userArray = this.state.userArray;
          userArray.forEach((item, index) => {
            if (item._id === id) {
              userArray.splice(index, 1);
              return;
            }
          });
          this.setState({
            userArray
          });
          message.success(data.msg);
        } else {
          message.error(data.msg);
        }
      }
    })
    
  }
  componentDidMount () {
    // 请求用户数组
    $.ajax({
      url: '/api/users/list',
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            userArray: this.addKey(data.result)
          })
        } else {
          this.props.history.push('/')
        }
      }
    })
  }
  // 删除确认弹窗
  showConfirm = (id) => {
    let that = this;
    confirm({
      title: '你确定要删除此用户吗?',
      onOk() {
        that.delete(id);
      }
    });
  }       
  render () {
    // table表格设计
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
          <a><Icon type="delete" onClick={() => this.showConfirm(record._id)}/></a>
        </span>
      ),
    }];
    return (
      <div className='userList'>
        <div className='public'>
          <Table columns={columns} dataSource={this.state.userArray} pageSize={1} bordered={true}/>
        </div>
      </div>
    )
  }
}

export default UserList;