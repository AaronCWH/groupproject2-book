require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        let p = new Promise((resolve, reject) => {
            const user = await Users.findOne({ where: { email: email } });
            if (user) {
                resolve(user);
            } else if (!user) {
                reject(user);
            }
        })

        p.then((user) => {
            const passwordVerification = await bcrypt.compare(password, user.password);
            serviceErrorCatch(result, !passwordVerification, Constants.PASSWORD_INVALID, 400);
        }).catch((user) => {
            result.message = Constants.EMAIL_INVALID;
            result.status = 400;
            return result;
        })

        // serviceErrorCatch(result, !user, Constants.EMAIL_INVALID, 400);

        // const passwordVerification = await bcrypt.compare(password, user.password);

        // serviceErrorCatch(result, !passwordVerification, Constants.PASSWORD_INVALID, 400);

        // if (!user) {
        //     result.message = "You have entered the wrong email.";
        //     result.status = 400;
        //     return result;
        // }

        // const passwordVerification = await bcrypt.compare(password, user.password);

        // if (!passwordVerification) {
        //     result.message = "You have entered the wrong password.";
        //     result.status = 400;
        //     return result;
        // }

        const loginData = {
            userId: user.userId,
            username: user.username
        }

        const accessToken = jwt.sign(loginData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(loginData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        result.data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        
        result.status = 200;
        result.message = "Login is successful! Redirecting...";
        return result;
    }
}