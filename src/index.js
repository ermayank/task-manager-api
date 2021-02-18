const express = require('express');
require('./db/mongoose.js')
const User = require('./models/user.js');
const Task = require('./models/task.js')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request are disbled!')
//     } else{
//         next()
//     }
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on ' + port)
})

