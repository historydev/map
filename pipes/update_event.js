
export default function updateEventPipe(req, res, usersSessions, eventSchema, validator, db) {
    db.query('users')
        .then(async collection => {

            const {client, find} = db;

            const data = validator(req.body, eventSchema.updateEvent);
            const {email, date, event} = data;

            if(data) {
                find(collection, {email}).then(data => {
                    if(data.length) {

                        if(usersSessions.find(user => user.id === data[0].id)) {

                            db.query('events').then(async collection => {

                                collection.updateMany({id: event.id}, {$set: {date}}).then(() => {
                                    find(collection, {}).then(events => {
                                        console.log(events);
                                        res.send({events});
                                    }).then(() => client.close());
                                }).catch(console.log);

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