import task from "../models/TasksModel.js"

const GetAllTask = async (req, res) => {
    try {
        const { User_ID } = req.body
        const allUserTask = await task.find({ User_ID })
        if (!allUserTask) {
            return res.status(215).json({status: false, message: "No Task Found"})
        }

        return res.status(200).json({status: true, message: "Task Retrieved", task: allUserTask})
    } catch (error) {
        return res.status(500).json({status: false, message: "Internal Server Error", err: error})
    }
}

export default GetAllTask