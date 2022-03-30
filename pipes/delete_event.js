export default function deleteEventPipe(req, res, db) {
    const {id, name} = req.body;
    db.query('events').then(async collection => {

        await db.find(collection, {id}).then(async data => {
            await collection.deleteOne({id: data[0].id});
            await db.find(collection, {userID: data[0].userID, name}).then(data => {
                res.send({events: data});
            });
        });

    }).then(() => db.client.close());
}