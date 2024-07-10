import express from "express";

const app = express();

// Route
app.get("/", (req, res) => {
   res.send("Abhishek Gupta");
});

export default app;
