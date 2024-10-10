import express from "express"
import bodyParser from "body-parser";

const data = [];

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))


app.listen(PORT, function (err) {
    if (err) console.log("Erorr in server setup")
    console.log("Server listening on port ", PORT);
});

app.get("/", (req, res) => {
    res.render("index.ejs", { data: data });
});

app.get("/write", (req, res) => {
    res.render("form.ejs");
});

app.post("/post", (req, res) => {
    const inputTitle = req.body.inputTitle
    const inputContent = req.body.inputContent
    const today = new Date();
    data.unshift({
        title: inputTitle,
        content: inputContent,
        today: today.toShortFormat()
    })

    res.redirect("/");
});

app.get("/select-edit", (req, res) => {
    res.render("list-edit.ejs", { data: data });
});

app.post("/edit", (req, res) => {
    const index = req.body.radio
    if (index != null) {
        res.render("form-edit.ejs",
            {
                data: data,
                index: index
            })
    } else {
        res.redirect("/select-edit");
    }
});

app.post("/confirm-edit", (req, res) => {
    const index = req.body.radio
    const inputEditedTitle = req.body.inputTitle
    const inputEditedContent = req.body.inputContent

    data[index].title = inputEditedTitle
    data[index].content = inputEditedContent

    res.redirect("/");
});

app.get("/select-delete", (req, res) => {
    res.render("list-delete.ejs", { data: data });
});

app.post("/delete", (req, res) => {
    const index = req.body.radio
    if (index > -1) {
        data.splice(index, 1);
    }
    res.redirect("/");
});

Date.prototype.toShortFormat = function () {

    const monthNames = ["January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"];

    const day = this.getDate();

    const monthIndex = this.getMonth();
    const monthName = monthNames[monthIndex];

    const year = this.getFullYear();

    return `${monthName} ${day}, ${year}`;
}