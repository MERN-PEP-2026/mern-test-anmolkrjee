import task from "../models/TasksModel.js"

const TaskDelete = async (req, res) => {
    try {
        const Task_ID = req.params.id
        const deleteTask = await task.deleteOne({ Task_ID })
        
        if (deleteTask.deletedCount === 0) return res.status(215).json({ status: false, message: "Task not deleted" })
        
        return res.status(200).json({status: true, message: "Task Deleted"})
    } catch (err) {
        return res.status(500).json({status: false, message: "Internal Server Error", error: err})
    }
}

export default TaskDelete