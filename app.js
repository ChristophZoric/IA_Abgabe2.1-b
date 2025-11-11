const express = require("express");
const app = express();
app.use(express.json());

const port = 3000;

let salesmen = [
  {
    firstname: "John",
    lastname: "Doe",
    sid: 101,
    jobTitle: "Senior Sales Executive",
    subUnit: "North Region",
    supervisor: "Michael Smith",
    socialPerformanceRecords: [
      { skill: "Communication", socialScore: 88 },
      { skill: "Teamwork", socialScore: 92 },
      { skill: "Negotiation", socialScore: 85 },
    ],
  },
  {
    firstname: "Anna",
    lastname: "Miller",
    sid: 102,
    jobTitle: "Sales Associate",
    subUnit: "West Region",
    supervisor: "Laura Johnson",
    socialPerformanceRecords: [
      { skill: "Customer Relations", socialScore: 90 },
      { skill: "Adaptability", socialScore: 84 },
      { skill: "Organization", socialScore: 87 },
    ],
  },
  {
    firstname: "David",
    lastname: "Brown",
    sid: 103,
    jobTitle: "Account Manager",
    subUnit: "Corporate Sales",
    supervisor: "Robert King",
    socialPerformanceRecords: [
      { skill: "Strategic Thinking", socialScore: 95 },
      { skill: "Leadership", socialScore: 89 },
      { skill: "Problem Solving", socialScore: 91 },
    ],
  },
];

// ------------------ HELPER FUNCTIONS ------------------

function getSalesman(sid) {
  return salesmen.find((s) => s.sid === Number(sid));
}

function deleteSalesman(sid) {
  salesmen = salesmen.filter((s) => s.sid !== Number(sid));
}

function deleteSalesmanSocialPerformanceRecord(sid, skill) {
  const salesman = getSalesman(sid);
  if (salesman) {
    salesman.socialPerformanceRecords =
      salesman.socialPerformanceRecords.filter((r) => r.skill !== skill);
    return salesman;
  }
  return null;
}

// ------------------ REST ENDPOINTS ------------------

// GET all salesmen
app.get("/salesmen", (req, res) => {
  res.json(salesmen);
});

// GET single salesman
app.get("/salesman/:sid", (req, res) => {
  const salesman = getSalesman(req.params.sid);
  if (!salesman) {
    return res.status(404).json({ error: "Salesman not found" });
  }
  res.json(salesman);
});

// POST create salesman
app.post("/salesmen", (req, res) => {
  const salesman = req.body;

  if (!salesman.sid || !salesman.firstname || !salesman.lastname) {
    return res.status(400).json({
      error: "Missing required fields: sid, firstname, lastname",
    });
  }

  const socialPerformanceRecords = salesman.socialPerformanceRecords || [];

  salesmen.push({ ...salesman, socialPerformanceRecords });
  res.status(201).json(salesman);
});

// DELETE salesman
app.delete("/salesmen/:sid", (req, res) => {
  const salesman = getSalesman(req.params.sid);
  if (!salesman) {
    return res.status(404).json({ error: "Salesman not found" });
  }
  deleteSalesman(req.params.sid);
  res.status(200).json(salesman);
});

// GET all social performance records for one salesman
app.get("/salesmen/:sid/records", (req, res) => {
  const salesman = getSalesman(req.params.sid);
  if (!salesman) {
    return res.status(404).json({ error: "Salesman not found" });
  }
  res.json(salesman.socialPerformanceRecords);
});

// POST add new social performance record
app.post("/salesmen/:sid/records", (req, res) => {
  const { skill, socialScore } = req.body;
  const salesman = getSalesman(req.params.sid);
  if (!salesman) {
    return res.status(404).json({ error: "Salesman not found" });
  }
  if (!skill || socialScore === undefined) {
    return res
      .status(400)
      .json({ error: "Missing fields: skill, socialScore" });
  }

  salesman.socialPerformanceRecords.push({ skill, socialScore });
  res.status(201).json(salesman);
});

// DELETE single performance record by skill
app.delete("/salesmen/:sid/records/:skill", (req, res) => {
  const salesman = deleteSalesmanSocialPerformanceRecord(
    req.params.sid,
    req.params.skill
  );
  if (!salesman) {
    return res
      .status(404)
      .json({ error: "Salesman not found or skill not found" });
  }
  res.json(salesman);
});

// ------------------ START SERVER ------------------

app.listen(port, () => {
  console.log(`REST API listening at http://localhost:${port}`);
});
