import React , { Component } from 'react';
import { Card, Form, Input, Button, message, Tooltip, Modal } from 'antd';
import $ from 'jquery';
import './style.css';

const FormItem = Form.Item;
const { TextArea } = Input;
const confirm = Modal.confirm;

class ArticleCategoryCreate extends Component {
  /**
   * 文字分类创建页面! 
   * {Array} articleCategories 文章分类数组 []
   */
  state = {
    articleCategories: []
  }
  componentWillMount () {
    this.getArticleCategories();
  }
  // 获得文章分类数据
  getArticleCategories = () => {
    $.ajax({
      url: '/api/articlecategory/create',
      type: 'GET',
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            articleCategories: data.result.articleCategories
          })
        } else { // 错误就跳转到首页!
          this.props.history.push('/')
        }
      }
    })
  }
  // 提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.createArticleCategory(values);
      }
    });
  }
  // 创建文章分类
  createArticleCategory = (values) => {
    $.ajax({
      url: '/api/articlecategory/create',
      type: 'POST',
      data: {
        ...values
      },
      success: (data) => {
        if (data.status === 200) {
          message.success('创建文章分类成功!');
          this.props.form.resetFields();
          this.text.focus();
          this.getArticleCategories();
        } else {
          message.error(data.msg);
        }
      }
    })
  }
  // 删除确认弹窗!
  showDeleteConfirm = (name, _id) => {
    let that = this;
    confirm({
      title: '确认删除' + name + '类别吗?',
      content: '删除后不可恢复!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        that.deleteArticleCategory(name, _id)
      }
    });
  }
  // 删除文章分类
  deleteArticleCategory = (name, _id) => {
    $.ajax({
      url: '/api/articlecategory/delete',
      type: 'POST',
      data: {
        _id
      },
      success: (data) => {
        if (data.status === 200) {
          message.info('删除' + name + '类别成功!')
          this.getArticleCategories();
        } else {
          message.error(data.msg);
        }
      }
    })
  }
  render () {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 21,
          offset: 3,
        },
      },
    };
    let { articleCategories } = this.state;
    return (
      <div className='articleCategoryCreate'>
        <div className='public'>
          <div className='inner'>
            <div className='create'>
              <Card title="创建文章分类" bordered={false}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                  <FormItem
                    {...formItemLayout}
                    label="名称"
                    hasFeedback
                  >
                    {getFieldDecorator('name', {
                      rules: [{
                        required: true, message: '请填写分类名称!',
                      }],
                    })(
                      <Input ref={(text) => this.text = text} placeholder='请填写分类名称'/>
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="描述"
                    hasFeedback
                  >
                  {getFieldDecorator('describe', {
                    rules: [{ required: true, message: '请填写分类描述!' }],
                  })(
                    <TextArea rows={4} placeholder="请填写分类描述"/>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">
                    创建
                  </Button>
                </FormItem>
                </Form>
              </Card>
            </div>
            <div className='categories'>
              <Card title="文章分类" bordered={false}>
                {
                  articleCategories.length > 0 ? 
                  articleCategories.map((item, index) => 
                  <Tooltip placement="top" title={item.describe} key={index}>
                    <Button 
                    size='large' 
                    type='danger'
                    onClick={() => this.showDeleteConfirm(item.name, item._id)}
                    ghost>
                      {item.name}
                    </Button>
                  </Tooltip>
                  ) 
                  : '暂无分类'
                }
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(ArticleCategoryCreate)