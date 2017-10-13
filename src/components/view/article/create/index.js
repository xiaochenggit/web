import React , { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import $ from 'jquery';
// import '../../../../editor/js/editormd.min';
// import '../../../../editor/css/editormd.min.css';
import './style.css';

const FormItem = Form.Item;
const { TextArea } = Input;

class ArticleCreate extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render () {

    const { getFieldDecorator } = this.props.form;

    return (
      <div className='articleCreate'>
        <div className='public'>
          <div className='inner'>
            <div id="editormd">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                  {getFieldDecorator('editormd', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                  })(
                    <TextArea rows={4} style={{display: 'none'}}/>
                  )}
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Form.create()(ArticleCreate);