const express = require("express");
const ejs = require("ejs");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const veternaryRouter = require("./routes/veternaryRouter");
const supplierRouter = require("./routes/supplierRouter");
const farmerRouter = require("./routes/farmerRouter");
const foodRequestsRouter = require("./routes/foodRequestRouter");
const farmStatusRouter = require("./routes/farmStatusRouter");
const typeOfFeedRouter = require("./routes/typeOfFeedRouter");
const specializationsRouter = require("./routes/specializationsRouter");
const typeOfChickenRouter = require("./routes/typeOfChicken");
const locationRouter = require("./routes/addressRouter");
const dashboardRouter = require("./routes/dashboardRouter");
const appointmentRouter = require("./routes/appointmentRouter");
const transactionsRouter = require("./routes/transactionRouter");
const app = express();

app.use(morgan("dev"));
app.use(
	cors({
		origin: true,
		credentials: true,
	})
);
app.use(
	compression({
		level: 1,
	})
);
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.use("/api/v1/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/veterinaries", veternaryRouter);
app.use("/api/v1/specializations", specializationsRouter);
app.use("/api/v1/suppliers", supplierRouter);
app.use("/api/v1/farmers", farmerRouter);
app.use("/api/v1/foodrequests", foodRequestsRouter);
app.use("/api/v1/farmstatus", farmStatusRouter);
app.use("/api/v1/typeoffeeds", typeOfFeedRouter);
app.use("/api/v1/typeofchicken", typeOfChickenRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/transactions", transactionsRouter);

module.exports = app;
