const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../modles");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({
            message: "no token proivided",
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            })
        }  
        req.userId = decoded.id;
        next();  
    })
}

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next()
            }
        }

        return  res.status(403).send({
            message: "Require Admin Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};

isModerator = async (req, res, next ) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({
            message: "require moderator role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "unable to validate moderator role!",
    });
    }
};

isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }

            if (roles[i].name === "admin") {
                return next();
            }
        }
         return res.status(403).send({
            message: "Require moderator or admin role!",
         })
        } catch (error) {
            return res.status(500).send({
                message: "unable to validate moderator or admin role!"
        })
    }
}

const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOradmin,
};
module.exports = authJwt;