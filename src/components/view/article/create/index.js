import React , { Component } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import $ from 'jquery';
import E from 'wangeditor'
import './style.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;

class ArticleCreate extends Component {
  constructor(props) {
    super(props);
    /**
     * {String} editorContent 编辑器内容
     * {Array} options 文章分类名称列表
     */
    this.state = {
      editorContent: '',
      options: []
    }
  }
  componentWillMount () {
    this.getArticleCategories();
  }
  // 获得文章分类 并保存到 state 中
  getArticleCategories = () => {
    $.ajax({
      url: '/api/articlecategory/list',
      type: 'GET',
      success: (data) => {
        if (data.status === 200) {
          let articleCategories = data.result.articleCategories;
          let options = [];
          articleCategories.forEach((item) => {
            options.push({ label: item.name, value: item._id })
          });
          this.setState({
            options
          })
        }
      }
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.editorContent.length < 1) {
      return message.error('文章内容是不是太短了一些!')
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        $.ajax({
          url: '/api/article/create',
          type: 'POST',
          data: {
            ...values,
            content: this.state.editorContent
          },
          success: (data) => {
            if (data.status === 200) {
              this.props.history.push('/article/detail/' + data.result._id);
            } else {
              message.error(data.msg);
            }
          }
        })
      }
    });
  }
  componentDidMount () {
    const elem = this.refs.editorElem;
    const editor = new E(elem)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = html => {
      this.setState({
        editorContent: html
      })
    }
    editor.customConfig.uploadImgServer = '/api/article/images';
    editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
    editor.customConfig.uploadFileName = 'articleImages';
    editor.customConfig.height = '400';
    editor.customConfig.uploadImgHooks = {
      before: function (xhr, editor, files) {
          // 图片上传之前触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
          
          // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
          // return {
          //     prevent: true,
          //     msg: '放弃上传'
          // }
      },
      success: function (xhr, editor, result) {
          result.data.forEach((item) => {
            editor.txt.append('<img src='+ item +'></img>')
          });
          // 图片上传并返回结果，图片插入成功之后触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      fail: function (xhr, editor, result) {
          // 图片上传并返回结果，但图片插入错误时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function (xhr, editor) {
          // 图片上传出错时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
      timeout: function (xhr, editor) {
          // 图片上传超时时触发
          // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象
      },
  
      // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
      // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
      customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
  
          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = result.url
          insertImg(url)
  
          // result 必须是一个 JSON 格式字符串！！！否则报错
      }
    }    
    editor.create()
  }
  render () {

    const { getFieldDecorator } = this.props.form;
    const { options } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (
      <div className='articleCreate'>
        <div className='public'>
          <div className='inner'>
            <div id="editormd">
              <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem
                  {...formItemLayout}
                  label="文章名:"
                  hasFeedback
                >
                  {getFieldDecorator('name', {
                    rules: [{
                      required: true, message: '请填写文章名称!',
                    }],
                  })(
                    <Input />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="选择分类"
                >
                  {getFieldDecorator('categories',{
                    rules: [{ required: true, message: '请选择分类!' }]
                  })(
                     <CheckboxGroup options={options} />
                  )}
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label="文章描述:"
                  hasFeedback
                >
                  {getFieldDecorator('describe', {
                    rules: [{ required: true, message: '请填写文章描述!' }],
                  })(
                    <TextArea rows={4} placeholder="请填写文章描述"/>
                  )}
                </FormItem>
                <FormItem>
                  <div ref="editorElem" style={{textAlign: 'left'}}>
                  </div>
                </FormItem>
                <FormItem>
                  <Button type="primary" htmlType="submit">
                    创建
                  </Button>
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