let waterChart = null;
let riskChart = null;


// ========================================
// LOAD DASHBOARD
// ========================================

async function loadDashboard() {

  try {

    // --------------------------
    // GET LATEST RISK
    // --------------------------

    const riskResponse =
      await fetch("/api/risk/latest");

    const riskData =
      await riskResponse.json();


    // --------------------------
    // GET LATEST INCIDENT
    // --------------------------

    const incidentResponse =
      await fetch("/api/incidents/latest");

    const incidentData =
      await incidentResponse.json();


    // --------------------------
    // GET LATEST AI REPORT
    // --------------------------

    const reportResponse =
      await fetch("/api/reports/latest");

    const reportData =
      await reportResponse.json();


    // --------------------------
    // CURRENT RISK LEVEL
    // --------------------------

    const currentLevel = String(
      riskData?.risk?.level || "LOW"
    )
      .trim()
      .toUpperCase();


    // --------------------------
    // UPDATE RISK UI
    // --------------------------

    updateRiskSection(riskData);


    // ========================================
    // MEDIUM = MONITORING MODE
    // ========================================

    if (currentLevel === "MEDIUM") {

      showMediumMonitoringMode();

      return;
    }


    // ========================================
    // OTHER LEVELS
    // ========================================

    showIncidentSections();

    updateIncidentSection(
      incidentData
    );
    // ========================================
// SHOW AI REPORT ONLY FOR SAME CLOSED INCIDENT
// ========================================

const currentIncident =
  incidentData?.incident || {};

const currentIncidentId =
  currentIncident.incident_id || null;

const currentIncidentStatus =
  String(
    currentIncident.status || ""
  )
    .trim()
    .toUpperCase();

const reportIncidentId =
  reportData?.incident_id || null;

const aiReportPanel =
  document.getElementById(
    "aiReportPanel"
  );

if (
  currentIncidentStatus === "CLOSED" &&
  currentIncidentId &&
  reportIncidentId === currentIncidentId &&
  reportData?.report
) {

  if (aiReportPanel) {
    aiReportPanel.style.display = "block";
  }

  updateAiReportSection(
    reportData
  );

} else {

  if (aiReportPanel) {
    aiReportPanel.style.display = "none";
  }

}


    // --------------------------
    // HISTORY
    // --------------------------

    if (
      incidentData?.incident?.incident_id
    ) {

      if (
        Array.isArray(
          incidentData.history
        ) &&
        incidentData.history.length > 0
      ) {

        renderHistory(
          incidentData.history
        );

      } else {

        await loadHistory(
          incidentData.incident.incident_id
        );

      }

    } else {

      renderHistory([]);

    }

  } catch (error) {

    console.error(
      "Dashboard error:",
      error
    );

  }
}

// ========================================
// RISK + WEATHER + WATER
// ========================================

