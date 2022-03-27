export default function deleteEventPipe(req, res, db) {
    const {id, name} = req.body;
    db.query('events').then(collection => {
        collection.deleteMany({id: id});
        db.find(collection, {name}).then(data => res.send({events: data}));
    }).then(() => db.client.close());
}