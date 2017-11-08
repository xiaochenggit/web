import React , { Component } from 'react';
class Index extends Component {
  render () {
    return (
      <div className='index'>
        <div className='public'>
        	<div className='inner'>
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
        	</div>
        </div>
      </div>
    )
  }
}

export default Index;