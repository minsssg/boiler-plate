const express = require('express');
const app = express();
const port = 5000;
const config = require('./config/key');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

// application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({exetended: true}));
// application/json
// app.use(bodyParser.json());
/**
 * express 에 기본적으로 body-parser 가 포함되어 따로 설치할 필요가 없음
 * 코드를 다음과 같이 수정한다.
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(cookieParser);

const {User} = require('./models/User');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

//mongodb+srv://minssg:<password>@boilerplate.0neebxi.mongodb.net/?retryWrites=true&w=majority

app.get('/', (req, res) => {
  console.log("Hello World");
  res.send("Hello World! 안녕하세요~");
});

app.post('/register', async (req, res) => {
  // 회원가입 할 때 필요한 정보를 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body);
  
  await user
    .save()
    .then(() => {
      res.status(200).json({
        success: true,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        success:false,
        err:err,
      });
    });
});

app.post('/login', (req, res) =>  {
  // 1.요청된 이메일이 데이터베이스에 있는지 확인한다.
  // 2.요청된 이메일이 데이터베이스에 있다면 비밀번호 확인
  // 3.user를 위한 토큰 생성
  User.findOne({email: req.body.email})
  .then((user) => {
    if (!user) return res.json({
      loginSuccess: false,
      message: "제공된 이메일에 해당하는 유저가 없습니다."
    });
    
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) return res.json({loginSuccess: false, message: '비밀번호가 틀렸습니다.'});

      // 비밀번호 까지 맞다면 토큰을 생성해야 한다.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        
        // token을 저장한다. 어디에 저장할까?
        // 쿠키에 보관, 로컬스토리지에 보관할 수 있음
        // 우선 여기서는 쿠키에 보관한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id});
      });
    });
  })
  .catch((err) => {
    res.json({
      loginSuccess: false,
      message: "로그인 비밀번호가 틀렸습니다."
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}`));