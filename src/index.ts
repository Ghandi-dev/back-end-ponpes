import express from "express";
import { PORT } from "./utils/env";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes/index";
import errorMiddleware from "./middlewares/error.middleware";
import { checkConnection } from "./db";
import { runInitialSppCheck } from "./cron/init";
import "./cron/index";

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from back-end-acara!",
    data: null,
  });
});

// docs(app);

app.use(errorMiddleware.serverRoute());
app.use(errorMiddleware.serverError());

async function init() {
  try {
    checkConnection();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    await runInitialSppCheck();
  } catch (error) {
    console.log(error);
  }
}

init();
export default app;
