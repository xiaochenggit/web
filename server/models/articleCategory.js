let mongoose = require('mongoose')
let Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
let articleCategorySchema = new Schema({
    "name": {
        type: String,
        unique: true
    },
    "user" : {
		type : ObjectId,
		ref : 'User'
    },
    "describe": {
        type: String,
        default: ''
    },
    "createTime": {
        type: Number,
        default: new Date().getTime()
    }
    // 文章
    // articles: [{
    //     user: {
    //         type : ObjectId,
	// 		ref : 'User'
    //     },
    //     time: {
    //         type: Number,
    //         default: new Date().getTime()
    //     }
    // }]
});

module.exports = mongoose.model('ArticleCategory', articleCategorySchema);