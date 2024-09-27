// import needed libraries
import express from "express";
import bodyParser from "body-parser";
import routes from "./routes";

// get express application
const app = express();
// body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// applying the routes to the basepath '/api'
app.use("/api", routes);

// Error handling middleware (optional)
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).send({
    message: "Internal Server Error",
    error: err.message || "Unknown error",
  });
});

export default app;