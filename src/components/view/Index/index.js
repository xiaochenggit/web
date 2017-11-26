import React , { Component } from 'react';
import { Card, Avatar, Button, Anchor } from 'antd';
import { Link } from 'react-router-dom';
import $ from 'jquery';

require('moment/locale/zh-cn');
let moment = require('moment');

class Index extends Component {
  constructor () {
    super();
    this.state = {
      articleCategories: [],
      domain: 'http://localhost:80',
    }
  }
  componentWillMount () {
    this.getArticleCategories();
  }
  // 获得文章分类数据
  getArticleCategories = () => {
    $.ajax({
      url: '/api/articlecategory/list',
      type: 'GET',
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            articleCategories: data.result.articleCategories
          })
        }
      }
    })
  }
  // 跳转到文章分类列表页面
  goToCategory = (id) => {
    this.props.history.push('/list?category=' + id);
  }
  render () {
    let { articleCategories, domain} = this.state;
    let AnchorHTML = articleCategories.length > 0 ?
    articleCategories.map((elem, index) =>
      <Anchor.Link href={'#' + elem._id} title={elem.name} key={index}/>
    )
    : '';
    let articleHTML = articleCategories.length > 0 ?
    articleCategories.map((elem, index) =>
      <Card
        id={elem._id}
        className='articleCate'
        title={<Link to={'/list?category=' + elem._id}>{elem.name}</Link>}
        extra={elem.articles.length >= 5 ?
          <Link to={'/list?category=' + elem._id}>更多>></Link>
          : ''}
        key={index}
        style={{ width: '100%' }}
      >
        {elem.articles.length > 0 ?
          elem.articles.map((item, t) => 
            <ul className='articleGroup' key={t}>
              <li className='articleItem'>
                <p className='articleName'>
                  <Link to={ '/article/detail/' + item.article._id }>
                    {item.article.name}
                  </Link>
                </p>
                <p className='articleDescribe'>
                  {item.article.describe}
                </p>
                <p className='articleAuthor'>
                  <Link to={ '/user/detail/' + item.article.author._id }>
                    <Avatar src={ domain + '/userAvatar/'+ (item.article.author.avatar ? item.article.author.avatar : 'user.a1f8e6e5.png') } />
                    {item.article.author.userName}
                    <span className={'iconfont icon-' + item.article.author.sex}></span>
                  </Link>
                  <span className='articleTime'>{ moment(item.article.createTime).format('YYYY-MM-DD HH:mm') }</span>
                  <span className='browses iconfont icon-liulan'> { item.article.browses.length }</span>
                  {/*文章类型*/}
                  { 
                    item.article.categories.map((cate, n) =>
                      <Button
                        size={'small'}
                        type='primary'
                        key={n}
                        onClick={() => this.goToCategory(cate.category._id)}
                        ghost>
                        {cate.category.name}
                      </Button>
                    )
                  } 
                </p>
              </li>
            </ul>
          )
        : '暂无数据'}
      </Card>
    )
    : '正在加载...'
    return (
      <div className='index'>
        <div className='public'>
        	<div className='inner'>
            {articleHTML}
        		<h1>一些目录结构</h1>
        		<h3>首页: / </h3>
        		<h3>文章列表页面 :  /list</h3>
        		<h3>用户个人信息页面 :  /user/detail/:userId</h3>
        		<h3>文章发布页面：/article/create</h3>
        		<h3>文章详情页面：/article/detail/articleId</h3>
        		<h3>文章分类创建页面: /articlecategory/create (需要用户权限)</h3>
        		<h3>用户列表页面: /user/list (需要用户权限)</h3>
        		<h3>用到的技术：react、jquery、antd、node.js、mongodb</h3>
        		<h3>github地址: <a target='_blank' href='https://github.com/xiaochenggit/web' rel="noopener noreferrer">https://github.com/xiaochenggit/web</a></h3>
        		<h3>管理员账号: admin(密码同账户)</h3>
        		<h3>普通账号: xiaocheng(密码同账户)</h3>
        		<h3>有些功能还未完善， 更新时间： 2017、11、1</h3>
            <Anchor
              offsetTop={200}
              className='indexAnchor'
              affix={true}
            >
              {AnchorHTML}
            </Anchor>
        	</div>
        </div>
      </div>
    )
  }
}

export default Index;