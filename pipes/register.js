
export default function registerPipe(req, res, userSchema, validator, db) {
    console.log(db);
    db.query('users')
        .then(async collection => {

            const {client, find} = db;

            const lastUser = await collection.find().sort({_id:-1}).limit(1).toArray();
            const userID = lastUser[0].id+1;
            const pass = Math.floor(Math.random() * 2000).toString();

            const currUser = {
                id: userID,
                ...req.body,
                password: pass
            }

            const user = validator(currUser, userSchema.register);

            if(user) {
                find(collection, {email: user.email}).then(data => {
                    if(!data.length) {
                        return collection.insertMany([user]).then(console.log)
                    }
                    throw 'Such user found';
                }).then((data) => {
                    client.close();
                    res.send({password: pass});
                    return data
                }).catch(() => {
                    res.send({
                        error: 'Данный email занят'
                    });
                });
            } else {
                console.error('Empty property in object user');
            }

        })
        .catch(console.error);
}