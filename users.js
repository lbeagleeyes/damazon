class User{
  constructor(userId, username, phone, isManager){
    this.username = username;
    this.phone = phone;
    this.isManager = isManager;
    this.userId = userId;
  }

}

class UsersManager{
  constructor(conn){
    this.conn = conn;
  };

  getUser(userName){
    return this.conn.performQuery("Select * from users where ?", {UserName:userName});
  }
}

module.exports = {User, UsersManager};