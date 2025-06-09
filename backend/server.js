const express = require('express');
const cors = require('cors');
const mysql = require('mysql');  // install this on the node modules of the front end
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pageRoutes = require('./pageRoutes'); // Path for the Routes 
const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', pageRoutes);


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'cinema',
});

//-----------------------------------------------------------------------------------------------------------------------
// Register 
app.post('/register', async (req, res) => { 
  const { username,email, password} = req.body; 
  const hashedPassword = await bcrypt.hash(password, 10); 
  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`; 
  db.query(query, [username, email, hashedPassword], (err) => { 
    if (err) return res.status(500).send(err); 
    res.status(200).send({ message: 'User Registered' }); 
  }); 
});
//-----------------------------------------------------------------------------------------------------------------------
// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, users) => {
    if (err || users.length === 0) return res.status(404).send('User not found');
    const user = users[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Invalid password');


    // Include userId in the response
    const token = jwt.sign({ id: user.id, accessLevel: user.access_level }, 'secret', { expiresIn: 86400 });
    res.status(200).send({ token, userId: user.id }); // Send userId with token
  });
});


// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
  const userId = req.body.user_id || req.params.userId;
  console.log(`Checking admin access for User ID: ${userId}`); // Log for debugging
  const query = 'SELECT role FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
      }
      if (results.length > 0 && results[0].role === 'admin') {
          console.log('Access granted for admin.'); // Log for debugging
          next(); // User is admin, proceed to the next middleware/route handler
      } else {
          console.log('Access denied for non-admin user.'); // Log for debugging
          res.status(403).json({ error: 'Access denied' }); // User is not admin, deny access
      }
  });
}

// --------------------PAGE ACCESS  CRUD START ----------------------------
// Page access
app.get('/api/page_access/:userId/:pageId', (req, res) => {
const { userId, pageId } = req.params;

console.log(`Checking access for User ID: ${userId} Page ID: ${pageId}`); // Log for debugging

const query = `SELECT page_privilege FROM page_access WHERE user_id = ? AND page_id = ?`;
db.query(query, [userId, pageId], (err, results) => {
    if (err) {
        console.error('Database error:', err); // Log the error
        return res.status(500).json({ error: 'Database error' });
    }
    if (results.length > 0) {
        console.log('Results:', results); // Log the results for debugging
        // Check against the number 1 for access
        return res.json({ hasAccess: results[0].page_privilege === 1 }); // Check against number 1
    } else {
        return res.json({ hasAccess: false });
    }
});
});

// Search for a user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
      }
      if (result.length > 0) {
          res.json(result[0]);
      } else {
          res.status(404).json({ message: 'User not found' });
      }
  });
});

// Fetch all pages
app.get('/api/pages', (req, res) => {
  db.query('SELECT * FROM pages', (err, results) => {
      if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Fetch page access for a user
app.get('/api/page_access/:userId', (req, res) => {
  const { userId } = req.params;
  db.query('SELECT * FROM page_access WHERE user_id = ?', [userId], (err, results) => {
      if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
      }
      res.json(results);
  });
});

// Insert a new page access record (grant access), but only if no matching user_id and page_id exists
app.post('/api/page_access', checkAdmin, (req, res) => {
  const { user_id, page_id, page_privilege } = req.body;

  // Check if the record already exists
  const checkQuery = 'SELECT * FROM page_access WHERE user_id = ? AND page_id = ?';
  db.query(checkQuery, [user_id, page_id], (err, result) => {
      if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
      }

      if (result.length > 0) {
          // If record exists, do not insert again
          return res.status(409).json({ message: 'Page access already exists for this user and page' });
      } else {
          // If no record exists, insert a new one
          const insertQuery = 'INSERT INTO page_access (user_id, page_id, page_privilege) VALUES (?, ?, ?)';
          db.query(insertQuery, [user_id, page_id, page_privilege], (err) => {
              if (err) {
                  console.error('Database error:', err); // Log the error
                  return res.status(500).json({ error: 'Database error' });
              }
              res.status(201).json({ message: 'Page access created' });
          });
      }
  });
});

// Update an existing page access record
app.put('/api/page_access/:userId/:pageId', checkAdmin, (req, res) => {
  const { userId, pageId } = req.params;
  const { page_privilege } = req.body;
  const query = 'UPDATE page_access SET page_privilege = ? WHERE user_id = ? AND page_id = ?';
  db.query(query, [page_privilege, userId, pageId], (err) => {
      if (err) {
          console.error('Database error:', err); // Log the error
          return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Page access updated' });
  });
});

// PAGE ACCESS  CRUD END -----------------------------------------------------------------------
// ---------- MOVIES ----------
app.get('/api/movies', (_, res) => {
  db.query('SELECT * FROM movie', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/movies', (req, res) => {
  db.query('INSERT INTO movie SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/movies/:id', (req, res) => {
  db.query('UPDATE movie SET ? WHERE MovieID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Movie updated' });
  });
});
app.delete('/api/movies/:id', (req, res) => {
  db.query('DELETE FROM movie WHERE MovieID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- BOOKINGS ----------
app.get('/api/bookings', (_, res) => {
  db.query('SELECT * FROM booking', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/bookings', (req, res) => {
  db.query('INSERT INTO booking SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/bookings/:id', (req, res) => {
  db.query('UPDATE booking SET ? WHERE BookingID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Booking updated' });
  });
});
app.delete('/api/bookings/:id', (req, res) => {
  db.query('DELETE FROM booking WHERE BookingID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- CUSTOMERS ----------
app.get('/api/customers', (_, res) => {
  db.query('SELECT * FROM customer', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/customers', (req, res) => {
  db.query('INSERT INTO customer SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/customers/:id', (req, res) => {
  db.query('UPDATE customer SET ? WHERE CustomerID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Customer updated' });
  });
});
app.delete('/api/customers/:id', (req, res) => {
  db.query('DELETE FROM customer WHERE CustomerID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- MEMBERSHIPS ----------
app.get('/api/memberships', (_, res) => {
  db.query('SELECT * FROM memberships', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/memberships', (req, res) => {
  db.query('INSERT INTO memberships SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/memberships/:id', (req, res) => {
  db.query('UPDATE memberships SET ? WHERE MembershipID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Membership updated' });
  });
});
app.delete('/api/memberships/:id', (req, res) => {
  db.query('DELETE FROM memberships WHERE MembershipID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- SHOWTIMES ----------
app.get('/api/showtimes', (_, res) => {
  db.query('SELECT * FROM showtime', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/showtimes', (req, res) => {
  db.query('INSERT INTO showtime SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/showtimes/:id', (req, res) => {
  db.query('UPDATE showtime SET ? WHERE ShowtimeID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Showtime updated' });
  });
});
app.delete('/api/showtimes/:id', (req, res) => {
  db.query('DELETE FROM showtime WHERE ShowtimeID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- PAYMENTS ----------
app.get('/api/payments', (_, res) => {
  db.query('SELECT * FROM payment', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/payments', (req, res) => {
  db.query('INSERT INTO payment SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/payments/:id', (req, res) => {
  db.query('UPDATE payment SET ? WHERE PaymentID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Payment updated' });
  });
});
app.delete('/api/payments/:id', (req, res) => {
  db.query('DELETE FROM payment WHERE PaymentID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- USERS ----------
app.get('/api/users', (_, res) => {
  db.query('SELECT id, username, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/users', (req, res) => {
  db.query('INSERT INTO users SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/users/:id', (req, res) => {
  db.query('UPDATE users SET ? WHERE id = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'User updated' });
  });
});
app.delete('/api/users/:id', (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

// ---------- SEATS ----------
app.get('/api/seats', (_, res) => {
  db.query('SELECT * FROM seat', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});
app.post('/api/seats', (req, res) => {
  db.query('INSERT INTO seat SET ?', req.body, (err, result) => {
    if (err) return res.status(500).json({ error: 'Insert error' });
    res.status(201).json({ id: result.insertId });
  });
});
app.put('/api/seats/:id', (req, res) => {
  db.query('UPDATE seat SET ? WHERE SeatID = ?', [req.body, req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Update error' });
    res.json({ message: 'Seat updated' });
  });
});
app.delete('/api/seats/:id', (req, res) => {
  db.query('DELETE FROM seat WHERE SeatID = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete error' });
    res.sendStatus(204);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
