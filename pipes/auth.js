
export default function authPipe(req, res, usersSessions, userSchema, validator, db) {
    db.query('users')
    .then(async collection => {

        const {email, password} = req.body;
        const currUser = {
            email: email,
            password: password
        }

        const user = validator(currUser, userSchema.auth);

        if(user) {
            await db.find(collection, user).then(data => {
                if(data.length) {
                    usersSessions.push({id: data[0].id});
                    return data[0]
                }
                throw 'User not found';
            }).then((data) => {
                res.send({
                    email: email,
                    id: data.id,
                    isAuth: true
                });
                return data
            }).catch(() => {
                res.send({
                    error: 'Такой пользователь не найден'
                });
            }).finally(() => db.client.close());
        } else {
            console.error('Empty property in object user');
        }

    })
    .catch(console.error);
}