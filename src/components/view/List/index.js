import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import './style.css';
import Page from '../../common/Page/index';
require('moment/locale/zh-cn');
let moment = require('moment');

class List extends Component {

  constructor () {
    super();
    /**
     * [state description]
     * @articles {Array} 页面总数据
     * @articlesArr {Array} 当前页数据
     * @pageSize {Number} 页面条目数量
     */
    this.state = {
      articles: [],
      articlesArr: [],
      pageSize: 10
    }
  }

  componentWillMount () {
    this.getArticleList();
  }

  // 获得文章列表
  getArticleList = () => {
    $.ajax({
      url: '/api/article/list',
      success: (data) => {
        if (data.status === 200) {
          let articles = data.result.articles;
          this.setState({
            articles,
            articlesArr: articles.slice(0, this.state.pageSize)
          }) 
        }
      }
    })
  }

  onChange = (articlesArr) => {
   this.setState({
    articlesArr
   })
  }

  render () {
    let { articlesArr, articles, pageSize, defaultCurrent } = this.state;
    let articleHTML = articlesArr.map((item, index) =>
      <li className='articleItem' key={index}>
        <p className='articleName'>
          <Link to={ '/article/detail/' + item._id }>
            {item.name}
          </Link>
        </p>
        <p className='articleDescribe'>
          {item.describe}
        </p>
        <p className='articleAuthor'>
          <Link to={ '/user/detail/' + item.author._id }>
            {item.author.userName}
            <span className={'iconfont icon-' + item.author.sex}></span>
          </Link>
          <span className='articleTime'>{ moment(item.createTime).format('YYYY-MM-DD') }</span>
        </p>
      </li>
    )
    return (
      <div className='articleList'>
        <div className='public'>
          <div className='inner'>
            <ul className='articleGroup'>
              {articleHTML}
            </ul>
            {
            articles.length > pageSize ?
            <Page arr={articles}
              pageSize={pageSize}
              onChange={this.onChange}
            /> : ""
            }
          </div>
        </div>
      </div>
    )
  }
}

export default List;