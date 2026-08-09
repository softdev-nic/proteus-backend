const express = require("express")
const app = express()
const dbConnect = require("./db")
const cors = require("cors")
const TaskManager = require("./controllers/tasksManager")
const registerUser = require("./controllers/registerUser")
const login = require("./controllers/login")
const auth = require("./middlewares/Auth")


app.use(cors())
app.use(express.json())

dbConnect()

app.post("/register", registerUser)
app.post("/login", login)
app.post("/assign-task", TaskManager.assignTasks)
app.delete("/delete-task/:taskId", TaskManager.deleteTask)
app.put("/change-priority/:taskId", TaskManager.changePriority)
app.put("/remove-member/:taskId", TaskManager.removeMember) 
app.post("/assign-member/:taskId", TaskManager.assignMember)
app.post("/get-all-tasks", TaskManager.getAllTasks)





app.listen(3000,()=>{
console.log("app is listening")
})
