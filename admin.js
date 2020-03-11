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
    app.listen(8081);
    console.log('Server running on http://localhost:8081');
    console.log('database open')
});

app.get('/',function(req,res){
    sql='select * from Autori';
    db.all(sql,function(err,rows){
        autori=rows
        sql='select * from Libri';
        db.all(sql,function(err,rows){
            libri=rows;
            res.render('amministratore',{autori,libri});
        });
    });
});

app.post('/addautore',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `INSERT INTO Autori(id_autore,nome,cognome) VALUES(${id},'${req.body.nome}','${req.body.cognome}')`;
    db.run(sql);
});

app.get('/modificautore/:ID_autore',(req,res)=>{
    sql=`select * from Autori where id_autore = ${req.params.ID_autore}`;
    db.each(sql,(err,row)=>{
        res.render('modifica',{autore:row});
    });
});

app.post('/modifica',(req,res)=>{
    const id=parseInt(req.body.ID_autore);
    sql=`UPDATE Autori SET nome='${req.body.nome}',cognome='${req.body.cognome}' WHERE Autori.id_autore = ${id}`;
    db.run(sql)
    res.redirect("/");
});

app.post('/cancellautori',(req,res)=>{
    const id=parseInt(req.body.id_autore);
    let sql = `DELETE FROM Autori WHERE Autori.id_autore=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.post('/addlibri',(req,res)=>{
    const autore=parseInt(req.body.autore);
    const id=parseInt(req.body.id_libro);
    let sql = `INSERT INTO Libri(id_libro,titolo,autore) VALUES(${id},'${req.body.titolo}','${autore}')`;
    db.run(sql);
});

app.get('/modificalibri/:id',(req,res)=>{
    sql=`select * from Libri where id_libro = ${req.params.id}`;
    db.each(sql,(err,row)=>{
        res.render('libri',{libro:row});
    });
});

app.post('/modlibro',(req,res)=>{
    const id=parseInt(req.body.ID_libro);
    sql=`UPDATE Libri SET titolo='${req.body.titolo}' WHERE Libri.ID_libro = ${id}`;
    console.log(sql)
    db.run(sql)
    res.redirect("/");
});

app.post('/cancellalibro',(req,res)=>{
    const id=parseInt(req.body.id_libro);
    let sql = `DELETE FROM Libri WHERE Libri.id_libro=${id}`;
    db.run(sql)
    res.redirect('/');
});

app.use((req,res)=>{
    res.status(404);
    res.sendFile(path.join(__dirname,'public','index.html'));
});