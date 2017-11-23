import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import { Avatar, Button  } from 'antd';
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
      current: 1,
      pageSize: 10,
      domain: 'http://localhost:80',
      isSortTime: true
    }
  }

  componentWillMount () {
    this.getArticleList();
  }
  // 获得文章列表
  getArticleList = () => {
    console.log(this.props.location)
    $.ajax({
      url: '/api/article/list',
      success: (data) => {
        if (data.status === 200) {
          let articles = data.result.articles.reverse();
          this.setState({
            articles,
            articlesArr: articles.slice(0, this.state.pageSize)
          }) 
        }
      }
    })
  }

  onChange = (current) => {
   let {articles, pageSize} = this.state;
   let newArr = articles.slice(pageSize * (current - 1), pageSize * current);
   this.setState({
      current,
      articlesArr: newArr
   })
  }
  changeSortTime = () => {
    let articles = this.state.articles.reverse();
    this.setState({
      isSortTime: !this.state.isSortTime,
      articles,
      current: 1,
      articlesArr: articles.slice(0, this.state.pageSize)
    })
  }
  render () {
    let { articlesArr, articles, pageSize, domain, isSortTime, current} = this.state;
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
            <Avatar src={ domain + '/userAvatar/'+ (item.author.avatar ? item.author.avatar : 'user.a1f8e6e5.png') } />
            {item.author.userName}
            <span className={'iconfont icon-' + item.author.sex}></span>
          </Link>
          <span className='articleTime'>{ moment(item.createTime).format('YYYY-MM-DD HH:mm') }</span>
          {/*文章类型*/}
          {
            item.categories.map((elem, index) =>
              <Button
                size={'small'}
                type='primary'
                key={index}
                ghost>
                {elem.category.name}
              </Button>
            )
          }
        </p>
      </li>
    )
    return (
      <div className='articleList'>
        <div className='public'>
          <div className='inner'>
            {
              articles.length > 0 ?
              <ul className='articleGroup'>
              {articleHTML}
              <span className='time-btn'>
                <span 
                  className={'icon-time iconfont' + (isSortTime ? ' on' : '')} 
                  onClick={this.changeSortTime}>
                </span>
                {articles.length + '条'}
              </span>
            </ul> : '没有文章!'
            }
            {
            articles.length > pageSize ?
            <Page arr={articles}
              pageSize={pageSize}
              onChange={this.onChange}
              current={current}
            /> : ""
            }
          </div>
        </div>
      </div>
    )
  }
}

export default List;