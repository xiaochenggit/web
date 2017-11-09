import React , { Component } from 'react';
import { Pagination } from 'antd';
import './style.css';

// 一个简单的公共分页
class Page extends Component {
	constructor() {
		super();
	}
	/**
	 * 页面改变触发函数
	 * @param  {[Number]} current [页码]
	 * 修改页码  触发props.onchange (当前页数据)
	 */
	onChange = (current) => {
  	this.props.onChange(current);
	}
	render() {
		const { pageSize, arr, current } = this.props;
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