function updateRiskSection(data) {

  if (!data) return;

  const risk = data.risk || {};
  const weather = data.weather || {};
  const sensor = data.water_sensor || {};


  // ========================================
  // ALERT BANNER DYNAMIQUE
  // ========================================

  const alertBanner =
    document.getElementById("alertBanner");

  const alertTitle =
    document.getElementById("alertTitle");

  const alertMessage =
    document.getElementById("alertMessage");

  const alertCity =
    document.getElementById("alertCity");

  const level =
    risk.level || "LOW";


  if (alertBanner) {

    // Reset classes
    alertBanner.classList.remove(
      "alert-medium",
      "alert-high",
      "alert-critical"
    );


    // --------------------------
    // LOW
    // --------------------------

    if (level === "LOW") {

      alertBanner.style.display = "none";

    }


    // --------------------------
    // MEDIUM
    // --------------------------

    else if (level === "MEDIUM") {

      alertBanner.style.display = "flex";

      alertBanner.classList.add(
        "alert-medium"
      );

      if (alertTitle) {
        alertTitle.textContent =
          "⚠️ FLOOD VIGILANCE";
      }

      if (alertMessage) {
        alertMessage.textContent =
          data.message ||
          risk.message ||
          "Surveillance renforcée recommandée.";
      }

      if (alertCity) {
        alertCity.textContent =
          "📍 " +
          (data.location?.city || "Unknown");
      }

    }


    // --------------------------
    // HIGH
    // --------------------------

    else if (level === "HIGH") {

      alertBanner.style.display = "flex";

      alertBanner.classList.add(
        "alert-high"
      );

      if (alertTitle) {
        alertTitle.textContent =
          "🚨 HIGH FLOOD RISK";
      }

      if (alertMessage) {
        alertMessage.textContent =
          data.message ||
          risk.message ||
          "Risque élevé d'inondation détecté.";
      }

      if (alertCity) {
        alertCity.textContent =
          "📍 " +
          (data.location?.city || "Unknown");
      }

    }


    // --------------------------
    // CRITICAL
    // --------------------------

    else if (level === "CRITICAL") {

      alertBanner.style.display = "flex";

      alertBanner.classList.add(
        "alert-critical"
      );

      if (alertTitle) {
        alertTitle.textContent =
          "🚨 CRITICAL FLOOD ALERT";
      }

      if (alertMessage) {
        alertMessage.textContent =
          data.message ||
          risk.message ||
          "Risque critique d'inondation détecté.";
      }

      if (alertCity) {
        alertCity.textContent =
          "📍 " +
          (data.location?.city || "Unknown");
      }

    }

  }


  // ========================================
  // WATER GAUGE
  // ========================================

  const waterLevel =
    Number(
      sensor.water_level_cm || 0
    );

  const warningLevel =
    Number(
      sensor.warning_level_cm || 70
    );

  const criticalLevel =
    Number(
      sensor.critical_level_cm || 90
    );

  const maxWaterLevel = 120;


  const percentage =
    Math.min(
      (waterLevel / maxWaterLevel) * 100,
      100
    );


  setText(
    "gaugeWaterLevel",
    waterLevel
  );

  setText(
    "gaugeStatus",
    sensor.status || "--"
  );


  const gaugeFill =
    document.getElementById(
      "gaugeFill"
    );


  if (gaugeFill) {

    gaugeFill.style.width =
      `${percentage}%`;


    if (
      waterLevel >= criticalLevel
    ) {

      gaugeFill.style.background =
        "#ff4d5a";

    }

    else if (
      waterLevel >= warningLevel
    ) {

      gaugeFill.style.background =
        "#ffd166";

    }

    else {

      gaugeFill.style.background =
        "#31e981";

    }

  }


  // ========================================
  // KPI
  // ========================================

  setText(
    "riskLevel",
    risk.level || "--"
  );

  setText(
    "riskScore",
    risk.score ?? "--"
  );

  setText(
    "waterLevel",
    `${sensor.water_level_cm ?? "--"} cm`
  );


  // ========================================
  // WATER MONITORING
  // ========================================

  setText(
    "currentWater",
    `${sensor.water_level_cm ?? "--"} cm`
  );

  setText(
    "previousWater",
    `${sensor.previous_water_level_cm ?? "--"} cm`
  );

  setText(
    "riseRate",
    `${sensor.rise_rate_cm ?? "--"} cm`
  );

  setText(
    "waterTrend",
    sensor.trend || "--"
  );

  setText(
    "warningLevel",
    `${sensor.warning_level_cm ?? "--"} cm`
  );

  setText(
    "criticalLevel",
    `${sensor.critical_level_cm ?? "--"} cm`
  );


  // ========================================
  // WEATHER
  // ========================================

  setText(
    "temperature",
    `${weather.temperature_c ?? "--"} °C`
  );

  setText(
    "humidity",
    `${weather.humidity_percent ?? "--"} %`
  );

  setText(
    "rain",
    `${weather.rain_mm ?? "--"} mm`
  );

  setText(
    "wind",
    `${weather.wind_kmh ?? "--"} km/h`
  );

  setText(
    "gust",
    `${weather.wind_gust_kmh ?? "--"} km/h`
  );

  setText(
    "pressure",
    `${weather.pressure_hpa ?? "--"} hPa`
  );


  // ========================================
  // RISK COLOR
  // ========================================

  applyRiskColor(
    risk.level
  );


  // ========================================
  // CHARTS
  // ========================================

  createWaterChart(
    sensor
  );

  createRiskChart(
    risk.indicators || {}
  );

}

// ========================================
// MEDIUM MONITORING MODE
// ========================================

function showMediumMonitoringMode() {

  // ========================================
  // KPI INCIDENT STATUS
  // ========================================

  const incidentStatus =
    document.getElementById(
      "incidentStatus"
    );

  if (incidentStatus) {

    incidentStatus.textContent =
      "MONITORING";

    incidentStatus.style.color =
      "#ffd166";

    incidentStatus.style.textShadow =
      "none";
  }


  // ========================================
  // LATEST INCIDENT PANEL
  // ========================================

  const incidentPanel =
    document.querySelector(
      ".incident-panel"
    );

  if (incidentPanel) {

    incidentPanel.style.display =
      "none";
  }


  // ========================================
  // TIMELINE PANEL
  // ========================================

  const timeline =
    document.getElementById(
      "timeline"
    );

  const timelinePanel =
    timeline
      ? timeline.closest(".panel")
      : null;

  if (timelinePanel) {

    timelinePanel.style.display =
      "none";
  }


  // ========================================
  // AI REPORT PANEL
  // ========================================

  const aiReportPanel =
    document.getElementById(
      "aiReportPanel"
    );

  if (aiReportPanel) {

    aiReportPanel.style.display =
      "none";
  }
}


