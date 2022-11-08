var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'qna'
})

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    var user = "CREATE TABLE IF NOT EXISTS users (id int AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), created_at DATE)";
    con.query(user, function (err, result) {
        if (err) throw err;
        console.log("User table created");
    });

    var question = "CREATE TABLE IF NOT EXISTS questions (id int AUTO_INCREMENT PRIMARY KEY, question VARCHAR(255), created_at DATE)";
    con.query(question, function (err, result) {
        if (err) throw err;
        console.log("Question table created");
    });

    var question = "CREATE TABLE IF NOT EXISTS answers (id int AUTO_INCREMENT PRIMARY KEY, question_id int, answer VARCHAR(255), created_at DATE)";
    con.query(question, function (err, result) {
        if (err) throw err;
        console.log("Answer table created");
    });

    // seed user
    var userData = "INSERT INTO users(username, password, created_at) VALUES('root','password',now())";
    con.query(userData, function (err, result) {
        if (err) throw err;
        console.log("Seed User completed");
    });

    con.end();
});
