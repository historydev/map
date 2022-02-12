const express = require('express');
const app = express();
//const cors = require('cors');
const bp = require('body-parser');
const path = require('path');

app.use(bp.json());
//app.use(cors());
app.use(express.static('static'))

const users = [
    {
        id: '1',
        email: '123',
        password: '123',
        events: [],
        isAuth: false
    }
];

app.get('/', (req, res) => {
   res.sendFile('./auth.html');
});

app.get('/user/:id', (req, res) => {
    const {id} = req.params;
    const userID = users.find(el => `id${el.id}` === id && el.isAuth);
    if(userID) return res.sendFile('./index.html', {root: __dirname + '/static'});
    res.redirect('/auth');
});

app.get('/auth', (req, res) => {
    res.sendFile('./auth.html', {root: __dirname + '/static'});
});

app.post('/register', (req, res) => {
    const pass = Math.floor(Math.random() * 2000);
    const userID = users.length+1;
    if(!users.find(el => el.email === req.body.email)) {
        users.push({
            id: userID,
            ...req.body,
            events: [],
            password: pass.toString()
        });
        res.send({
            password: pass.toString()
        });
    } else {
        res.send({
            error: 'Данный email занят'
        });
    }
});

app.post('/auth', (req, res) => {
    const {email, password} = req.body;
    const user = users.find(el => el.email === email);
    if(user) {
        if(user.password === password) {
            user.isAuth = true;
        }
        else {
            return res.send({
                error: 'Неверный пароль'
            });
        }
    } else {
        return res.send({
            error: 'Неверный email'
        });
    }
    res.send({
        email: email,
        id: user.id,
        isAuth: user.isAuth
    });
});

app.post('/setEvent', (req, res) => {
    const {email, event} = req.body;
    if(email && event) {
        users.forEach(user => user.email === email ? user.events.push(event):user);
        const events = users.find(user => user.email === email).events.filter(el => el.name === event.name);
        res.send({
            events: events
        });
    }
});

app.post('/getEvents', (req, res) => {
    const {email} = req.body;
    const user = users.find(user => user.email === email);
    if(user) {
        const events = user.events;
        console.log(events);
        res.send({
            events: events
        });
    }
});

app.post('/getCountryEvents', (req, res) => {
    const {email, name} = req.body;
    const user = users.find(user => user.email === email);
    if(user) {
        const events = user.events.filter(el => el.name === name);
        console.log(events);
        res.send({
            events: events
        });
    }
});

app.post('/updateEvent', (req, res) => {
    const {event, email, date} = req.body;
    const user = users.find(user => user.email === email);
    if(email && event && date) {
        const index = user.events.findIndex(el => el.name === event.name && el.date === event.date);
        if(index >= 0) user.events[index].date = date;
        const events = user.events.filter(el => el.name === event.name);
        res.send({
            events: events
        });
    }
});

app.post('/removeEvent', (req, res) => {
    const {event, email} = req.body;
    const user = users.find(user => user.email === email);
    if(email && event) {
        const index = user.events.findIndex(el => el.name === event.name && el.date === event.date);
        if(index >= 0) user.events.splice(index, 1);
        const events = user.events.filter(el => el.name === event.name);
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

app.listen(process.env.PORT || 3000);