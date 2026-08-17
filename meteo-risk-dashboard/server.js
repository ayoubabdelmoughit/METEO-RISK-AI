// ========================================
// METEO-RISK AI
// DASHBOARD BACKEND
// NODE.JS + EXPRESS + MONGODB
// ========================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();


// ========================================
// MIDDLEWARES
// ========================================

app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "public")
  )
);


// ========================================
// MONGODB CONFIG
// ========================================

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {

  console.error(
    "❌ MONGODB_URI absent dans le fichier .env"
  );

  process.exit(1);
}

const client = new MongoClient(mongoUri);

let db;


// ========================================
// CONNECT MONGODB
// ========================================

async function connectMongoDB() {

  try {

    await client.connect();

    db = client.db(
      process.env.DB_NAME || "Meteo"
    );

    console.log("✅ MongoDB connected");

  } catch (error) {

    console.error(
      "❌ MongoDB connection error:",
      error.message
    );

  }
}

connectMongoDB();


// ========================================
// API - LATEST RISK
// ========================================

app.get(
  "/api/risk/latest",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          error: "MongoDB not connected"
        });

      }

      const data = await db
        .collection("Meteo_Risk")
        .findOne(
          {},
          {
            sort: {
              created_at: -1
            }
          }
        );

      if (!data) {

        return res.json({
          message: "No risk data found"
        });

      }

      res.json(data);

    } catch (error) {

      console.error(
        "Latest Risk API error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// ========================================
// API - LATEST INCIDENT + HISTORY
// ========================================

app.get(
  "/api/incidents/latest",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          error: "MongoDB not connected"
        });

      }


      // ====================================
      // GET LATEST INCIDENT
      // ====================================

      const incidentData = await db
        .collection("Meteo_Incidents")
        .findOne(
          {},
          {
            sort: {
              "incident.created_at": -1
            }
          }
        );


      // ====================================
      // AUCUN INCIDENT
      // ====================================

      if (!incidentData) {

        return res.json({
          incident: null,
          intervention: null,
          history: []
        });

      }


      // ====================================
      // GET INCIDENT ID
      // ====================================

      const incidentId =
        incidentData.incident?.incident_id;


      // ====================================
      // GET INCIDENT HISTORY
      // ====================================

      let history = [];

      if (incidentId) {

        history = await db
          .collection(
            "Meteo_Incident_History"
          )
          .find({
            incident_id: incidentId
          })
          .sort({
            timestamp: 1
          })
          .toArray();

      }


      // ====================================
      // RESPONSE
      // ====================================

      res.json({

        ...incidentData,

        history

      });

    } catch (error) {

      console.error(
        "Latest Incident API error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// ========================================
// API - INCIDENT HISTORY BY ID
// ========================================

app.get(
  "/api/incidents/:incidentId/history",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          error: "MongoDB not connected"
        });

      }

      const incidentId =
        req.params.incidentId;

      const data = await db
        .collection(
          "Meteo_Incident_History"
        )
        .find({
          incident_id: incidentId
        })
        .sort({
          timestamp: 1
        })
        .toArray();

      res.json(data);

    } catch (error) {

      console.error(
        "Incident History API error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// ========================================
// API - ACTIVE INCIDENT
// ========================================

app.get(
  "/api/incidents/active/current",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          error: "MongoDB not connected"
        });

      }

      const data = await db
        .collection("Meteo_Incidents")
        .findOne(
          {
            "incident.status": "IN_PROGRESS"
          },
          {
            sort: {
              "incident.created_at": -1
            }
          }
        );

      res.json({
        active: Boolean(data),
        incident: data || null
      });

    } catch (error) {

      console.error(
        "Active Incident API error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// ========================================
// API - LATEST AI INCIDENT REPORT
// ========================================

app.get(
  "/api/reports/latest",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          error: "MongoDB not connected"
        });

      }


      // ====================================
      // GET LATEST AI REPORT
      // ====================================

      const data = await db
        .collection("Meteo_AI_Reports")
        .findOne(
          {},
          {
            sort: {
              generated_at: -1
            }
          }
        );


      // ====================================
      // AUCUN RAPPORT
      // ====================================

      if (!data) {

        return res.json({
          report: null,
          message: "No AI report found"
        });

      }


      // ====================================
      // RESPONSE
      // ====================================

      res.json(data);

    } catch (error) {

      console.error(
        "Latest AI Report API error:",
        error
      );

      res.status(500).json({
        error: error.message
      });

    }
  }
);


// ========================================
// API - HEALTH CHECK
// ========================================

app.get(
  "/api/health",
  async (req, res) => {

    try {

      if (!db) {

        return res.status(503).json({
          status: "ERROR",
          mongodb: "DISCONNECTED"
        });

      }

      await db.command({
        ping: 1
      });

      res.json({
        status: "OK",
        mongodb: "CONNECTED",
        project: "METEO-RISK AI"
      });

    } catch (error) {

      res.status(500).json({
        status: "ERROR",
        mongodb: "DISCONNECTED",
        error: error.message
      });

    }
  }
);


// ========================================
// DASHBOARD HOME
// ========================================

app.get(
  "/",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );

  }
);


// ========================================
// SERVER
// ========================================

const PORT =
  process.env.PORT || 3000;

app.listen(
  PORT,
  () => {

    console.log(
      `🚀 METEO-RISK Dashboard running on http://localhost:${PORT}`
    );

  }
);


// ========================================
// CLEAN SHUTDOWN
// ========================================

process.on(
  "SIGINT",
  async () => {

    console.log(
      "\n⏳ Closing MongoDB connection..."
    );

    try {

      await client.close();

      console.log(
        "✅ MongoDB connection closed"
      );

    } catch (error) {

      console.error(
        "❌ Error closing MongoDB:",
        error.message
      );

    }

    process.exit(0);

  }
);