const express = require("express");
const app = express();
// const mysql = require("mysql");
const port = process.env.PORT || 3000;

app.use("/assets", express.static(__dirname + "/public"));

app.set("view engine", "ejs");
const bodyparser = require("body-parser");

app.listen(port);
console.log(`App started and listening on ${port}`);

// const config = require("./config/config.js");
// console.log(config);

const db = require("./config/config");

app.get("/test", (req, res) => {
    console.log("DB test");
    try {
        db.query("SELECT 1 + 1 AS solution", (error, result) => {
            if (error) {
                console.log(error);
                res.send("DB error");
            }
            if (result) res.send("DB OK");
        });
    } catch (e) {
        console.log(e);
    }
});

app.get("/", (req, res) => {
    console.log("get list of todos");
    try {
        db.query("SELECT * from todolist", (error, result) => {
            if (error) {
                console.log(error);
                res.status(500).send();
            }
            if (result) res.status(200).send(result);
        });
    } catch (e) {
        console.log(e);
    }
});

app.get("/:personname", (req, res) => {
    // console.log(req.params.personname)
    let person = req.params.personname;
    console.log(`get list of todos for ${person}`);
    try {
        db.query(
            "SELECT * from todolist where personname=?",
            [person],
            (error, result) => {
                if (error) {
                    console.log(error);
                    res.status(500).send();
                }
                if (result) res.status(200).send(result);
            }
        );
    } catch (e) {
        console.log(e);
    }
});

app.use(bodyparser.json());

app.post("/", (req, res) => {
    console.log("add new todo");
    console.log([req.body]);
    try {
        let sql = "Insert into todolist set ?";
        db.query(sql, [req.body], (error, result) => {
            if (error) {
                console.log(error);
                res.send("DB error");
            }
            if (result) res.status(201).send("Todo Created");
        });
    } catch (e) {
        console.log(e);
    }
});

app.patch("/", (req, res) => {
    console.log("Update a todo by someone");
    let todoid = req.body.idtodo;
    let changedTodo = req.body;
    delete changedTodo.idtodo;
    console.log(changedTodo, todoid);
    let temp = { isdone: "1" };
    try {
        let sql = "Update todolist set ? where idtodo = ?";
        db.query(sql, [changedTodo, todoid], (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send();
            }
            console.log("updated");
            res.status(200).send();
        });
    } catch (e) {
        res.status(404);
        console.log(e);
    }
});

app.delete("/:id", (req, res) => {
    console.log("delete todo");
    let idtodo = req.params.id;
    try {
        let sql = "delete from todolist where idtodo=?";
        db.query(sql, idtodo, (err, result) => {
            if (err) throw err;
            console.log(`todo number ${idtodo} has been deleted`);
            res.status(200).send();
        });
    } catch (e) {
        console.log(e);
    }
});
