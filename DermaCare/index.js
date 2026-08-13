const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); // This tells Express to look for HTML/CSS in the public folder

const cors = require("cors");
app.use(cors());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dermacare"
});



db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err.message);
  } else {
    console.log("Database connected successfully");
  }
});

// هنا بس عشان نتأكد إذا السيرفر شغال لما نروح للمتصفح ونكتب
// http://localhost:3000
// وهنا استخدمنا GET عشان نجيب بيانات أو نقرا شيء
app.get("/", (req, res) => {
  res.send("DermaCare backend is running");
});

//------------------------------------------------------------------view all appointments-----------------------------------------------//

app.get("/appointments", (req, res) => {
  // هنا في SQL قلنا: جيب كل شيء من جدول appointments
  const sql = "SELECT * FROM appointments";

  // هنا قاعدين ننفذ query داخل database
  // لو فيه غلط يعطينا رسالة
  db.query(sql, (err, result) => {
    if (err) {
      // 500 يعني الغلط من جهة السيرفر
      return res.status(500).send(err.message);
    }
    res.send(result);
  });
});

//-------------------------------------------------------------------------insert----------------------------------------------------//

// هنا استخدمنا POST عشان نضيف appointment جديد
app.post("/appointments", (req, res) => {
  // هنا ناخذ المعلومات اللي أرسلها المستخدم
  const appointment = {
    client_id: req.body.client_id,
    staff_id: req.body.staff_id,
    treatment_id: req.body.treatment_id,
    appointment_date: req.body.appointment_date,
    appointment_time: req.body.appointment_time,
    status: req.body.status
  };
  if (
    isNaN(appointment.client_id) ||
    isNaN(appointment.staff_id) ||
    isNaN(appointment.treatment_id)
  ) {
    return res.status(400).send("IDs must be numbers!");
  }

  // Validate required fields
  if (
    !appointment.appointment_date ||
    !appointment.appointment_time ||
    !appointment.status
  ) {
    return res.status(400).send("Missing required fields!");
  }

  // هنا SQL query للإضافة
  let sqlQuery = `INSERT INTO appointments
  ( client_id, staff_id, treatment_id, appointment_date, appointment_time, status)
  VALUES
  ( ${appointment.client_id}, ${appointment.staff_id}, ${appointment.treatment_id},
  '${appointment.appointment_date}', '${appointment.appointment_time}', '${appointment.status}')`;

  // Here we say execute query
  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.send("Appointment added successfully");
  });
});

//---------------------------------------------------------------------update------------------------------------------------------//

// Here we use PUT to update appointment by id
app.put("/appointments/:id", (req, res) => {
  // هنا راح نجيب قيمة من الرابط
  // example: /appointments/3
  // راح ياخذ 3
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send("Invalid appointment ID: It must be a number!");
  }

  // Here we provide the new values we want to update within the row
  const appointment = {
    client_id: req.body.client_id,
    staff_id: req.body.staff_id,
    treatment_id: req.body.treatment_id,
    appointment_date: req.body.appointment_date,
    appointment_time: req.body.appointment_time,
    status: req.body.status
  };
  if (
    isNaN(appointment.client_id) ||
    isNaN(appointment.staff_id) ||
    isNaN(appointment.treatment_id)
  ) {
    return res.status(400).send("IDs must be numbers!");
  }

  if (
    !appointment.client_id ||
    !appointment.staff_id ||
    !appointment.treatment_id ||
    !appointment.appointment_date ||
    !appointment.appointment_time ||
    !appointment.status
  ) {
    return res.status(400).send("Missing required fields!");
  }
  // Do not forget WHERE
  let sqlQuery = `UPDATE appointments
  SET
  client_id = ${appointment.client_id},
  staff_id = ${appointment.staff_id},
  treatment_id = ${appointment.treatment_id},
  appointment_date = '${appointment.appointment_date}',
  appointment_time = '${appointment.appointment_time}',
  status = '${appointment.status}'
  WHERE appointment_id = ${id}`;

  db.query(sqlQuery, (error, results) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    if (results.affectedRows === 0) { // .afffected rows is a property of result
      return res.status(400).send("update falied: id doesn't exist") // validating id exists
    }
    res.send("One appointment is updated.");
  });
});

//-------------------------------------------------------------------delete---------------------------------------------------------//

// Here we use DELETE to delete appointment by id
app.delete("/appointments/:id", (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) { //validating input
    return res.status(400).send("Invalid Client ID: It must be a number!");
  }

  // DO NOT forget WHERE
  let sqlQuery = `DELETE FROM appointments WHERE appointment_id = ${id}`;

  db.query(sqlQuery, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (result.affectedRows === 0) { // .afffected rows is a property of result
      return res.status(400).send("delete falied: id doesn't exist") // validating id exists
    }
    res.send("Appointment deleted successfully");
  });
});

//---------------------------------------------------------view appointments for specific client--------------------------------------//

// route to get all appointments for a specific client
app.get("/appointments/:client_id", (req, res) => {
  // we get the ID from the URL using req.params 

  const { client_id } = req.params;

  if (isNaN(client_id)) { //validating input
    return res.status(400).send("Invalid Client ID: It must be a number!");
  }

  let sqlQuery = `SELECT * FROM appointments WHERE client_id = ${client_id}`;

  db.query(sqlQuery, (error, results) => {
    if (error) {
      return res.status(500).send(error.message);
    }
    res.status(200).send(results);
  });
});

//---------------------------------------------------------log in--------------------------------------//

app.post("/login", (req, res) => {
    const { email, password_hash } = req.body;

    const sql = `SELECT * FROM clients WHERE email = ? AND password_hash = ?`;

    db.query(sql, [email, password_hash], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "No user found" });
        }

        const user = results[0];

        res.status(200).json({
            id: user.client_id,   // ← FIXED
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
        });
    });
});

// ---------------------------------------------------------
// Get client info by ID
// ---------------------------------------------------------
app.get("/client/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM clients WHERE client_id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        const user = results[0];

        res.json({
            id: user.client_id,
            first_name: user.first_name,
            last_name: user.last_name,
            dob: user.dob,
            email: user.email,
            gender: user.gender,
            phone: user.phone,
            skin_type: user.skin_type
        });
    });
});

// ---------------------------------------------------------
// Update client profile
// ---------------------------------------------------------
app.put("/client/:id", (req, res) => {
    console.log("PUT /client/:id reached");

    const { id } = req.params;

    const sql = `
        UPDATE clients SET
            first_name = ?,
            last_name = ?,
            date_of_birth = ?,   
            email = ?,
            gender = ?,
            phone = ?,           
            skin_type = ?       
        WHERE client_id = ?
    `;

    const values = [
        req.body.first_name,
        req.body.last_name,
        req.body.dob,          // maps to date_of_birth
        req.body.email,
        req.body.gender,
        req.body.phone,
        req.body.skin_type,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.log("SQL ERROR:", err);
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json({ message: "Profile updated successfully" });
    });
});



// This runs the server on port 3000
// example: http://localhost:3000
// Note: without app.listen the server will not work
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

