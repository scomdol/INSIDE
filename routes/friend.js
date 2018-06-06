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



router.get('/woman',function(req,res,next) {
  var sess = req.session;
  var sql = `select count(*) as namesCount from ifwoman`;
  conn.query(sql,function(err,rows,field) {
    var count = rows[0].namesCount

    sql = `SELECT * FROM ifwoman , iuser where ifwoman.iuser_idx = iuser.iuser_idx ;`;
    conn.query(sql,function(err,rowss,field) {
      if(err){
        console.log(err);
        res.send('조회실패');
      }else{
        res.render("friend/woman",{
          sess : sess.username , 
          count : count,
          rows : rowss
        })
      }
    })
  })
})

router.get('/woman/:useridx',function(req,res,next) {
  var useridx = req.params.useridx;
  var sql = `SELECT * FROM ifwoman , iuser where ifwoman.iuser_idx = ? AND iuser.iuser_idx = ?; `
  var params = [useridx,useridx];
  
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      res.send('조회실패');
    }else{
      res.render("friend/detail",{
        rows : rows
      })
    }
  })
})

router.post('/woman/add',function(req,res,next) {
  var sess = req.session;
  var r = req.body;
  var userid = sess.userid; // 현재 로그인중인사람의 아이디
  var comment = r.comment; // 입력한 한줄소개
  var sql = `select iuser_idx from iuser where iuser_id = ?`
  var params = [userid];

  if(sess.userid != null){
    conn.query(sql,params,function(err,rows,field) {
      if(err){
        console.log(err);
        res.send("<script>alert('나는 한번만 등록할수 있습니다....!'); location.href='/'</script>");
      }else{
        var iuser_idx = rows[0].iuser_idx;
        sql = `select iuser_gender from iuser where iuser_idx = ?`
        params = [iuser_idx];
        conn.query(sql,params,function(err,rows,field) {
          if(rows[0].iuser_gender != "여자"){
            res.send(`<script>alert('여자 유저만 정보등록이 가능합니다.'); location.href='/';</script>`)
          }else{
            sql = `INSERT INTO ifwoman 
            (iuser_idx,ifwoman_comment) 
            values(?,?)`
            params = [iuser_idx,comment];
            conn.query(sql,params,function(err,rows,field) {
              if(err){
                console.log(err);
                res.send("<script>alert('나는 한번만 등록할수 있습니다....!'); location.href='/'</script>");
              }else{
                console.log('정보 올리기 정상!');
                //res.redirect('/');
                res.send(`<script>alert('내 정보를 올렸습니다!!'); location.href='/';</script>`)
              }
            })
          }

        })
      }
    })
  }else{
    res.send("<script>alert('권한이 없습니다! 로그인을 해보세요!'); location.href='/'</script>");
  }

})

router.get('/man',function(req,res,next) {
  var sess = req.session;
  var sql = `select count(*) as namesCount from ifman`;
  conn.query(sql,function(err,rows,field) {
    var count = rows[0].namesCount
    sql = `SELECT * FROM ifman , iuser where ifman.iuser_idx = iuser.iuser_idx ;`; //
    conn.query(sql,function(err,rows,field) {
      if(err){
        console.log(err);
        res.send('조회실패');
      }else{
        console.log("count : "+count);
        console.log("rows : "+rows);
        res.render("friend/man",{
          sess : sess.username ,
          count : count,
          rows : rows
        })
      }
    })
  })
})

router.get('/man/:useridx',function(req,res,next) {
  var useridx = req.params.useridx;
  var sql = `SELECT * FROM ifman , iuser where ifman.iuser_idx = ? AND iuser.iuser_idx = ?; `
  var params = [useridx,useridx];
  
  conn.query(sql,params,function(err,rows,field) {
    if(err){
      console.log(err);
      res.send('조회실패');
    }else{
      res.render("friend/detail",{
        rows : rows
      })
    }
  })
})

router.post('/man/add',function(req,res,next) {
  var sess = req.session;
  var r = req.body;
  var userid = sess.userid; // 현재 로그인중인사람의 아이디
  var comment = r.comment; // 입력한 한줄소개
  var sql = `select iuser_idx from iuser where iuser_id = ?` // idx 찾기
  var params = [userid];

  if(sess.userid != null){ // 로그인일때
    conn.query(sql,params,function(err,rows,field) {
      if(err){
        console.log(err);
        res.send("<script>alert('나는 한번만 등록할수 있습니다....!'); location.href='/'</script>");
      }
      else{
        var iuser_idx = rows[0].iuser_idx;
        sql = `select iuser_gender from iuser where iuser_idx = ?`
        params = [iuser_idx];
        conn.query(sql,params,function(err,rows,field) {
          if(rows[0].iuser_gender != "남자"){
            res.send(`<script>alert('남자 유저만 정보등록이 가능합니다.'); location.href='/';</script>`)
          }else{
            sql = `INSERT INTO ifman 
            (iuser_idx,ifman_comment) 
            values(?,?)`
            params = [iuser_idx,comment];
            conn.query(sql,params,function(err,rows,field) {
              if(err){
                console.log(err);
                res.send("<script>alert('나는 한번만 등록할수 있습니다....!'); location.href='/'</script>");
              }else{
                console.log('정보 올리기 정상!');
                res.send(`<script>alert('내 정보를 올렸습니다!!'); location.href='/';</script>`)
              }
            })
          }

        })
      }
    })
  }else{
    res.send("<script>alert('권한이 없습니다! 로그인을 해보세요!'); location.href='/'</script>");
  }
})



module.exports = router;