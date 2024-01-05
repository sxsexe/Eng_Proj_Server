/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.

// Create User Table
use('user');
db.createCollection("user_info")

db.getCollection("user_info").insertOne({

  name: "Test1",
  // 头像
  avatar: "",
  // 普通用户 or VIP
  type : 0,
  creat_time: '2023-12-27 23:06:12',
  update_time: '',
  auths : [
    {
        // 登录类型 1:Phone + Password 2:Phone+Code 3:Weixin
        identity_type: 1,
        //密码凭证 password or token
        credential: "222333444",
        // 标识 (手机号/邮箱/用户名或第三方应用的唯一标识)
        identifier: "13717542219", 
    }
  ]
})

