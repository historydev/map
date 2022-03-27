
export default function eventPipe(req, res, usersSessions, eventSchema, validator, db) {
    db.query('users')
        .then(async collection => {

            const {client, find} = db;

            const email = req.body.email, currEvent = req.body.event;
            const event = validator(currEvent, eventSchema.setEvent);

            if(event) {
                find(collection, {email}).then(data => {
                    if(data.length) {

                        if(usersSessions.find(user => user.id === data[0].id)) {
                            event.userID = data[0].id;

                            db.query('events').then(async collection => {

                                const lastEvent = await collection.find().sort({_id:-1}).limit(1).toArray();
                                const eventID = lastEvent.length ? lastEvent[0].id+1 : 1;

                                find(collection, {date: event.date}).then(events => {
                                    if(!events.length) {
                                        collection.insertMany([{id: eventID, ...event}]);
                                    }
                                });
                                find(collection, {name: event.name}).then(events => {
                                    res.send({events});
                                }).then(() => client.close()).catch(console.log);

                            }).catch(console.log);
                            return;
                        } else {
                            throw 'Not authorized';
                        }
                    }
                    throw 'Not authorized';
                }).catch(console.log);
            } else {
                console.error('Empty property in object event');
            }

        })
        .catch(console.error);
}