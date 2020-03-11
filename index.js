const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

app = express();

app.set('views',path.join(__dirname,"views"));
app.set('view engine', 'ejs');
app.use('/css', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use( morgan('dev') );

let autori=[];
let libri=[];

const db = new sqlite3.Database('./test.db',function(){
    app.listen(80);
    console.log('Server running on http://localhost:80');
    console.log('database open')
});

app.get('/',function(req,res){
    sql='select * from Autori';
    db.all(sql,function(err,rows){
        autori=rows
        sql='select * from Libri';
        db.all(sql,function(err,rows){
            libri=rows;
            res.render('index',{autori,libri});
        });
    });
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','index.html'));
});