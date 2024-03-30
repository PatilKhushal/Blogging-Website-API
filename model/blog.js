const mongoose = require('mongoose');
const { getDate } = require('../service/getDate');

/************************************************************** Blog Schema **************************************************************/

// Schema for blogs
const blogSchema = mongoose.Schema({
    title : {
        type : String,
        required : true,
        maxLength : 50,
    },

    content : {
        type : String,
    },

    author : {
        type : mongoose.Schema.ObjectId,
        ref : 'users',
        required : true
    },

    date : {
        type : Date,
        default : getDate
    },

    isPublic : {
        type : Boolean,
        default : false
    },

    /* thumbnail : {
        type : String,
        required : true
    }, */

    comments : [
        {
                type : mongoose.Schema.ObjectId,
                ref : "comments"
        }
    ],

    totalComments : {
        type : Number,
        default : 0
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
    }
})

// Model for blogs
const blogModel = mongoose.model('blogs', blogSchema);

module.exports = {
    blogModel
}