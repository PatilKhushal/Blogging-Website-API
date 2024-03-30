const fs = require("fs");
const fsPromise = require("fs/promises");

async function existFolder(path) {
  let res = fs.existsSync(`${path}`);
  return res;
}

async function createFolder(id)
{
    try
    { 
        if(!(await existFolder(`public/${id.toString()}`)))
          await fsPromise.mkdir(`public/${id}`);
        return `public/${id.toString()}`;
    }
    catch(error)
    {
        return `public/${id.toString()}`;
    }
}

module.exports = {
    existFolder,
    createFolder
}