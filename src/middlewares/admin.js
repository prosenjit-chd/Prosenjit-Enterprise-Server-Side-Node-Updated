const admin = require("firebase-admin");
const User = require("../models/user");
const serviceAccount = require("../../prosenjit-app-firebase-adminsdk-fla2z-a953039149.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function auth(req, res, next) {

    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers?.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            const user = await User.findOne({ email: decodedUser.email });

            if (!user && !user.admin) {
                throw new Error()
            }

            req.user = user
            // req.decodedEmail = decodedUser.email;
            next()
        }
        catch (e) {
            res.status(403).send({ error: 'Admin only' })
        }
    } else {
        res.status(403).send({ error: 'Admin only' })
    }
    // next()
}

module.exports = auth