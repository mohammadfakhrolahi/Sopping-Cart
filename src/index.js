// const User = function(id, email) {
//   this.id = id
//   this.email = email
// }

// User.prototype.userInfo = function() {
//   return `ID: ${this.id} - Email: ${this.email}`
// }

// const username = new User(7, 'itsmohammad@gmail.com')

// console.log(username.userInfo())

class User {
  constructor(id, email) {
    this.id = id
    this.email = email
  }
  userInfo() {
    return `ID: ${this.id} - Email: ${this.email}`
  }
}

class Job extends User{
  constructor(id, email, jobTitle) {
    super(id, email)
    this.jobTitle = jobTitle
  }
}

const username =  new Job(7, 'itsmohammad@gmail.com', 'Developer')

console.log(username)