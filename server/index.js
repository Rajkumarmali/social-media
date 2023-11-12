const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const { MONGO_URL } = require('./key');
const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors())

const connnectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL)
        console.log("Connected MongoDB")
    } catch (err) {
        console.log(err);
    }
}
connnectDB();

const authRouter = require('./routes/Auth');
app.use('/auth', authRouter);

const postRouter = require('./routes/Posts');
app.use('/post', postRouter);

const userRouter = require('./routes/users');
app.use('/user', userRouter);



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});