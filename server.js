const app = require("./app");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDatabase = require("./config/database");
// Handling Uncaught Excepions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to uncaught Exception`);

  process.exit(1);
});

//Config

dotenv.config({ path: "config/config.env" });

// Connecting to the database

connectDatabase();

app.get("/", (req, res) => {
  res.send("Connection is done by Akash");
});

app.use(
  cors({
    origin: ["http://localhost:3000","https://ecomfrontend.onrender.com/"]
  })
);


const server = app.listen(process.env.PORT, () => {
  console.log(` Server is working on http://localhost:${process.env.PORT}`);
});

// app.listen(4002, function () {
//   console.log("CORS-enabled web server listening on port 4002");
// });

// Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to unhandled Promise rejection`);

  server.close(() => {
    process.exit(1);
  });
});
