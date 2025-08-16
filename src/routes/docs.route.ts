import { Router } from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

export const docsRoute = Router();

if (fs.existsSync("swagger.json")) {
  try {
    docsRoute.use("/", swaggerUi.serve);
    docsRoute.get("/", (req, res) => {
      const swaggerDocument = JSON.parse(
        fs.readFileSync("swagger.json", "utf-8")
      );
      const html = swaggerUi.generateHTML(swaggerDocument);
      res.send(html);
    });
    // docsRoute.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (err) {
    console.error("Failed to setup swagger:", err);
  }
} else {
  docsRoute.get("/", (req, res) => {
    res.status(500).json({ message: "Swagger docs unavailable" });
  });
  console.error("No swagger.json, failed to setup swagger!");
}
