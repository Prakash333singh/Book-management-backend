const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/connectDB");
const bookRouter = require("./routes/bookRoutes");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    credentials: true
}));

// Connecting to mongo database
connectDB();

// book routes (router)
app.use("/api", bookRouter);

// Home Route
app.get("/", (req,res) => {
    return res.send({
        "success": true,
        "error_code": null,
        "message": "Server is Running",
        "data": "Server is Live 🎉"
    });
});

// Server started on Port 8080
app.listen(process.env.PORT, () => {
    console.log("Server is running, Hurray!!");
});