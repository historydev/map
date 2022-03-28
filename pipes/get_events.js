
export default function eventsPipe(req, res, eventSchema, validator, db) {
    db.query('events')
        .then(async collection => {

            const id = +req.body.id;

            const events = validator({id}, eventSchema.getEvents);

            if(events) {
                await db.find(collection, {userID: id}).then(data => {
                    if(data.length) {
                        return data
                    }
                    throw 'Events not found';
                }).then(events => {
                    res.send({events});
                    return events
                })
                .catch(() => {
                    res.send({events:[]});
                }).finally(() => db.client.close());
            } else {
                console.error('Empty property in object user');
            }

        })
        .catch(console.error);
}