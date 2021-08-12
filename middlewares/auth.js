
//Midlleware require authentication
const requireAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.render('login', {
            message: "Please login to continue",
                layout: 'login'
            })
    }
};

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

module.exports = getHashedPassword;
module.exports = generateAuthToken;
module.exports = requireAuth