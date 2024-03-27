// Initialize connection to our database GDPR in Mysql via Nodejs

var database = require('mysql2');

var mysqlconn = database.createConnection({
  host: "localhost",
  user: "root",
  password: "Pas$w0rd446500!!@@##",
  database: "GDPR",
  port: 3306
});

mysqlconn.connect(function(error) {
    if(error){
        console.log("Couldn't connect :(Error: " + error);
    } else {
        console.log("Connected successfully to GDPR Database!!!");

        var testquery = 'select * from users';

        mysqlconn.query(testquery, (error,  rows) => {
            if (error) throw error;
            console.log(rows);
        });
    }    
});


// End the connection with our database in mysql
/* mysqlconn.end(function(error) {
    if (error) {
        console.error("There was an issue with the closure process" + error.stack);
        return;
    }

    console.log("The connection with Mysql has ended successfully!!!");
}) */


