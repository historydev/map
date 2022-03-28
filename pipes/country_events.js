
export default function countryEventsPipe(req, res, eventSchema, validator, db) {
    db.query('events')
        .then(async collection => {

            const {id, name} = req.body;

            const events = validator({id, name}, eventSchema.countryEvents);

            if(events) {
                await db.find(collection, {userID: events.id, name: events.name}).then(data => {
                    if(data.length) {
                        return data
                    }
                    throw 'Events not found';
                }).then(events => {
                    res.send({events});
                    return events
                }).catch(err => {
                    console.log(err);
                    res.send({events:[]});
                }).finally(() => db.client.close());
            } else {
                console.error('Empty property in object user');
            }

        })
        .then(() => db.client.close())
        .catch(console.error);
}