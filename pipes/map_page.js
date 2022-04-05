export default function mapPagePipe(req, res, usersSessions, db) {
    const {email} = req.body;

    db.query('users').then(async collection => {

        await db.find(collection, {email: email}, {
            projection: {
                _id: 0,
                id: 1,
                email: 1,
                country: 1
            }
        }).then(user => {
            if(!usersSessions.find(currUser => currUser.id === user[0].id)) {
                return res.send({auth: false});
            }
            res.send(user);
        });

    }).catch(console.log).finally(() => db.client.close());
}