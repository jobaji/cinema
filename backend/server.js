const express = require('express');
const cors = require('cors');
const mysql = require('mysql');  // install this on the node modules of the front end
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pageRoutes = require('./pageRoutes'); // Path for the Routes 
const app = express();
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

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
const userId = req.headers['x-acting-user-id'] || req.body.user_id || req.params.userId;
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
// ---------- MOVIE ----------

app.get("/api/movies", (req, res) => {
  db.query("SELECT * FROM movie", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/api/movies/:id", (req, res) => {
  const movieId = req.params.id;

  db.query("SELECT * FROM movie WHERE MovieID = ?", [movieId], (err, results) => {
    if (err) {
      console.error("Error fetching movie by ID:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.json(results[0]);
  });
});


app.post("/movies", (req, res) => {
  const { Title, Genre, Language, Release_date, Runtime_minutes, Festival_joined, Distributor, Director, Actors } = req.body;
  db.query("INSERT INTO movie (Title, Genre, Language, Release_date, Runtime_minutes, Festival_joined, Distributor, Director, Actors) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [Title, Genre, Language, Release_date, Runtime_minutes, Festival_joined, Distributor, Director, Actors],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Movie added successfully!", MovieID: result.insertId });
    }
  );
});

app.put("/movies/:id", (req, res) => {
  const { Title, Genre, Language, Release_date, Runtime_minutes, Festival_joined, Distributor, Director, Actors } = req.body;
  db.query("UPDATE movie SET Title=?, Genre=?, Language=?, Release_date=?, Runtime_minutes=?, Festival_joined=?, Distributor=?, Director=?, Actors=? WHERE MovieID=?",
    [Title, Genre, Language, Release_date, Runtime_minutes, Festival_joined, Distributor, Director, Actors, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Movie updated successfully!" });
    }
  );
});

app.delete("/movies/:id", (req, res) => {
  db.query("DELETE FROM movie WHERE MovieID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Movie deleted successfully!" });
  });
});

// ---------- BOOKINGS ----------
// API Routes for Bookings
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM booking", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/bookings", (req, res) => {
  const { CustomerID, ShowtimeID, Booking_Quantity, Booking_Status } = req.body;
  db.query(
    "INSERT INTO booking (CustomerID, ShowtimeID, Booking_Quantity, Booking_Status) VALUES (?, ?, ?, ?)",
    [CustomerID, ShowtimeID, Booking_Quantity, Booking_Status],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Booking added successfully!", BookingID: result.insertId });
    }
  );
});

app.put("/bookings/:id", (req, res) => {
  const { CustomerID, ShowtimeID, Booking_Quantity, Booking_Status } = req.body;
  db.query(
    "UPDATE booking SET CustomerID=?, ShowtimeID=?, Booking_Quantity=?, Booking_Status=? WHERE BookingID=?",
    [CustomerID, ShowtimeID, Booking_Quantity, Booking_Status, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Booking updated successfully!" });
    }
  );
});

app.delete("/bookings/:id", (req, res) => {
  db.query("DELETE FROM booking WHERE BookingID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Booking deleted successfully!" });
  });
});


// ---------- CUSTOMERS ----------
// API Routes for Customers
app.get("/customers", (req, res) => {
  db.query("SELECT * FROM customer", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/customers", (req, res) => {
  const { Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership } = req.body;
  db.query(
    "INSERT INTO customer (Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Customer added successfully!", CustomerID: result.insertId });
    }
  );
});

app.put("/customers/:id", (req, res) => {
  const { Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership } = req.body;
  db.query(
    "UPDATE customer SET Name=?, Age=?, Gender=?, Email=?, Ticket_Purchase=?, Preferred_Movie_Genre=?, Membership=? WHERE CustomerID=?",
    [Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Customer updated successfully!" });
    }
  );
});

app.delete("/customers/:id", (req, res) => {
  db.query("DELETE FROM customer WHERE CustomerID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Customer deleted successfully!" });
  });
});

