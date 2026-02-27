import mongoose from 'mongoose'

const subTaskSchema = new mongoose.Schema({
    subTask_ID: {
        type: String
    },
    title: {
        type: String
    },
    status: {
        type: String
    }
})

const taskSchema = new mongoose.Schema({
    Task_ID: {
        type: String
    },
    User_ID: {
        type: Number
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    dueDate: {
        type: String
    },
    priorityLevel: {
        type: String
    },
    status: {
        type: String
    },
    subTask: [subTaskSchema]
}, { timestamps: true })

const task = mongoose.model("task", taskSchema)

export default task