import React , { Component } from 'react';
import { Form, Input, Button, message } from 'antd';
import $ from 'jquery';

const { TextArea } = Input;
const FormItem = Form.Item;

class CommentForm extends Component {
  handleSubmit = (e) => {
    const { lookUserId, cId, to, success} = this.props; 
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        $.ajax({
          url: '/api/usercomment/create',
          type: 'POST',
          data: {
            user: lookUserId,
            cId,
            to,
            ...values
          },
          success: (data) => {
            if (data.status === 200) {
              message.success(data.msg);
              success();
              // 清空表单
              this.props.form.resetFields();
              this.text.focus();
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
    const { toUser, reductToComment } = this.props;
    return (
      <div className='commentForm'>
         {
           toUser ? 
           <Button type="primary to" ghost onClick={reductToComment}>回复: {toUser}</Button> 
           : ''}
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

export default Form.create()(CommentForm);