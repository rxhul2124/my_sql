const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express'); 
const app = express();
const path = require("path");
const methodOverride = require("method-override");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set ("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'app',
    password: 'Staar@1432'
});

let getRandom = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

// get request

app.get( "/" , (req,res) => {
    let q = "SELECT COUNT(*) FROM users";
    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let count = result[0]["COUNT(*)"];
            res.render("home.ejs", {count});
        });
    } catch (err) {
        console.log(err);
        res.send("There is some error in DATABASE");
    }
    
});

// show data route

app.get("/fetch", (req,res)=>{
    let q = "SELECT *  FROM users";
    try{
        connection.query(q, (err, users)=>{
            if(err) throw err;
            res.render("showUsers.ejs", {users});
        });
    }catch(err){
        console.log(err);
    }
});

// edit user route

app.get("/fetch/:id/edit", (req, res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id = "${id}"`;
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            res.render("edit.ejs",{result});
        })
    }catch(err){
        console.log(err);
    }
});

//update route for (DATABASE)

app.patch("/fetch/:id", (req, res)=>{
    let {id} = req.params;
    let { password : formPass, username: newUsername} = req.body;
    let q = `SELECT * FORM users WHERE id = '${id}'`;
    
    try{
        connection.query(q, (err, result)=>{
            if(err) throw err;
            if(formPass != user.password){
                res.send("Wrong password");
            }else{
                let q1 = `UPDATE users SET username='${newUsername}' WHERE id = '${id}'`;
                connection.query(q1, (err, result)=>{
                    if(err) throw err;
                    res.send(result);
                });
            }
        });
    }catch(err){
        console.log(err);
    }
});


// let q  = "INSERT INTO users VALUES ?";
// let data = [];
// for(let i=1; i<=100; i++){
//     data.push(getRandom());
// }

// try{
//     connection.query(q, [data], (err, result)=>{
//         if (err) throw err;
//         console.log("got data");
//     });
// }catch(err){
//     console.log("Error in Database");
// }

app.listen("8080", ()=>{
    console.log("app is listening to port - 8080");
});