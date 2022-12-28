import express from 'express';
import { body, validationResult } from 'express-validator';
import fs from 'fs';

const app = express();
const PORT = 9797;

let contacts = [];

fs.readFile('./userData.json', (err, data) => {
    if (err) return console.log(err);
    contacts = JSON.parse(data)
});

app.set("view engine", "ejs");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { persons: contacts, errors: null });
});

app.post("/add",
    body('personFirstname').isLength({ min: 1, max: 50 }),
    body('personLastname').isLength({ min: 2, max: 50 }),
    body('personMail').isEmail(),
    body('personMessage').isLength({ min: 5, max: 200 }),
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.log(errors);
            return res.render("index", { persons: contacts, errors: errors });
        };

        contacts.push({ firstname: req.body.personFirstname, lastname: req.body.personLastname, mail: req.body.personMail, message: req.body.personMessage });
        console.log(contacts);


        fs.writeFile('./userData.json', JSON.stringify(contacts), (err) => {
            if (err) return console.log(err);
        });

        res.render("index", { persons: contacts, errors: null });
    });


app.listen(PORT, () => console.log("Der Server läuft auf Port: ", PORT));