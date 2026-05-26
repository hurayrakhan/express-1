import express, { type Application, type Request, type Response } from 'express';
const app : Application = express();
const PORT = 5000;


app.get("/", (req : Request, res : Response) => {
    // res.send("Hello World")
    res.status(200).json({
        "message": "Express server is running successfully!"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
