const express = require('express');
const app = express();
//const cors = require('cors');
const bp = require('body-parser');

app.use(bp.json());
//app.use(cors());
app.use(express.static('static'));

const users = [
    {
        email: '123',
        password: '123',
        events: []
    }
];

app.get('/', (req, res) => {
    res.sendFile('./index.html');
});

app.get('/auth', (req, res) => {
    res.sendFile('./auth.html', {root: __dirname + '/static'});
});

app.post('/register', (req, res) => {
    const pass = Math.floor(Math.random() * 2000);
    users.push({
        ...req.body,
        events: [],
        password: pass.toString()
    });
    res.send({
        password: pass.toString()
    });
});

app.post('/auth', (req, res) => {
    const {email, password} = req.body;
    if(users.find(el => el.email === email)) {
        if(users.find(el => el.password === password)) {}
        else {
            return console.log('Incorrect pass');
        }
    } else {
        return console.log('Incorrect email');
    }
    res.send({
        email: email
    });
});

app.post('/setEvent', (req, res) => {
    const {email, event} = req.body;
    if(email && event) {
        const events = users.forEach(user => user.email === email ? user.events.push(event):user);
        res.send({
            events: events
        });
    }
});

app.post('/getEvents', (req, res) => {
    const {email} = req.body;
    const user = users.find(user => user.email === email)
    if(user) {
        const events = user.events;
        console.log(events);
        res.send({
            events: events
        });
    }
});

app.post('/clearEvents', (req, res) => {
    const {email} = req.body;
    if(email) {
        users.find(user => user.email === email).events = [];
    } else return
    res.send({})
});

app.listen(3000);