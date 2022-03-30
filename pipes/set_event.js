
export default function eventPipe(req, res, usersSessions, eventSchema, validator, db) {
    db.query('users')
        .then(async collection => {

            const email = req.body.email, currEvent = req.body.event;
            const event = validator(currEvent, eventSchema.setEvent);

            const date = event.date;

            console.log(date);

            if(event) {
                await db.find(collection, {email}).then(async data => {
                    if(data.length) {

                        if(usersSessions.find(user => user.id === data[0].id)) {
                            event.userID = data[0].id;

                            await db.query('events').then(async collection => {

                                const lastEvent = await collection.find().sort({_id:-1}).limit(1).toArray();
                                const eventID = lastEvent.length ? lastEvent[0].id+1 : 1;

                                await db.find(collection, {date: event.date}).then(events => {
                                    if(!events.length) {
                                        collection.insertMany([{id: eventID, ...event}]);
                                    }
                                });
                                await db.find(collection, {name: event.name, userID: event.userID}).then(events => {
                                    res.send({events});
                                })
                                .catch(console.log)
                                .finally(() => db.client.close());

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