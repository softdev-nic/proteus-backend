const express = require("express")
const app = express()
const dbConnect = require("./db")
const cors = require("cors")
const dotenv = require("dotenv")
dotenv.config()
const TaskManager = require("./controllers/tasksManager")
const registerUser = require("./controllers/registerUser")
const login = require("./controllers/login")
const auth = require("./middlewares/Auth")
const authMiddleware = require("./middlewares/Auth")



app.use(cors())
app.use(express.json())

dbConnect()
app.post("/test",(req,res)=>{
res.status(200).json({response:"ok"})
})

app.post("/register", registerUser)
app.post("/login", login)
app.post("/assign-task",auth, TaskManager.assignTasks)
app.delete("/delete-task/:taskId",auth, TaskManager.deleteTask)
app.put("/change-priority/:taskId",auth, TaskManager.changePriority)
app.put("/remove-member/:taskId",auth, TaskManager.removeMember) 
app.post("/assign-member/:taskId",auth, TaskManager.assignMember)
app.post("/get-all-tasks",auth, TaskManager.getAllTasks)
app.post("/task-maker",auth,TaskManager.taskMaker)
app.get("/taskdetails",TaskManager.getTaskDetails)
app.get("/gettasks",TaskManager.getTasks)
app.get("/self-tasks",authMiddleware,TaskManager.getSelfTasks)






app.listen(process.env.PORT,()=>{
console.log("app is listening")
})