// ========================================
// SHOW INCIDENT SECTIONS
// ========================================

function showIncidentSections() {

  const incidentPanel =
    document.querySelector(
      ".incident-panel"
    );

  const timeline =
    document.getElementById(
      "timeline"
    );

  const timelinePanel =
    timeline
      ? timeline.closest(".panel")
      : null;

  const aiReportPanel =
    document.getElementById(
      "aiReportPanel"
    );


  if (incidentPanel) {

    incidentPanel.style.display =
      "block";
  }


  if (timelinePanel) {

    timelinePanel.style.display =
      "block";
  }


  if (aiReportPanel) {

    aiReportPanel.style.display =
      "none";
  }
}

function updateIncidentSection(data) {

  if (!data) return;

  const incident = data.incident || {};

  // Normaliser le status
  const status = String(
    incident.status || "--"
  ).trim().toUpperCase();


  // ========================================
  // INCIDENT DATA
  // ========================================

  setText("incidentStatus", status);

  setText(
    "incidentId",
    incident.incident_id || "--"
  );

  setText(
    "incidentType",
    incident.type || "--"
  );

  setText(
    "incidentPriority",
    incident.priority || "--"
  );

  setText(
    "incidentSeverity",
    incident.severity || "--"
  );


  // ========================================
  // INCIDENT STATUS COLOR
  // ========================================

  const statusElement =
    document.getElementById("incidentStatus");

  if (statusElement) {

    // Couleur par défaut
    statusElement.style.color = "#ffffff";
    statusElement.style.textShadow = "none";


    // 🔴 IN PROGRESS
    if (status === "IN_PROGRESS") {

      statusElement.style.color = "#ff4d5a";

      statusElement.style.textShadow =
        "0 0 10px rgba(255, 77, 90, 0.6)";
    }


    // 🟡 COMPLETED
    else if (status === "COMPLETED") {

      statusElement.style.color = "#ffd166";
    }


    // 🔵 RESOLVED
    else if (status === "RESOLVED") {

      statusElement.style.color = "#4dabf7";
    }


    // 🟢 CLOSED
    else if (status === "CLOSED") {

      statusElement.style.color = "#31e981";

      statusElement.style.textShadow =
        "0 0 10px rgba(49, 233, 129, 0.7)";
    }
  }


  // ========================================
  // HIDE ALERT IF INCIDENT IS CLOSED
  // ========================================

  const alertBanner =
    document.getElementById("alertBanner");

  if (alertBanner && status === "CLOSED") {

    alertBanner.style.display = "none";
  }
  // ========================================
// FINAL INCIDENT BADGE
// ========================================

const finalBadge =
  document.getElementById("incidentFinalBadge");

if (finalBadge) {

  if (status === "CLOSED") {

    finalBadge.style.display = "flex";

  } else {

    finalBadge.style.display = "none";

  }
}
}

// ========================================
// HISTORY
// ========================================

async function loadHistory(
  incidentId
) {

  try {

    const response =
      await fetch(
        `/api/incidents/${incidentId}/history`
      );

    const history =
      await response.json();


    renderHistory(
      history
    );

  }

  catch (error) {

    console.error(
      "History error:",
      error
    );

  }

}


// ========================================
// RENDER HISTORY
// ========================================

function renderHistory(history) {

  const timeline =
    document.getElementById("timeline");

  if (!timeline) return;

  if (
    !Array.isArray(history) ||
    history.length === 0
  ) {

    timeline.innerHTML = `
      <div class="timeline-item">
        No history found
      </div>
    `;

    return;
  }

  timeline.innerHTML =
    history
      .map(item => {

        const stage = String(
          item.stage ||
          item.incident_status ||
          "--"
        )
          .trim()
          .toUpperCase();

        let statusClass = "";

        if (stage === "IN_PROGRESS") {
          statusClass = "timeline-in-progress";
        }

        else if (stage === "COMPLETED") {
          statusClass = "timeline-completed";
        }

        else if (stage === "RESOLVED") {
          statusClass = "timeline-resolved";
        }

        else if (stage === "CLOSED") {
          statusClass = "timeline-closed";
        }

        return `
          <div class="timeline-item ${statusClass}">

            <strong>
              ${stage}
            </strong>

            <br>

            <small>
              ${formatDate(item.timestamp)}
            </small>

          </div>
        `;

      })
      .join("");
}
// ========================================
// AI INCIDENT REPORT
// ========================================

