import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import $ from 'jquery';
import './style.css';

require('moment/locale/zh-cn');
let moment = require('moment');

class List extends Component {

  constructor () {
    super();
    /**
     * {Array} articles 文章列表数组
     */
    this.state = {
      articles: []
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
          this.setState({
            articles: data.result.articles
          }) 
        }
      }
    })
  }

  render () {
    let { articles } = this.state;
    let articleHTML = articles.map((item, index) =>
      <li className='articleItem' key={index}>
        <p className='articleName'>
          <Link to={ '/article/detail/' + item._id }>
            {item.name}
          </Link>
        </p>
        <p className='articleAuthor'>
          <Link to={ '/user/detail/' + item.author._id }>
            {item.author.userName}
            <span className={'iconfont icon-' + item.author.sex}></span>
          </Link>
          <span className='articleTime'>{ moment(item.createTime).format('YYYY-MM-DD') }</span>
        </p>
        <p className='articleDescribe'>
          {item.describe}
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
          </div>
        </div>
      </div>
    )
  }
}

export default List;