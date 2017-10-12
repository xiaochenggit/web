import React , { Component } from 'react';
import { Modal, Form, Input, Select, Button, message, Radio } from 'antd';
import $ from 'jquery';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

// 改变用户信息!
class ChangeUser extends Component {
  state = {
    visible: false,
    confirmDirty: false,
    autoCompleteResult: []
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        $.ajax({
          type: 'POST',
          url: '/api/users/changeinfo',
          data: values,
          success: (data) => {
            if (data.status === 200) {
              message.success(data.msg)
              this.props.changeInfo();
              this.handleCancel();
            } else {
              message.error(data.msg);
            }
          }
        });
      }
    });
  }
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  checkPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  checkConfirm = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };
  render() {
    const { visible } = this.state;
    const { user } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 18,
          offset: 6,
        },
      },
    };
    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 60 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    );
    return (
      <Button type="dashed" className='changeUserInfo' onClick={this.showModal}>修改信息
         <Modal title="修改信息"
          visible={visible}
          onCancel={this.handleCancel}
          footer={null}
          width={400}
        >
          <Form onSubmit={this.handleSubmit} className="login-register">
            <FormItem
              {...formItemLayout}
              label="性别"
            >
              {getFieldDecorator('sex', {
                rules: [{
                  required: true, message: 'Please  your sex!',
                }],
                initialValue: user.sex
              })(
                <RadioGroup>
                  <Radio value="nan">男</Radio>
                  <Radio value="nv">女</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="邮箱："
              hasFeedback
            >
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!'
                }, {
                  required: false, message: 'Please input your E-mail!'
                }],
                initialValue: user.email
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电话："
            >
              {getFieldDecorator('phone', {
                rules: [{ 
                  required: false, message: 'Please input your phone number!' 
                }],
                initialValue: user.phone
              })(
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type="primary" htmlType="submit">Register</Button>
            </FormItem>
          </Form>
        </Modal>
      </Button>
    )
  }
} 

export default Form.create()(ChangeUser);