function updateAiReportSection(data) {

  const incidentId =
    document.getElementById("aiReportIncidentId");

  const status =
    document.getElementById("aiReportStatus");

  const generatedAt =
    document.getElementById("aiReportGeneratedAt");

  const content =
    document.getElementById("aiReportContent");

  const button =
    document.getElementById("toggleAiReport");


  if (!data || !data.report) {

    if (incidentId) {
      incidentId.textContent = "--";
    }

    if (status) {
      status.textContent = "NO REPORT";
    }

    if (generatedAt) {
      generatedAt.textContent = "--";
    }

    if (content) {
      content.textContent =
        "Aucun rapport IA disponible.";
    }

    if (button) {
      button.disabled = true;
      button.textContent = "📄 No Report";
    }

    return;
  }


  // INCIDENT ID
  if (incidentId) {
    incidentId.textContent =
      data.incident_id || "--";
  }


  // STATUS
  if (status) {
    status.textContent =
      data.status || "REPORT_GENERATED";
  }


  // GENERATED DATE
  if (generatedAt) {
    generatedAt.textContent =
      formatDate(data.generated_at);
  }


  // REPORT
  if (content) {
    content.textContent =
      data.report;
  }


  // BUTTON
  if (button) {

    button.disabled = false;

    button.onclick = function () {

      if (!content) return;

      const open =
        content.classList.toggle("open");

      button.textContent =
        open
          ? "📕 Hide Report"
          : "📄 View Report";
    };
  }
}

// ========================================
// WATER CHART
// ========================================

function createWaterChart(
  sensor
) {

  const canvas =
    document.getElementById(
      "waterChart"
    );


  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  if (waterChart) {

    waterChart.destroy();

  }


  waterChart =
    new Chart(
      ctx,
      {

        type: "bar",

        data: {

          labels: [
            "Previous",
            "Current",
            "Warning",
            "Critical"
          ],

          datasets: [

            {

              label:
                "Water Level (cm)",

              data: [

                sensor.previous_water_level_cm || 0,

                sensor.water_level_cm || 0,

                sensor.warning_level_cm || 0,

                sensor.critical_level_cm || 0

              ]

            }

          ]

        },


        options: {

          responsive: true,

          plugins: {

            legend: {

              labels: {
                color: "#ffffff"
              }

            }

          },


          scales: {

            x: {

              ticks: {
                color: "#8fa9c1"
              }

            },


            y: {

              beginAtZero: true,

              ticks: {
                color: "#8fa9c1"
              }

            }

          }

        }

      }
    );

}


// ========================================
// RISK CHART
// ========================================

function createRiskChart(
  indicators
) {

  const canvas =
    document.getElementById(
      "riskChart"
    );


  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  if (riskChart) {

    riskChart.destroy();

  }


  riskChart =
    new Chart(
      ctx,
      {

        type: "radar",

        data: {

          labels: [
            "Rain",
            "Forecast",
            "Persistence",
            "Water Level",
            "Water Trend",
            "Humidity",
            "Pressure",
            "Wind"
          ],

          datasets: [

            {

              label:
                "Risk Indicators",

              data: [

                indicators.current_rain || 0,

                indicators.forecast_rain || 0,

                indicators.persistence || 0,

                indicators.water_level || 0,

                indicators.water_trend || 0,

                indicators.humidity || 0,

                indicators.pressure || 0,

                indicators.wind || 0

              ]

            }

          ]

        },


        options: {

          responsive: true,

          scales: {

            r: {

              min: 0,
              max: 100,

              ticks: {

                color: "#8fa9c1",

                backdropColor:
                  "transparent"

              },

              pointLabels: {

                color:
                  "#ffffff"

              },

              grid: {

                color:
                  "#29425b"

              }

            }

          },


          plugins: {

            legend: {

              labels: {

                color:
                  "#ffffff"

              }

            }

          }

        }

      }
    );

}


// ========================================
// RISK STATUS COLOR
// ========================================

function applyRiskColor(
  level
) {

  const element =
    document.getElementById(
      "riskLevel"
    );


  if (!element) return;


  element.classList.remove(
    "status-low",
    "status-medium",
    "status-high",
    "status-critical"
  );


  if (
    level === "LOW"
  ) {

    element.classList.add(
      "status-low"
    );

  }


  else if (
    level === "MEDIUM"
  ) {

    element.classList.add(
      "status-medium"
    );

  }


  else if (
    level === "HIGH"
  ) {

    element.classList.add(
      "status-high"
    );

  }


  else if (
    level === "CRITICAL"
  ) {

    element.classList.add(
      "status-critical"
    );

  }

}


// ========================================
// HELPERS
// ========================================

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);


  if (element) {

    element.textContent =
      value;

  }

}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(
  date
) {

  if (!date) return "--";


  return new Date(
    date
  ).toLocaleString();

}


// ========================================
// START
// ========================================

loadDashboard();


// ========================================
// AUTO REFRESH
// ========================================

// refresh toutes les 10 secondes

setInterval(
  loadDashboard,
  10000
);