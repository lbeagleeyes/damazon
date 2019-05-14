class User{
  constructor(id, username, phone, isManager){
    this.userId = id;
    this.username = username;
    this.phone = phone;
    this.isManager = isManager;
  }

  isManager(){
    return this.isManager;
  }
}

class Users{
  constructor(conn){
    this.conn = conn;
  };

  getUser(userName){
    var user = new User();

    return user;
  }
}