require('dotenv').config();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        // const user = await Users.findOne({ where: { email: email } });
        // const passwordVerification = await bcrypt.compare(password, user.password);

        let p = new Promise((resolve, reject) => {
            const user = await Users.findOne({ where: { email: email } });
            const passwordVerification = await bcrypt.compare(password, user.password);
            if (user && passwordVerification) {
                resolve(user);
            } else if (!user) {
                reject("You have entered the wrong email");
            } else if (!passwordVerification) {
                reject("You have entered the wrong password")
            }
        });

        p.then((user) => {
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
            result.message = "Your login is successful!";
            return result;
        }).catch((msg) => {
            result.message = msg;
            result.status = 400;
            return result;
        })

        // let pPwd = new Promise((resolve, reject) => {
        //     const passwordVerification = await bcrypt.compare(password, user.password);
        //     if (passwordVerification) {
        //         resolve(passwordVerification)
        //     } else if (!passwordVerification) {
        //         reject("You have entered the wrong password")
        //     }
        // });



        // if (!user) {
        //     result.message = "User not found. You have entered the wrong email, please try logging in again.";
        //     result.status = 400;
        //     return result;
        // }

        // if (!passwordVerification) {
        //     result.message = "You have entered the wrong password";
        //     result.status = 400;
        //     return result;
        // }

        // if (user && passwordVerification) {
        //     const loginData = {
        //         userId: user.userId,
        //         username: user.username
        //     }

        //     const accessToken = jwt.sign(loginData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        //     const refreshToken = jwt.sign(loginData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        //     result.data = {
        //         accessToken: accessToken,
        //         refreshToken: refreshToken,
        //     };
        //     result.status = 200;
        //     result.message = "Your login is successful!";
        //     return result;
        // }
    }
}