import app from "./app";
// get the port from the environment variable or use 3000
const port = 3000;
app.listen(port, () =>
  console.log(`App is listening on http://localhost:${port}`)
);