var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
// DB SETTING
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: 'localhost',
  user : 'inssa',
  password : 'root',
  database : 'inssa'
});
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

router.get('/',function(req,res,next) {
  res.send("auth")
})

router.get('/register',function(req,res,next) {
  res.render('auth/register');
})
router.get('/login',function(req,res,next) {
  res.render('auth/login');
})

router.get('/profile',function(req,res,next) {
  var r = req.body;
  var sess = req.session;

  var sql = `select * from iuser where iuser.iuser_id = ?`
  var params = [sess.userid];
  console.log(params);
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      res.send(`<script>alert('오류발생'); location.href='/';</script>`)
    }else{
      res.render('auth/profile',{
        rows : rows
      });
    }
  })
  
})

router.get('/logout',function(req,res,next) {
  delete req.session.userid;
  delete req.session.userpw;
  delete req.session.username;
  console.log('로그아웃');
  res.send(`<script>alert('로그아웃 되었습니다. 안녕히가세요'); location.href='/';</script>`)
})  

router.post('/login',function(req,res,next) {
  var r = req.body;

  var id = req.body.userid;
  var pw = req.body.userpw;

  var sess = req.session;

  var sql = `SELECT * FROM iuser WHERE iuser_id = (?)`
  var params = [id];
  
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      res.send(`<script>alert('로그인 실패 .....'); location.href='/';</script>`)
    }else{
      if(rows[0] == null){
        res.send(`<script>alert('존재하지않는 아이디 또는 비밀번호 입니다.....'); location.href='/';</script>`)
      }
      else if(pw == rows[0].iuser_pw){
        sess.userid = rows[0].iuser_id;
        sess.userpw = rows[0].iuser_pw;
        sess.username = rows[0].iuser_name;
        return req.session.save(function() {
          console.log('로그인 성공 ! 아이디 :'+sess.userid+' 비밀번호 : '+sess.userpw);
          res.redirect('/');
      })
      }else{
        res.send(`<script>alert('입력하신 아이디 또는 비밀번호가 잘못되었습니다.....'); location.href='/';</script>`)
      }
    }
  })

})

router.post('/register',function(req,res,next) {
  var r = req.body;

  var userid = r.userid;
  var userpw = r.userpw;
  var name = r.name;

  var tel1 = r.tel1;
  var tel2 = r.tel2;
  var tel3 = r.tel3;

  var tel = tel1+tel2+tel3;

  var gender = r.gender;
  var school = r.school;
  var schooltype = r.schooltype;
  var grade = r.grade;
  var lesson = r.lesson;
  var location = r.location;

  var sql = `SELECT * FROM iuser WHERE iuser_id = (?)`
  var params = [userid];
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      return ;
    }else{
      if(rows[0] == null){
        var in_sql  = `INSERT INTO iuser 
        (iuser_id,iuser_pw,iuser_name,iuser_tel,iuser_gender,iuser_school,
        iuser_schooltype,iuser_grade,iuser_lesson,iuser_location) 
        values(?,?,?,?,?,?,?,?,?,?)`
        var in_params = [userid,userpw,name,tel,gender,school,schooltype,grade,lesson,location]
        conn.query(in_sql,in_params,function(err,rows,field) {
          if(err){
            console.log(err);
            return ;
          }else{
            console.log('회원가입정상');
            //res.redirect('/');
            res.send(`<script>alert('회원가입 성공!'); location.href='/';</script>`)
          }
        })
      }else{
        res.send(`<script>alert('중복된아이디입니다.');</script>`)
      }
    }
  })
})

router.post('/profile',function(req,res,next) {

  res.redirect('/');

})

module.exports = router;