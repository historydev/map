export default function deleteEventPipe(req, res, db) {
    const {id, name} = req.body;
    db.query('events').then(async collection => {
        collection.deleteMany({id: id});
        await db.find(collection, {name}).then(data => res.send({events: data}));
    }).finally(() => db.client.close());
}