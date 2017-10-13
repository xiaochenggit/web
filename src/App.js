import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './App.css';
import './iconfont.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Index from './components/view/Index/';
import List from './components/view/List/';
import FooterHTML from './components/common/Footer';
import Header from './components/common/Header';
import UserDetail from './components/view/UserDetail/';
import UserList from './components/view/UserList/';
import ArticleCategoryCreate from './components/view/articleCategory/create';
import ArticleCreate from './components/view/article/create';
class App extends Component {
  render() {
    return (
      <div className='app'>
        <Router>
          <div className="main">
            <Header/>
            <Route exact path="/" component={Index}/>
            <Route exact path="/list" component={List}/>
            <Route exact path="/user/detail/:userId" component={UserDetail} />
            <Route exact path="/user/list" component={UserList}/>
            <Route exact path="/articlecategory/create" component={ArticleCategoryCreate}/>
            <Route exact path="/article/create" component={ArticleCreate}/>
            <FooterHTML />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
