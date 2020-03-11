creare le tabelle su sqlite3

CREATE TABLE Autori(ID_autore int,nome text,cognome text,primary key (ID_autore));

CREATE TABLE Libri(ID_libro int,titolo text,autore int,primary key (ID_libro));
