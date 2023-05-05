const express = require('express');
const app = express();
const port = 5000;
const config = require('./config/key');
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

const {User} = require('./models/User');

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI).then(() => console.log("MongoDB Connected..."))
.catch(err => console.log(err));

//mongodb+srv://minssg:<password>@boilerplate.0neebxi.mongodb.net/?retryWrites=true&w=majority

app.get('/', (req, res) => res.send("Hello World! 안녕하세요~"));

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

app.listen(port, () => console.log(`Example app listening on port ${port}`));