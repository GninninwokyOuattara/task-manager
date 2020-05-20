const request = require("supertest");
const app = require("../app");
const User = require("../db/models/user");
const jwt = require("jsonwebtoken");
const { userOne, userOneID, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("User should be created", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "testuser",
            email: "testuser@gtest.com",
            password: "thebreakernewwavesDEAD?",
        })
        .expect(201);
});

test("User should login", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);

    //Validate new token is saved

    //Fetch user from database
    const user = await User.findById(response.body.user._id);

    //Assert that token i response match user second token
    expect(response.body.token).toBe(user.tokens[1].token);
});

test("User login should fail", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: "KAKEKEKEKEKEKEKE?",
        })
        .expect(400);
});

test("Should get user profile", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

// test("Validate user is removed", async () => {
//     const response = await request(app)
//         .delete("/users/me")
//         .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200);

//     const user = await User.findById(userOneID);
//     expect(user).toBe(null);
// });

test("Should delete account for user", async () => {
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    //Should validate that user has been removed
    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
});

test("Should not delete unAuthentificated user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", "Bearer ")
        .send()
        .expect(401);
});

test("should update valide user field", async () => {
    const response = await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ name: "renameUserOne" })
        .expect(200);

    //Validate that user name has been changed
    const user = await User.findById(userOneID);
    expect(user.name).toEqual("renameUserOne");
});

test("Should not update invalid user field", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({ namel: "2" })
        .expect(400);

    //Validate that username has not changed
    const user = await User.findById(userOneID);
    expect(user.name).toEqual(userOne.name);
});
