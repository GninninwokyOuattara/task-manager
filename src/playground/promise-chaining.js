require("../db/mongoose");
const Task = require("../db/models/task");

_id = "5e8789fbbd5ed84f13e6dab9";

//remove a task by id

// Task.findByIdAndDelete(_id)
//   .then(task => {
//     console.log(task);
//     return Task.countDocuments({ completed: false });
//   })
//   .then(count => {
//     console.log(`Incomplete task : ${count}`);
//   })
//   .catch(e => {
//     console.log(e);
//   });

//With async/await

const deleteTaskAndCount = async _id => {
  const task = await Task.findByIdAndDelete(_id);
  const count = await Task.countDocuments({ completed: false });
  return count;
};

deleteTaskAndCount("5e87a5029a3068569a6f1285")
  .then(count => {
    console.log(count);
  })
  .catch(e => {
    console.log(e);
  });
