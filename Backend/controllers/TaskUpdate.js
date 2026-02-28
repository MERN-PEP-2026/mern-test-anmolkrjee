import task from "../models/TasksModel.js"

const TaskUpdate = async (req, res) => {
    try {
        const Task_ID = req.params.id
        const { title, description, dueDate, priorityLevel, status, subTaskStatus, subTaskTitle } = req.body

        const updateFields = {};

        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (dueDate !== undefined) updateFields.dueDate = dueDate;
        if (priorityLevel !== undefined) updateFields.priorityLevel = priorityLevel;
        if (status !== undefined) updateFields.status = status;
        if (subTaskTitle || subTaskStatus) {
            const subTaskUpdate = {};
            if (subTaskTitle !== undefined) subTaskUpdate.title = subTaskTitle
            if (subTaskStatus !== undefined) subTaskUpdate.status = subTaskStatus
            updateFields.subTask = subTaskUpdate
        }

        const updateTask = await task.updateOne(
            { Task_ID },
            { $set: updateFields }
        )

        if (updateTask.modifiedCount === 0) {
            return res.status(215).json({ status: false, message: "Updation Failed" })
        }

        return res.status(200).json({ status: true, message: "Task updated", task: updateTask })
    } catch (err) {
        return res.status(500).json({ status: false, message: "Internal Server Error", error: err })
    }
}

export default TaskUpdate