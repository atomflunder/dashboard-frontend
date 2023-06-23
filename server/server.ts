import { Database } from "sqlite3";
import express from "express";

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new Database("./data/database.db");

app.get("/", (req, res) => {
    res.send(
        `Hi! Listening on port ${port}. Available endpoints: /trueskill, /leaderboard, /commands, /profiles, /macro_get, /macro_new, /macro_delete`
    );
});

app.get("/trueskill", (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM trueskill");

        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });
        stmt.finalize();
    });
});

app.get("/leaderboard", (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM level");

        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });

        stmt.finalize();
    });
});

app.get("/commands", (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM commands");

        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });

        stmt.finalize();
    });
});

app.get("/profiles", (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM profile");

        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });

        stmt.finalize();
    });
});

app.get("/macro_get", (req, res) => {
    db.serialize(() => {
        const stmt = db.prepare("SELECT * FROM macros");

        stmt.all((err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        });

        stmt.finalize();
    });
});

app.post("/macro_new", (req, res) => {
    const { name, macro, uses, author } = req.body;

    db.serialize(() => {
        const stmt = db.prepare("INSERT INTO macros (name, payload, uses, author) VALUES (?, ?, ?, ?)");

        stmt.run(name, macro, uses, author, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success!");
            }
        });

        stmt.finalize();
    });
});

app.post("/macro_delete", (req, res) => {
    const { name } = req.body;

    db.serialize(() => {
        const stmt = db.prepare("DELETE FROM macros WHERE name = ?");

        stmt.run(name, (err) => {
            if (err) {
                console.log(err);
            } else {
                res.send("Success!");
            }
        });

        stmt.finalize();
    });
});

// Listen on the port
app.listen(port);

// Close the database connection when the process is exited.
process.on("exit", () => {
    db.close();
});
