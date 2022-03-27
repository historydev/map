
export default function eventsPipe(req, res, eventSchema, validator, db) {
    db.query('events')
        .then(async collection => {

            const {client, find} = db;

            const id = +req.body.id;

            const events = validator({id}, eventSchema.getEvents);

            if(events) {
                find(collection, {userID: id}).then(data => {
                    if(data.length) {
                        return data
                    }
                    throw 'Events not found';
                }).then(events => {
                    res.send({events});
                    return events
                }).then(() => client.close()).catch(() => {
                    res.send({events:[]});
                }).finally(console.log);
            } else {
                console.error('Empty property in object user');
            }

        })
        .catch(console.error);
}