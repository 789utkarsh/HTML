
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs'); // For password hashing
const cors = require('cors'); // Import the CORS middleware

const app = express();
const port = 3000;
app.use(cors());

// Set up body parser for JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // your MySQL username
    password: '', // your MySQL password
    database: 'desireboutiquedb',
    port: 8111
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Route for user signup
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

     // Check if email already exists
     const checkEmailSql = 'SELECT * FROM Users WHERE email = ?';
     db.query(checkEmailSql, [email], (err, result) => {
         if (err) {
             return res.status(500).json({ message: 'Error checking email in database' });
         }
 
         if (result.length > 0) {
             // If email is found in the database, return a message
             return res.status(400).json({ message: 'Email is already registered' });
         }
 

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        const sql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
        db.query(sql, [username, email, hashedPassword], (err, result) => {
          if (err) {
            return res.status(500).json({ message: 'Error creating account' });
        }
        res.status(200).json({ message: 'Account created successfully' }); // Ensure response is JSON
        });
    });
});
});

// Route for user login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

        // Compare the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              return res.status(500).json({ message: 'Error comparing passwords' });
          }

          if (isMatch) {
              // Successful login, send back user data (or token, etc.)
              return res.status(200).json({ message: 'Login successful', user });
          } else {
              return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
});


app.post('/booking', (req, res) => {
    const {
        first_name,
        last_name,
        contact_number,
        address,
        landmark,
        city,
        pincode,
        product,
        quantity,
        price,
        totalAmount,
        advanceAmount,
        remainingAmount,
        sample_design,
        appointment_date,
        appointment_time,
        need_fabric,
        home_delivery,
        created_at
    } = req.body;

     // Set payment status to "Pending" by default and transaction_id as NULL
     const payment_status = "Pending";
     const transaction_id = null;


    // SQL query to insert booking data into the 'Bookings' table
    const sql = `
        INSERT INTO Bookings (
            first_name, last_name, contact_number, address,landmark, city, pincode,product, quantity, price,totalAmount,
            advanceAmount,remainingAmount,sample_design, appointment_date, appointment_time, need_fabric, home_delivery,payment_status,
             transaction_id, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?)
    `;
    
    // Run query with values from the request body
    db.query(sql, [
        first_name, last_name, contact_number, address,landmark, city, pincode,product, quantity, price,totalAmount,
        advanceAmount,remainingAmount,sample_design, appointment_date, appointment_time, need_fabric, home_delivery, payment_status,
         transaction_id,created_at
    ], 
    (err, result) => {
        if (err) {
            console.error('Error inserting booking data:', err);
            return res.status(500).json({ message: 'Error saving booking data' });
        }

        // Send response back to client
        res.status(200).json({ message: 'Booking successful', booking_id: result.insertId });
    });
});

app.post('/payment', (req, res) => {
    const { booking_id, transaction_id } = req.body;

    if (!booking_id || !transaction_id) {
        return res.status(400).json({ message: 'Missing booking ID or transaction ID' });
    }


    // SQL query to update payment status and transaction ID in the 'Bookings' table
    const sql = `UPDATE bookings SET payment_status = 'Completed', transaction_id = ? WHERE booking_id = ?`;
    db.query(sql, [transaction_id, booking_id], (err, result) => {

    if (err) {
        console.error('Error updating payment status:', err);
        return res.status(500).json({ message: 'Error processing payment' });
    }

    // Check if any rows were updated
    if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Booking ID not found' });
    } else {
        res.status(200).json({ message: 'Payment processed successfully' });
    }
});
});

app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Validate the form inputs
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Please fill in all fields" });
    }

    // SQL query to insert contact message data
    const query = 'INSERT INTO contactmessages (name, email, message) VALUES (?, ?, ?)';
    db.query(query, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting contact message:", err);
            return res.status(500).json({ success: false, message: "Error submitting message" });
        }

        res.status(200).json({ success: true, message: "Message sent successfully!" });
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