//-----------------------------------------------------------------------------------------------------------------------

// Read (Get All Users)
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(result);
  });
});

// Create (Add New User)
app.post('/users', async (req, res) => {
  const { username, email, role, password} = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `INSERT INTO users (username, email, role, password) VALUES (?, ?, ?, ?)`;
  db.query(query, [username,email,role, hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'User created', id: result.insertId });
  });
});

// Update User
app.put('/users/:id', (req, res) => {
  const { username, email, role, password} = req.body;
  const { id } = req.params;
  const query = 'UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE id = ?';
  db.query(query, [username, email, role, password, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'User updated' });
  });
});

// Delete User
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(200).send({ message: 'User deleted' });
  });
});

//-----------------------------------------------------------------------------------------------------------------------
// ---------- TICKET ----------
// API Routes for Tickets
app.get("/tickets", (req, res) => {
  db.query("SELECT * FROM ticket", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/tickets", (req, res) => {
  const { BookingID, SeatID, Ticket_Price } = req.body;
  db.query("INSERT INTO ticket (BookingID, SeatID, Ticket_Price) VALUES (?, ?, ?)",
    [BookingID, SeatID, Ticket_Price],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Ticket added successfully!", TicketID: result.insertId });
    }
  );
});

app.put("/tickets/:id", (req, res) => {
  const { BookingID, SeatID, Ticket_Price } = req.body;
  db.query("UPDATE ticket SET BookingID=?, SeatID=?, Ticket_Price=? WHERE TicketID=?",
    [BookingID, SeatID, Ticket_Price, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Ticket updated successfully!" });
    }
  );
});

app.delete("/tickets/:id", (req, res) => {
  db.query("DELETE FROM ticket WHERE TicketID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Ticket deleted successfully!" });
  });
});
// ---------- TICKET ----------

// ---------- THEATERS ----------
// API Routes for Theaters
app.get("/theaters", (req, res) => {
  db.query("SELECT * FROM theaters", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/theaters", (req, res) => {
  const { TheaterName, Location, Capacity } = req.body;
  db.query("INSERT INTO theaters (TheaterName, Location, Capacity) VALUES (?, ?, ?)",
    [TheaterName, Location, Capacity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Theater added successfully!", TheaterID: result.insertId });
    }
  );
});

app.put("/theaters/:id", (req, res) => {
  const { TheaterName, Location, Capacity } = req.body;
  db.query("UPDATE theaters SET TheaterName=?, Location=?, Capacity=? WHERE TheaterID=?",
    [TheaterName, Location, Capacity, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Theater updated successfully!" });
    }
  );
});

app.delete("/theaters/:id", (req, res) => {
  db.query("DELETE FROM theaters WHERE TheaterID=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Theater deleted successfully!" });
  });
});
// ---------- THEATERS ----------

