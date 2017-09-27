import React , { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import $ from 'jquery';
const { TextArea } = Input;
const FormItem = Form.Item;

class CommentForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        $.ajax({
          url: '/api/usercomment/create',
          type: 'POST',
          data: {
            user: this.props.lookUserId,
            ...values
          },
          success: (data) => {
            if (data.status === 200) {
              message.success(data.msg);
              this.props.success();
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
              <TextArea rows={4} placeholder="请填写留言内容" />
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

export default Form.create()(CommentForm);