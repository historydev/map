export default function mapPagePipe(req, res, usersSessions, db) {
    const {id} = req.body;
    if(!usersSessions.find(user => user.id === id)) {
        return res.send({auth: false});
    }
    db.query('users').then(async collection => {

        await db.find(collection, {id: id}, {
            projection: {
                _id: 0,
                email: 1,
                country: 1
            }
        }).then(user => res.send(user));

    }).catch(console.log).finally(() => db.client.close());
}