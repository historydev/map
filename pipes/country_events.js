
export default function countryEventsPipe(req, res, eventSchema, validator, db) {
    db.query('events')
        .then(async collection => {

            const {client, find} = db;

            const {id, name} = req.body;

            console.log(id, name);

            const events = validator({id, name}, eventSchema.countryEvents);

            if(events) {
                find(collection, {userID: id, name}).then(data => {
                    if(data.length) {
                        return data
                    }
                    throw 'Events not found';
                }).then(events => {
                    client.close();
                    res.send({events});
                    return events
                }).catch(() => {
                    res.send({events:[]});
                }).finally(console.log);
            } else {
                console.error('Empty property in object user');
            }

        })
        .catch(console.error);
}