import task from "../models/TasksModel.js"

const getId = () => {
    let ans = ""
    for (let i = 1; i <= 6; i++) {
        const digit = Math.floor(Math.random() * 10);
        ans += digit.toString();
    }

    return ans
}

const TaskAdd = async (req, res) => {
    try {
        const { User_ID, title, description, dueDate, priorityLevel } = req.body
        let Task_ID = "T" + getId()

        const taskk = new task({
            Task_ID,
            User_ID,
            title,
            description,
            dueDate,
            priorityLevel,
            status: "To Do",
        })

        const newTask = await taskk.save()
        if (!newTask) {
            return res.status(215).json({status: false, message: "Task did not saved"})
        }

        return res.status(200).json({status: true, message: "Task saved", id: Task_ID})

    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

export default TaskAdd