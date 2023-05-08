const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    maxlength: 100
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

userSchema.pre('save', function (next) {

  var user = this;

  if (  user.isModified('password')) {
    // 비밀번호를 암호화 시킴.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
      });
    });
  }

  next();

});

userSchema.methods.comparePassword = function(plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch)
  })
}

/**
 * jsonwebtoken을 이용해서 token을 생성한다.
 */
userSchema.methods.generateToken = function (callback) {

  var user = this;

  // user._id + secretToken => token을 통해 누구인지 알 수 있다.
  var token = jwt.sign(user._id.toHexString(), 'secretToken');
  user.token = token;
  user.save()
  .then((user) => callback(null, user))
  .catch((err) => callback(err));
}

const User = mongoose.model('User', userSchema);

module.exports = { User };
// export default User;