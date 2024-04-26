const model = require('mongoose').model;
const UserSchema = require('./user.schema.cjs');

const UserModel = model('User', UserSchema);

function insertUser(user) {
    return UserModel.create(user);
}

function getUserByUsername(username) {
    return UserModel.findOne({username: username}).exec();
}

// function getSendersByUserID(userID) {
//     const user = UserModel.findById(userID).exec();
//     // let listOfSenders = null;
//     console.log("user.sharedByUsers" + user)
//     // for(let i = 0; i < user.sharedByUsers.length;i++){
//         const s = UserModel.getUserByUsername(user.sharedByUsers[0]);
//         // listOfSenders.push(s);
//     // }
//     return s;
// }

function updateUsers(username, sharedByUsers) {
    return UserModel.findOneAndUpdate({username: username}, sharedByUsers)
}

module.exports = {
    insertUser,
    getUserByUsername,
    updateUsers,
    // getSendersByUserID,
}