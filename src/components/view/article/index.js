import React , { Component } from 'react';
import { Link }from 'react-router-dom';
import $ from 'jquery';
import './style.css'

require('moment/locale/zh-cn');
let moment = require('moment');

class Article extends Component {

  constructor () {
    super();
    this.state = {
      articleId: 0,
      article: {}
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

    let { article } = this.state;
    let articleHTML = article.name ?　
      <div className='inner'>
        <h2 className='articleName'>{article.name}</h2>
        <p>
          <span className='articleAuthor'>
            <Link to={ '/user/detail/' + article.author._id }>
              {article.author.userName}
              <span className={ 'iconfont icon-' + article.author.sex }></span>
            </Link>
          </span>
          <span className='articleCreateTime'>{ moment(article.createTime).format('YYYY-MM-DD') }</span>
          <span className='articleUpdateTime'>{ moment(article.updateTime).format('YYYY-MM-DD') }</span>
        </p>
        <div className='articleContent' ref={ content => this.content = content}> 
        </div>
      </div>
    : <div className='inner'>正在加载...</div>;
    return (
      <div className='articleDetail'>
        <div className='public'>
          { articleHTML }
        </div>
      </div>
    )
  }

}

export default Article;