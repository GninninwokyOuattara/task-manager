const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/user");
const Task = require("../../db/models/task");

//UserOne
const userOneID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: "userOne",
    email: "userOne@oner.com",
    password: "thebreakernewwavesDEAD?",
    tokens: [
        {
            token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
        },
    ],
};

//UserTwo
const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoID,
    name: "userTwo",
    email: "userTwo@twoer.com",
    password: "thebreakernewwavesDEAD?",
    tokens: [
        {
            token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET),
        },
    ],
};

//TASKS

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task One",
    completed: false,
    owner: userOneID,
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Two",
    completed: true,
    owner: userOneID,
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Three",
    completed: false,
    owner: userTwoID,
};

const taskFour = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Four",
    completed: false,
    owner: userTwoID,
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    const user = await new User(userOne).save();
    const user2 = await new User(userTwo).save();
    const task1 = await new Task(taskOne).save();
    const task2 = await new Task(taskTwo).save();
    const task3 = await new Task(taskThree).save();
    const task4 = await new Task(taskFour).save();
};

module.exports = {
    userOne,
    userTwo,
    userTwoID,
    userOneID,
    setupDatabase,
    taskOne,
};
