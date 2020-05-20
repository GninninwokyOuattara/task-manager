const express = require("express");
const Task = require("../db/models/task");
const auth = require("../middleware/auth");
const router = express.Router();

//get tasks
// router.get("/tasks", auth, async (req, res) => {
//     try {
//         // const task = await Task.find({});
//         const task = await Task.find({ owner: req.user._id });
//         if (!task) {
//             return res.status(404).send();
//         }
//         res.send(task);
//     } catch (error) {
//         res.status(500).send(error);
//     }
// });

//get /tasks?completed=true or all tasks if no parameters is provided.
//query string ?limit=&skip= (Pagination)
//limit to the maximum number of data to display
//skip for the number of data to skip
//sort, ?sortBy="":desc
router.get("/tasks", auth, async (req, res) => {
    //req.query.completed
    //user in req.user (auth)

    // console.log(req.query);

    const match = {};
    const sort = {};

    if (req.query.sortBy) {
        const sortString = req.query.sortBy.split(":");
        sort[sortString[0]] = sortString[1] === "desc" ? -1 : 1;
    }

    // if (sortString) {
    // }
    // console.log(sort);
    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    console.log(match);

    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort,
                },
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (error) {
        console.log(error);
        res.status(404).send();
    }
});

//get task
router.get("/tasks/:id", auth, async (req, res) => {
    // const task = await Task.findById(req.params.id);
    const task = await Task.findOne({
        _id: req.params.id,
        owner: req.user._id,
    });
    console.log(task);
    if (!task) {
        return res.status(404).send();
    }
    res.send(task);
});

//post tasks
router.post("/tasks", auth, async (req, res) => {
    // const task = new Task(req.body);
    const task = new Task({ ...req.body, owner: req.user._id });
    try {
        await task.save();
        return res.status(201).send(task);
    } catch (error) {
        return res.status(400).send(error);
    }
});

//update task

router.patch("/tasks/:id", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const updateAllowed = ["description", "completed"];
    const isValidOperation = updates.every((update) => {
        return updateAllowed.includes(update);
    });

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid field" });
    }
    try {
        // const task = await Task.findById(req.params.id);
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
        //     runValidators: true,
        //     new: true
        // });
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => (task[update] = req.body[update]));
        await task.save();

        res.send(task);
    } catch (error) {
        res.send(400).send(error);
    }
});

//DELETE

router.delete("/tasks/:id", auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
