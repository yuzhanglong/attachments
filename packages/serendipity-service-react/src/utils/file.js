const path = require("path");
const fs = require("fs");

// 写入文件树，传入一个对象，key 为目标路径，value 为内容
const fileTreeWriting = (fileMap) => {
  if (typeof fileMap !== "object") {
    throw new Error("fileMap 格式错误");
  }

  Object.keys(fileMap).forEach((res) => {
    try {
      // TODO：考虑以下问题：文件之前存在，但作出了修改，需要注意 git
      if (!fs.existsSync(path.dirname(res))) {
        fs.mkdirSync(path.dirname(res));
      }
      fs.writeFileSync(res, fileMap[res]);
    } catch (e) {
      console.log(e);
    }
  });
}

module.exports = {
  fileTreeWriting
}