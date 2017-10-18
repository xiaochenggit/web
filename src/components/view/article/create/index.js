import React , { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import $ from 'jquery';
import E from 'wangeditor'
import './style.css';

const FormItem = Form.Item;
const { TextArea } = Input;

class ArticleCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorContent: ''
    }
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  clickHandle = () => {
    alert(this.state.editorContent)
  }
  componentDidMount () {
    const elem = this.refs.editorElem
    const editor = new E(elem)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html
      })
    }
    editor.customConfig.uploadImgShowBase64 = true
    editor.create()
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
                <div ref="editorElem" style={{textAlign: 'left'}}>
                </div>
              </Form>
              <button onClick={this.clickHandle.bind(this)}>获取内容</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Form.create()(ArticleCreate);