import express from "express"
const router = express.Router()
import Register from "../controllers/Register.js"
import Login from "../controllers/Login.js"
import TaskAdd from "../controllers/TaskAdd.js"
import TaskWithId from "../controllers/TaskWithId.js"
import TaskUpdate from "../controllers/TaskUpdate.js"



router.post('/api/auth/register', Register)
router.post('/api/auth/login', Login)
router.post('/api/addtasks', TaskAdd)
router.get('/api/tasks/:id', TaskWithId)
router.put('/api/tasks/:id', TaskUpdate)


export default router