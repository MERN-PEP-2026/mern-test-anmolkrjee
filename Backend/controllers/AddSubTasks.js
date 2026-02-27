import task from "../models/TasksModel.js";

const getId = () => {
    let ans = ""
    for (let i = 1; i <= 6; i++) {
        const digit = Math.floor(Math.random() * 10);
        ans += digit.toString();
    }

    return ans
}

const AddSubTask = async (req, res) => {
    try {
        const Task_ID = req.params.id
        const { title } = req.body
        console.log(title)

        if (!title) {
            return res.status(200).json({status: true})
        }

        const subTask_ID = "ST" + getId()
        const addSubTask = await task.updateOne(
            { Task_ID },
            {
                $push: {
                    subTask: {
                        subTask_ID,
                        title,
                        status: "To Do"
                    }
                }
            }
        )

        if (addSubTask.modifiedCount === 0) {
            return res.status(215).json({message: "Sub Task Addition failed"})
        }

        return res.status(200).json({message: "Sub Task added"})
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

export default AddSubTask