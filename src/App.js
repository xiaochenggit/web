import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Index from './components/Index';
import List from './components/List';
import FooterHTML from './components/common/Footer';
import Header from './components/common/Header';
class App extends Component {
  render() {
    return (
      <div className='app'>
        <Router>
          <div className="main">
            <Header/>
            <Route exact path="/" component={Index}/>
            <Route exact path="/list" component={List}/>
            <FooterHTML />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
