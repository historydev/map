import express from 'express';
import bp from 'body-parser';
import {MongoClient} from 'mongodb';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import userSchema from './schemas/user.schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/static';

const app = express();
app.use(express.static('static'));

const url = 'mongodb+srv://historydev:aasus2001@map1.gufrr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(url);

const dbName = 'map';

async function query(collectionName) {
    await client.connect();
    const db = client.db(dbName);
    return db.collection(collectionName);
}

app.use(bp.json());
//app.use(cors());
app.use(express.static('static'));

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

app.get('/user/:id/calendar', (req, res) => {
    res.sendFile('./calendar.html', {root: __dirname})
});

app.get('/user/:id', (req, res) => {
    const {id} = req.params;
    const userID = users.find(el => `id${el.id}` === id);
    if(userID) return res.sendFile('./index.html', {root: __dirname});
    res.redirect('/auth');
});

app.get('/auth', (req, res) => {
    res.sendFile('./auth.html', {root: __dirname});
});

app.post('/register', (req, res) => {
    const pass = Math.floor(Math.random() * 2000).toString();
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

    // query('users')
    //     .then(async collection => {
    //
    //         const user = {};
    //
    //         const currUser = {
    //             id: 1,
    //             name: 'John',
    //             email: '123',
    //             date: '22.02.2022',
    //             phone: '123'
    //         }
    //
    //         for(let key in userSchema) {
    //             if(currUser[key] && typeof userSchema[key] === typeof currUser[key]) {
    //                 user[key] = currUser[key];
    //             }
    //         }
    //
    //         if(Object.keys(user).length === Object.keys(userSchema).length) {
    //             await collection.find({email: user.email}).toArray().then(data => {
    //                 if(!data.length) {
    //                     return collection.insertMany([user]).then(console.log)
    //                 }
    //                 throw 'Such user found';
    //             }).then((data) => {
    //                 client.close();
    //                 return data
    //             }).catch(console.error).finally(console.log);
    //         } else {
    //             console.error('Empty property in object user');
    //         }
    //
    //     })
    //     .catch(console.error);

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
            error: 'Такой пользователь не найден'
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
    const user = users.find(user => user.email === email && user.isAuth);
    if(user && email && event) {
        user.events.push(event);
        const events = users.find(user => user.email === email).events.filter(el => el.name === event.name);
        return res.send({
            events: events
        });
    }
    res.send({
        events: []
    });
});

app.post('/getEvents', (req, res) => {
    const {id} = req.body;
    const user = users.find(user => user.id === id);
    if(user) {
        const events = user.events;
        console.log(events);
        return res.send({
            events: events
        });
    }
    res.send({
        events: []
    });
});

app.post('/getCountryEvents', (req, res) => {
    const {id, name} = req.body;
    const user = users.find(user => user.id === id);
    if(user) {
        const events = user.events.filter(el => el.name === name);
        console.log(events);
        return res.send({
            events: events
        });
    }
    res.send({
        events: []
    });
});

app.post('/updateEvent', (req, res) => {
    const {event, email, date} = req.body;
    const user = users.find(user => user.email === email && user.isAuth);
    if(user && email && event && date) {
        const index = user.events.findIndex(el => el.name === event.name && el.date === event.date);
        if(index >= 0) user.events[index].date = date;
        const events = user.events.filter(el => el.name === event.name);
        return res.send({
            events: events
        });
    }
    res.send({
        events: []
    });
});

app.post('/removeEvent', (req, res) => {
    const {event, email} = req.body;
    const user = users.find(user => user.email === email && user.isAuth);
    if(user && email && event) {
        const index = user.events.findIndex(el => el.name === event.name && el.date === event.date);
        if(index >= 0) user.events.splice(index, 1);
        const events = user.events.filter(el => el.name === event.name);
        return res.send({
            events: events
        });
    }
    res.send({
        events: []
    });
});

app.post('/clearEvents', (req, res) => {
    const {email} = req.body;
    if(email) {
        users.find(user => user.email === email && user.isAuth).events = [];
    } else return
    res.send({})
});

app.listen(process.env.PORT || 3000);