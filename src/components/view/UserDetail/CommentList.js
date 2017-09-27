import React , { Component } from 'react';
import {Link} from 'react-router-dom';
import { Card } from 'antd';

class CommentList extends Component {
  render () {
    let commentList = this.props.commentList;
    let html = commentList.length > 0 ? 
    commentList.map((item, index) => 
    <Card 
      title={<Link to={'/user/detail/' + item.from._id}>{item.from.userName}</Link>} 
      extra={item.createTime} bordered={true} key={index}>
      <p>{item.content}</p>
    </Card>
    )
    : '暂无评论';
    return (
      <div className='userCommentList'>
        {html}
      </div>
    )
  }  
}

export default CommentList;