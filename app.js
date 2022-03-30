import express from 'express';
import bp from 'body-parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import userSchema from './schemas/user.js';
import eventSchema from './schemas/event.js';
import authPipe from "./pipes/auth.js";
import registerPipe from "./pipes/register.js";
import eventPipe from "./pipes/set_event.js";
import eventsPipe from "./pipes/get_events.js";
import countryEventsPipe from "./pipes/country_events.js";
import updateEventPipe from "./pipes/update_event.js";
import mapPagePipe from "./pipes/map_page.js";
import deleteEventPipe from "./pipes/delete_event.js";
import validator from "./validator.js";
import Connection from './mongo_db/config.js';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/static';
const app = express();
const usersSessions = [{id: 5}];

app.use(bp.json());
app.use(express.static('static'));

app.get('/', (req, res) => res.redirect('/auth'));

app.get('/user/:id/calendar', (req, res) => res.sendFile('./calendar.html', {root: __dirname}));

app.get('/user/:id', (req, res) => res.sendFile('./home.html', {root: __dirname}));

app.post('/isAuth', (req, res) => mapPagePipe(
    req,
    res,
    usersSessions,
    new Connection()
));

app.get('/auth', (req, res) => res.sendFile('./auth.html', {root: __dirname}));

app.post('/register', (req, res) => registerPipe(
    req,
    res,
    userSchema,
    validator,
    new Connection()
));

app.post('/auth', (req, res) => authPipe(
    req,
    res,
    usersSessions,
    userSchema,
    validator,
    new Connection()
));

app.post('/quit', (req, res) => {
    const index = usersSessions.findIndex(user => user.id === req.body.id);
    usersSessions.splice(index, 1);
    res.end();
});

app.post('/setEvent', (req, res) => eventPipe(
    req,
    res,
    usersSessions,
    eventSchema,
    validator,
    new Connection()
));

app.post('/getEvents', (req, res) => eventsPipe(
    req,
    res,
    eventSchema,
    validator,
    new Connection()
));

app.post('/getCountryEvents', (req, res) => countryEventsPipe(
    req,
    res,
    eventSchema,
    validator,
    new Connection()
));

app.post('/updateEvent', (req, res) => updateEventPipe(
    req,
    res,
    usersSessions,
    eventSchema,
    validator,
    new Connection()
));

app.post('/removeEvent', (req, res) => deleteEventPipe(
    req,
    res,
    new Connection()
));

app.listen(process.env.PORT || 3000);