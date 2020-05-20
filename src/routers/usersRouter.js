const express = require("express");
const User = require("../db/models/user");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const multer = require("multer");
const { sendWelcomeMail, sendGoodByeMail } = require("../mail/account");

const router = express.Router();
const upload = multer({
    // dest: "avatars",
    limits: {
        fileSize: 1000000,
    },

    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Invalid file format."));
        }

        cb(undefined, true);
    },
});

//get users
router.get("/users/me", auth, async (req, res) => {
    // console.log(req.user);
    res.send(req.user);
});
//get user
router.get("/user/:id", (req, res) => {
    console.log(req.params.id);
    User.findById(req.params.id)
        .then((user) => {
            if (!user) {
                res.status(404).send();
            }
            res.send(user);
        })
        .catch((e) => {
            res.status(500).send(e);
        });
});

//login
router.post("/users/login", async (req, res) => {
    //test
    // console.log("login endpoint : " + req.body.password);
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateAuthToken();
        res.send({
            user,
            token,
        });
    } catch (error) {
        // console.log(error);
        res.status(400).send({
            error,
        });
    }
});

router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            console.log(token.token);
            console.log(req.token);
            console.log(token.token === req.token);
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

//post user
router.post("/users", async (req, res) => {
    // console.log(req.body.password);
    const user = new User(req.body);
    try {
        await user.save();
        sendWelcomeMail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }

    // user.save()
    //     .then(() => {
    //         res.send(user);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //         res.status(400).send(e);
    //     });
});

//refactored update profile route
router.patch("/users/me", auth, async (req, res) => {
    // console.log(req.user);
    const updates = Object.keys(req.body);
    const updatesAllowed = ["name", "age", "email", "password"];
    const isValidOperation = updates.every((update) => {
        return updatesAllowed.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: "Non existant field" });
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });
        await req.user.save();
        const user = req.user;
        res.send(user);
    } catch (error) {
        // console.log(error);
        res.status(400).send(error.message);
    }
});

//update user
// router.patch("/users/:id", async (req, res) => {
//     const updates = Object.keys(req.body);
//     const updatesAllowed = ["name", "age", "email", "password"];
//     const isValidOperation = updates.every((update) => {
//         return updatesAllowed.includes(update);
//     });

//     if (!isValidOperation) {
//         res.status(400).send({ error: "Non existant field" });
//     }

//     try {
//         const user = await User.findById(req.params.id);

//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//         //     new: true,
//         //     runValidators: true

//         if (!user) {
//             return res.status(404).send();
//         }

//         updates.forEach((update) => (user[update] = req.body[update]));
//         await user.save();

//         res.send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// });

//delete user
// router.delete("/users/:id", async (req, res) => {
//     console.log(req.params.id);
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id);

//         if (!task) {
//             return res.status(404).send();
//         }

//         res.send(task);
//     } catch (error) {
//         res.status(400).send();
//     }
// });

router.delete("/users/me", auth, async (req, res) => {
    res.send("ok");
    try {
        await User.deleteOne({ _id: req.user._id });
        sendGoodByeMail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
});

//POST avatar
router.post(
    "/users/me/avatar",
    auth,
    upload.single("avatar"),
    async (req, res) => {
        // req.user.avatar = req.file.buffer;
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);

//DELETE avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        req.user.save();
        res.send();
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set("Content-Type", "image/jpg");
        res.send(user.avatar);
    } catch (error) {
        res.status(404).send({ error: error.message });
    }
});
module.exports = router;
