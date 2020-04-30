const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true,
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            requred: true,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model("Task", taskSchema);

// taskSchema.pre("save", async function (next) {
//     if(this.isModified())
// });

module.exports = Task;
