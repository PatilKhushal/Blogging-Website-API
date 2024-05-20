const { createFolder } = require("./FolderRelated");
const multer = require("multer");
const fs = require('fs');
const path = require("path");

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      console.log('req.id', req.id);
      let dirPath = await createFolder(req.id);
      console.log('dirPath',dirPath)
      cb(null, dirPath)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = req.id + '-' + Date.now() + '-' + Math.round(Math.random()) + path.parse(file.originalname).ext;
      console.log('uniqueSuffix',uniqueSuffix)
      cb(null, 'raju' + uniqueSuffix);
    }
  })
  
const upload = multer({ storage: storage })

module.exports = {
    upload,
}
