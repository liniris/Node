var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyParser = require('body-parser');
app.engine('ejs', engine);
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}))
// app.get('/hos',function(req,res){
//   res.render('hospital')
// })

const sqlite3 = require('sqlite3').verbose();
var hosid = [];
var thead = [];
var hosName = [];
var hosType = [];
var hosAddr = [];


var a = '新北市中和區';

//var all = [];
// open database in memory
let db = new sqlite3.Database('C:/Users/Lin iris/Desktop/專題/voyager_1/voyager.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});
// 查詢
db.serialize(() => {

  db.each(`SELECT*FROM hospitals where address="` + a + `"`, (err, rows) => {

    if (err) {
      console.error(err.message);
    }

    console.log(rows.id + "\t" + rows.name + "\t" + rows.type + "\t" + rows.address);
    //console.log(rows);
    //把查詢結果分別存入陣列
    hosid.push(rows.id);
    hosName.push(rows.name);
    hosType.push(rows.type);
    hosAddr.push(rows.address);
    //all.push(rows.id,rows.name,rows.type,rows.address);
    //欄位開頭
    thead = ["id", "name", "type", "address"];
    //查詢資料傳送到hospital
    app.get('/hosa', function (req, res) {
      res.render('hospital', { 'id': hosid, 'name': hosName, 'type': hosType, 'address': hosAddr, 'head': thead });

    })
    app.post('/hos', function (req, res) {
      console.log(req.body);
      a = req.body.addr1;
      console.log(a);
    })
  });

});
//關閉資料庫
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});

//監聽
var port = process.env.PORT || 3000;
app.listen(port);