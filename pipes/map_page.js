export default function mapPagePipe(req, res, usersSessions) {
    const {id} = req.body;
    if(!usersSessions.find(user => user.id === id)) {
        return res.send({auth: false});
    }
    return res.send({auth: true});
}