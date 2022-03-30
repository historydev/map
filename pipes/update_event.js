
export default function updateEventPipe(req, res, usersSessions, eventSchema, validator, db) {
    db.query('users')
        .then(async collection => {

            const data = validator(req.body, eventSchema.updateEvent);
            const {email, date, event} = data;

            if(data) {
                await db.find(collection, {email}).then(data => {
                    if(data.length) {

                        if(usersSessions.find(user => user.id === data[0].id)) {

                            db.query('events').then(async collection => {

                                await db.find(collection, {id: event.id}).then(async data => {
                                    await collection.updateMany({id: event.id}, {$set: {date}}).then(async () => {
                                        await db.find(collection, {userID: data[0].userID, name: data[0].name}).then(events => {
                                            res.send({events});
                                        });
                                    }).catch(console.log);
                                }).then(() => db.client.close());

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