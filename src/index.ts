import express from "express";
import { apiRoute } from "./routes/api.route.js";
import swaggerUi from "swagger-ui-express";
import fs from "fs";

const app = express();

if (fs.existsSync("swagger.json")) {
  try {
    const swaggerDocument = JSON.parse(
      fs.readFileSync("swagger.json", "utf-8")
    );
    console.log(swaggerDocument);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.error("Failed to setup swagger:", err);
  }
} else {
  app.use("/docs", (req, res) => {
    res.status(500).json({ error: "Swagger docs unavailable" });
  });
  console.error("No swagger.json, failed to setup swagger!");
}

app.use("/api/v1/", apiRoute);

app.get("/", (req, res) => {
  res.json({
    message: `Welcome to OpenBoard! For documentation, visit ${req.protocol}://${req.host}/docs`,
  });
});

app.listen(8080, () => {
  console.log("Listening on http://localhost:8080/");
});
