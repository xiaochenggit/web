import React , { Component } from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
import './style.css';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { TextArea } = Input;
require('moment/locale/zh-cn');
let moment = require('moment');

class ProjectCreate extends Component {
	constructor () {
		super();
		this.state = {
			user: {}
		}
	}
	handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      if (!err) {
        // Should format date value before submit.
	      const rangeValue = fieldsValue['range-picker'];
	      const rangeTimeValue = fieldsValue['range-time-picker'];
	      const values = {
	        ...fieldsValue,
	        'time': fieldsValue['time'].format('YYYY-MM-DD')
	      };
        $.ajax({
          url: '/api/project/create',
          type: 'POST',
          data: {
            ...values
          },
          success: (data) => {
            if (data.status === 200) {
              this.props.history.push('/project/detail/' + data.result.project._id);
            } else {
              message.error(data.msg);
            }
          }
        })
      }
    });
  }
  disabledEndDate = (endValue) => {
    const startValue = new Date();
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
	componentWillMount () {
		// 监控 用户的登录状态!
    PubSub.subscribe("changeUserProject", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
	}
	login = () => {
		PubSub.publish('userLogin');
	}
  componentWillUnmount () {
    PubSub.unsubscribe('changeUserProject');
  }
	render () {
		const { getFieldDecorator } = this.props.form;
    const formItemLayoutSmall = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const formItemLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: '请选择交付日期' }],
    };
    let { user } = this.state;
		return (
			<div className='project public'>
				<div className="project-release">
					<div className="project-release-form">
						<Form onSubmit={this.handleSubmit} className="login-form">
	            <FormItem
	            	className='small'
	              {...formItemLayoutSmall}
	              label="项目名称:"
	              hasFeedback
	            >
	              {getFieldDecorator('name', {
	                rules: [{
	                  required: true, message: '请填写项目名称!',
	                }],
	              })(
	                <Input placeholder="请填写项目名称"/>
	              )}
	            </FormItem>
	            <FormItem
	            	className='small'
	              {...formItemLayoutSmall}
	              label="项目类型:"
	              hasFeedback
	            >
	              {getFieldDecorator('type', {
			            rules: [
			              { required: true, message: '请选择项目类型' },
			            ],
			          })(
			            <Select placeholder="请选择项目类型">
			              <Option value="xcx">小程序</Option>
			              <Option value="h5">H5</Option>
			              <Option value="qd">前端</Option>
			              <Option value="android">Android</Option>
			              <Option value="app">APP</Option>
			              <Option value="pho">PHP</Option>
			            </Select>
			          )}
	            </FormItem>
	            <FormItem
	              {...formItemLayout}
	              label="项目预算:"
	              hasFeedback
	            >
	              {getFieldDecorator('budget', {
	                rules: [{
	                  required: true, message: '请填写项目预算!',
	                }],
	                initialValue: 1000
	              })(
	                <InputNumber
							      formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							      parser={value => value.replace(/\￥\s?|(,*)/g, '')}
							      step={50}
							    />
	              )}
	            </FormItem>
	            <FormItem
	              className='small'
	              {...formItemLayoutSmall}
	              label="项目进度:"
	              hasFeedback
	            >
	              {getFieldDecorator('schedule', {
	                rules: [{
	                  required: true, message: '请填写项目进度!',
	                }],
	              })(
	                <Input placeholder='项目进度'/>
	              )}
	            </FormItem>
	            <FormItem
		            className='small'
			          {...formItemLayoutSmall}
			          label="交付日期"
			        >
			          {getFieldDecorator('time', config)(
			            <DatePicker
			            	disabledDate={this.disabledEndDate}
			            />
			          )}
			        </FormItem>
	            <FormItem
	              {...formItemLayout}
	              label="联系方式:"
	              hasFeedback
	            >
	              {getFieldDecorator('concat', {
	                rules: [{
	                  required: true, message: '请填写联系方式',
	                }],
	              })(
	                <Input placeholder='手机/QQ/微信'/>
	              )}
	            </FormItem>
	            <FormItem
	              {...formItemLayout}
	              label="项目描述:"
	              hasFeedback
	            >
	              {getFieldDecorator('content', {
	                rules: [{
	                  required: true, message: '请填写项目描述',
	                }],
	              })(
	                <TextArea rows={4} placeholder="请项目描述"/>
	              )}
	            </FormItem>
	          	{/*
		          <div className="ant-row ant-form-item">
		          	<div className="ant-form-item-label ant-col-xs-2 ant-col-sm-2">
		          		<label className="ant-form-item-required" title="联系方式:">项目描述</label>
		          	</div>
		          	<div className="ant-form-item-control-wrapper ant-col-xs-20 ant-col-sm-20">
			          	<div className="ant-form-item-control ">
			          		<div ref="editorElem"></div>
			          	</div>
		          	</div>
		          </div>*/}
		          <FormItem wrapperCol={{ span: 2, offset: 2 }}>
		            	{
		            		user._id ? 
		              	<Button type="primary" htmlType="submit">创建</Button>
		              	:
		              	<Button type="primary" onClick={this.login}>请先登录</Button>
		            	}
		          </FormItem>
		        </Form>
					</div>
				</div>
			</div>
			)
	}
}

export default Form.create()(ProjectCreate);