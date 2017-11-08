import React , { Component } from 'react';
import { Pagination } from 'antd';
import './style.css';

// 一个简单的公共分页
class Page extends Component {
	constructor() {
		super();
		/**
		 * [state 数据]
		 * @current {Number} 当前页
		 */
		this.state = {
			current: 1
		}
	}
	/**
	 * 页面改变触发函数
	 * @param  {[Number]} current [页码]
	 * 修改页码  触发props.onchange (当前页数据)
	 */
	onChange = (current) => {
  	this.setState({
  		current
  	});
  	/**
  	 * pageSize Number 页面显示条目
  	 * arr Array 总数据
  	 * newArr Array 当前页数据
  	 * onChange Func 传递过来的触发函数(当前页数据)
  	 */
  	const { pageSize, arr, onChange } = this.props;
  	let newArr = arr.slice(pageSize * (current - 1), pageSize * current);
  	onChange(newArr);
	}
	render() {
		const { pageSize, arr } = this.props;
		const { current } = this.state;
		return (
				<div className='pageOwn'>
					<Pagination 
					 showQuickJumper={arr.length / pageSize > 5}
					 pageSize={pageSize}
					 total={arr.length}
					 onChange={this.onChange}
					 current={current}
					/>
				</div>
			)
	}
}

export default Page;