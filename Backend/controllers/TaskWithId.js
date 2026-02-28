import task from "../models/TasksModel.js"

const TaskWithId = async (req, res) => {
    try {
        const Task_ID = req.params.id
        const taskk = await task.findOne({ Task_ID })
        if (!taskk) {
            return res.status(215).json({status: false, message: "No such task available"})
        }

        return res.status(200).json({status: true, message: "Task Available", task: taskk})
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal Server Error"})
    }
}

export default TaskWithId