// ---------- MEMBERSHIPS ----------
app.post("/register-with-membership", (req, res) => {
  const { name, age, gender, email, preferredGenre, paymentMethod, amount } = req.body;

  console.log("🔍 Received:", req.body);

  const insertCustomer = `
    INSERT INTO customer (Name, Age, Gender, Email, Ticket_Purchase, Preferred_Movie_Genre, Membership)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(insertCustomer, [name, age, gender, email, 0, preferredGenre, 'Active'], (err, result) => {
    if (err) {
      console.error("❌ Customer insert error:", err);
      return res.status(500).json({ message: 'Customer insert failed', error: err });
    }

    const customerId = result.insertId;
    console.log("✅ Customer created:", customerId);

    const start = new Date();
    const expire = new Date();
    expire.setFullYear(start.getFullYear() + 1);

    const insertMembership = `
      INSERT INTO memberships (CustomerID, Membership, Start, Expire, Status)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(insertMembership, [customerId, 'Premium', start, expire, 'Active'], (err, result2) => {
      if (err) {
        console.error("❌ Membership insert error:", err);
        return res.status(500).json({ message: 'Membership insert failed', error: err });
      }

      const insertPayment = `
        INSERT INTO payment (BookingID, PaymentMethod, Total_Am, Purpose)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertPayment, [null, paymentMethod, 'Completed', amount, 'Membership'], (err, result3) => {
        if (err) {
          console.error("❌ Payment insert error:", err);
          return res.status(500).json({ message: 'Payment insert failed', error: err });
        }

        console.log("✅ Membership and payment recorded.");
        return res.status(200).json({ message: "Membership successfully registered." });
      });
    });
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
app.get('/api/payment/:bookingId', (req, res) => {
  const { bookingId } = req.params;

  const sql = `
  SELECT 
    p.BookingID,
    t.SeatID AS Seat,
    s.Start_Time AS Showtime,
    p.PaymentMethod,
    p.OR_Num,
    'Completed' AS PaymentStatus
  FROM payment p
  JOIN ticket t ON t.BookingID = p.BookingID
  JOIN booking b ON b.BookingID = p.BookingID
  JOIN showtime s ON s.ShowtimeID = b.ShowtimeID
  WHERE p.BookingID = ?
  LIMIT 1;
`;


  db.query(sql, [bookingId], (err, result) => {
    if (err) {
      console.error("❌ Error fetching receipt:", err); // <= look for this in your terminal
      return res.status(500).json({ error: 'Database query failed', detail: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    res.json(result[0]);
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

app.get('/api/tickets/search', (req, res) => {
  const ticketId = req.query.query;

  const sql = `
    SELECT * FROM ticket
    WHERE TicketID = ?;
  `;

  db.query(sql, [ticketId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});


app.post("/bookings/with-discount", (req, res) => {
  const { CustomerID, ShowtimeID, SeatID, Booking_Quantity } = req.body;
  const basePrice = 350;

  // Step 1: Check membership
  db.query(
    `SELECT * FROM memberships WHERE CustomerID = ? AND Status = 'Active' AND Expire >= CURDATE()`,
    [CustomerID],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Membership check failed", error: err });

      const isMember = results.length > 0;
      const unitPrice = isMember ? basePrice * 0.9 : basePrice;
      const totalAmount = unitPrice * Booking_Quantity;

      // Step 2: Insert booking
      db.query(
        `INSERT INTO booking (CustomerID, ShowtimeID, Booking_Quantity, Booking_Status) VALUES (?, ?, ?, 'Confirmed')`,
        [CustomerID, ShowtimeID, Booking_Quantity],
        (err, bookingResult) => {
          if (err) return res.status(500).json({ message: "Booking failed", error: err });

          const bookingId = bookingResult.insertId;

          // Step 3: Insert multiple tickets
          const insertTickets = [];
          for (let i = 0; i < Booking_Quantity; i++) {
            insertTickets.push([bookingId, SeatID, unitPrice]);
          }

          db.query(
            `INSERT INTO ticket (BookingID, SeatID, Ticket_Price) VALUES ?`,
            [insertTickets],
            (err) => {
              if (err) return res.status(500).json({ message: "Ticket insert failed", error: err });

              // Step 4: Insert payment
              db.query(
                `INSERT INTO payment (BookingID, PaymentMethod, Total_Am, OR_Num) VALUES (?, ?, ?, ?)`,
                [bookingId, 'Cash', totalAmount, `OR${Date.now()}`],
                (err) => {
                  if (err) return res.status(500).json({ message: "Payment failed", error: err });

                  res.status(200).json({
                    message: `Booking successful. ${isMember ? '10% discount applied.' : 'Standard price.'}`,
                    pricePerTicket: unitPrice.toFixed(2),
                    total: totalAmount.toFixed(2),
                    quantity: Booking_Quantity,
                    bookingId: bookingId // ✅ final result
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});



app.listen(5000, () => {
  console.log('Server running on port 5000');
});
