import React , { Component } from 'react';
import MsgComment from '../../common/msgComment/';
import PubSub from 'pubsub-js';
import './style.css';
class Opinion extends Component {
	constructor () {
		super();
		/**
		 * @type {Object} user 用戶對象
		 */
		this.state = {
			user: {},
		}
	}
	componentWillMount () {
		// 监控 用户的登录状态!
    PubSub.subscribe("changeUserOpinion", ( msg, user ) => {
      this.setState({
        user
      })
    });
    PubSub.publish('getUser');
	}
  componentWillUnmount () {
    PubSub.unsubscribe('changeUserOpinion');
  }
	render () {
		let { user } = this.state;
		return(
			<div className='opinion'>
				<div className='public'>
					<div className='inner'>
						<h2>留下你的意见吧!</h2>
						<MsgComment 
              user={user}
              createURL={'/api/opinion/create'}
              listURL={'/api/opinion/list'}
              deleteURL={'/api/opinion/delete'}
              page={0}
              pageNum={5}
              />
					</div>
				</div>
			</div>
		)
	}
}

export default Opinion;