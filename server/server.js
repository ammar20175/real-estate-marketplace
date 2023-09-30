import express from "express";
import { APP_PORT } from "./config";
import connectDataBase from "./utils/connect";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import cors from "cors";

const app = express();

app.use(express.json());

//conncet to database

connectDataBase();

app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));

const PORT = process.env.PORT || APP_PORT;

//start the server
app.listen(PORT, () => {
	console.log(`server is up and running on port ${PORT}`);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

//error handler
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
