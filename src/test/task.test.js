const request = require("supertest");
const Task = require("../db/models/task");
const app = require("../app");
// const User = require("../db/models/user");
// const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const {
    userOne,
    userTwo,
    userOneID,
    setupDatabase,
    taskOne,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: "Task for userOne",
        })
        .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test("Should get tasks for userOne", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    expect(response.body.length).toEqual(2);
});

test("UserTwo should not be able to delete userOne first task", async () => {
    const response = await request(app)
        .delete(`/tasks/${userOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    const task = await Task.findById(taskOne._id);
    expect(task).not.toBeNull();
});
