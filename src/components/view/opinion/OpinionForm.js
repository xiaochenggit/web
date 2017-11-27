import React , { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import $ from 'jquery';

const { TextArea } = Input;
const FormItem = Form.Item;

class OpinionForm extends Component {
  componentDidMount () {
    if (this.props.cId) {
      this.text.focus();
    }
  }
  handleSubmit = (e) => {
    const { cId, to, success} = this.props; 
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        $.ajax({
          url: '/api/opinion/create',
          type: 'POST',
          data: {
            cId,
            to,
            ...values
          },
          success: (data) => {
            if (data.status === 200) {
              message.success(data.msg);
              success(cId, data.result.opinion);
              // 清空表单
              this.props.form.resetFields();
              if (!cId) {
                this.text.focus();
              }
            } else {
              message.error(data.msg)
            }
          }
        });
      }
    });
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='commentForm'>
         <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('content', {
              rules: [{ required: true, message: '请填写留言内容!' }],
            })(
              <TextArea rows={4} placeholder="请填写留言内容" ref={(text) => this.text = text}/>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default Form.create()(OpinionForm);