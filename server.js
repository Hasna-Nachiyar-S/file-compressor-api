console.log("SERVER.JS LOADED");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const compressRoutes = require("./routes/compressRoutes");

const app = express();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

if (!fs.existsSync("compressed")) {
  fs.mkdirSync("compressed");
}

app.use(cors());

app.use(
  express.json({
    limit: "50mb",
  }),
);

app.use("/compressed", express.static("compressed"));
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use("/compress", compressRoutes);
app.post("/test", (req, res) => {
  res.json({
    success: true,
    message: "test route works",
  });
});
app.get("/", (req, res) => {
  res.send("File Compressor API Running");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
