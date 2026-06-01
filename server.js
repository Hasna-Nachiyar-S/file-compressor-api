const express = require("express");
const cors = require("cors");

const compressRoutes = require("./routes/compressRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/compress", compressRoutes);

app.use("/compressed", express.static("compressed"));

app.get("/", (req, res) => {
  res.send("File Compressor API Running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
