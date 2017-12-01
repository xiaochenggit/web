import React , { Component } from 'react';
import MsgComment from '../../common/msgComment/';
import PubSub from 'pubsub-js';
import { Link }from 'react-router-dom';
import { Avatar, Button } from 'antd';
import $ from 'jquery';
import './style.css'

require('moment/locale/zh-cn');
let moment = require('moment');

class Article extends Component {

  constructor (props) {
    super(props);
    /**
     * @type {String} domain 服务器地址
     * @type {Number} articleId 访问文章的id
     * @type {Object} articleId 文章对象
     * @type {Object} 用户属性
     */
    this.state = {
      articleId: this.props.match.params.articleId,
      article: {},
      domain: 'http://localhost:80',
      user: {},
    }
  }

  componentWillMount () {
    PubSub.subscribe("changeUserArticle", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
    this.getArticleInfo();
  }

  /**
   * 获取文章信息
   */
  getArticleInfo = () => {
    let { articleId } = this.state;
    $.ajax({
      url: '/api/article/detail',
      type: 'POST',
      data: {
        _id: articleId
      },
      success: (data) => {
        if (data.status === 200) {
          this.setState({
            article: data.result.article
          })
        } else { // 获取不到跳转到首页
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
  /**
   * 跳转到文章分类页面
   * @param  {Number} id [文章分类 id]
   */
  goToCategory = (id) => {
    this.props.history.push('/list?category=' + id);
  }
  componentWillUnmount () {
    PubSub.unsubscribe('changeUserArticle');
  }
  render () {
    let { article, domain, user, articleId } = this.state;
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
          <span className='browses iconfont icon-liulan'> {article.browses.length}</span>
        </p>
        <div className='articleContent' ref={ content => this.content = content}> 
        </div>
        <div className='categories'>
          {
            article.categories.map((elem, index) =>
              <Button
                type='primary'
                key={index}
                onClick={ () => this.goToCategory(elem.category._id)}
                ghost>
                {elem.category.name}
              </Button>
            )
          }
        </div>
      </div>
    : '正在加载...';
    return (
      <div className='articleDetail'>
        <div className='public'>
          <div className='inner'>
            { articleHTML }
          </div>
          <div className='article-rel'>
            <div className='article-rel-left'>
              <MsgComment 
                user={user}
                typeId={articleId}
                createURL={'/api/articlecomment/create'}
                listURL={'/api/articlecomment/list'}
                deleteURL={'/api/articlecomment/delete'}
                page={0}
                pageNum={5}
              />
            </div>
            <div className='article-rel-right'>
              相关
            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Article;