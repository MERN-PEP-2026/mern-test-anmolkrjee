import express from "express"
const router = express.Router()
import Register from "../controllers/Register.js"
import Login from "../controllers/Login.js"
import TaskAdd from "../controllers/TaskAdd.js"


router.post('/api/auth/register', Register)
router.post('/api/auth/login', Login)
router.post('/api/addtasks', TaskAdd)


export default router