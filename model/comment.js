const mongoose = require('mongoose');
const { getDate } = require('../service/getDate');

/************************************************************** Comments Schema **************************************************************/

// Schema for Comments
const commentSchema = mongoose.Schema(
    {
        data : {
            type : String,
        },

        likes : [
            {
                type : mongoose.Schema.ObjectId,
                ref : 'users'
            }
        ],

        totalLikes : {
            type : Number,
            default : 0
        },

        date : {
            type : Date,
            default : getDate
        }
    }
);

const commentModel = mongoose.model('comments', commentSchema);

module.exports = {
    commentModel
}