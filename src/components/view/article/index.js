import React , { Component } from 'react';
import { Link }from 'react-router-dom';
import { Avatar } from 'antd';
import $ from 'jquery';
import './style.css'

require('moment/locale/zh-cn');
let moment = require('moment');

class Article extends Component {

  constructor () {
    super();
    this.state = {
      articleId: 0,
      article: {},
      domain: 'http://localhost:80'
    }
  }

  componentWillMount () {
    // 获得路由 articleId
    let articleId = this.props.match.params.articleId;
    this.init(articleId);
  }

  // 初始化
  init = (articleId) => {
    this.setState({
      articleId
    });
    this.getArticleInfo(articleId);
  }

  // 获得文章信息
  getArticleInfo = (_id) => {
    $.ajax({
      url: '/api/article/detail',
      type: 'POST',
      data: {
        _id
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            article: data.result.article
          })
        } else {
          this.props.history.push('/')
        }
      }
    })
  }

  // 添加文章内容 
  componentDidUpdate () {
    if (this.content) {
      this.content.innerHTML = this.state.article.content;
    }
  }
  render () {

    let { article, domain } = this.state;
    let articleHTML = article.name ?　
      <div className='article-box w-e-text'>
        <h1 className='articleName'>{article.name}</h1>
        <p className='articleDes'>
          <span className='articleAuthor'>
            <Link to={ '/user/detail/' + article.author._id }>
              <Avatar src={ domain + '/userAvatar/'+ (article.author.avatar ? article.author.avatar : 'user.a1f8e6e5.png') } />
              {article.author.userName}
              <span className={ 'iconfont icon-' + article.author.sex }></span>
            </Link>
          </span>
          <span className='articleUpdateTime'>更新时间：{ moment(article.updateTime).format('YYYY-MM-DD HH:mm') }</span>
        </p>
        <div className='articleContent' ref={ content => this.content = content}> 
        </div>
      </div>
    : '正在加载...';
    return (
      <div className='articleDetail'>
        <div className='public'>
          <div className='inner'>
            { articleHTML }
          </div>
        </div>
      </div>
    )
  }

}

export default Article;