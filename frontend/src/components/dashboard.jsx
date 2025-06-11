import React, { useEffect, useState } from 'react';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, Container, Select, MenuItem, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [pages, setPages] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: '', password: ''});
  const [editUser, setEditUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);    

  const [tickets, setTickets] = useState([]);
  const [newTicket, setNewTicket] = useState({ BookingID: '', SeatID: '', Ticket_Price: '' });
  const [editTicket, setEditTicket] = useState(null);

  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({ Title: "", Genre: "", Language: "", Release_date: "", Runtime_minutes: "", Festival_joined: "", Distributor: "", Director: "", Actors: "" });
  const [editMovie, setEditMovie] = useState(null);

  const [theaters, setTheaters] = useState([]);
  const [newTheater, setNewTheater] = useState({ TheaterName: "", Location: "", Capacity: "" });
  const [editTheater, setEditTheater] = useState(null);

  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ Name: "", Age: "", Gender: "", Email: "", Ticket_Purchase: "", Preferred_Movie_Genre: "", Membership: "" });
  const [editCustomer, setEditCustomer] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [newBooking, setNewBooking] = useState({ CustomerID: "", ShowtimeID: "", Booking_Quantity: "", Booking_Status: "" });
  const [editBooking, setEditBooking] = useState(null);


  const navigate = useNavigate();
  
  useEffect(() => {
  const userId = localStorage.getItem('userId');
  const pageId = 3; // Profile page ID

  if (!userId) {
    setHasAccess(false);
    return;
  }

  const checkAccess = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/page_access/${userId}/${pageId}`);

      if (response.data && typeof response.data.hasAccess === 'boolean') {
        setHasAccess(response.data.hasAccess);
        if (response.data.hasAccess) {
          fetchUsers();
          fetchPages();
          fetchTickets();
          fetchMovies();
          fetchTheaters();
          fetchCustomers();
          fetchBookings();


        }
      } else {
        console.error('Unexpected API response format:', response.data);
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
    }
  };

  checkAccess();
}, []);

    const fetchPages = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/pages');
    setPages(response.data);
  } catch (error) {
    console.error('Error fetching pages:', error);
  }
};
 // USER START ------------------------

    const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

   const addUser = async () => {
    if (!newUser.username.trim() || !newUser.password.trim()) return;
    await axios.post('http://localhost:5000/users', newUser);
    setNewUser({ username: '', email: '', role: '', password: ''});
    fetchUsers();
  };

  const updateUser = async () => {
    if (!editUser || !editUser.password || !editUser.id) return;
  
    try {
      // Hash the password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(editUser.password, salt);
      
      // Update the user object with the hashed password
      const updatedUser = { ...editUser, password: hashedPassword };
  
      await axios.put(`http://localhost:5000/users/${editUser.id}`, updatedUser);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/users/${id}`);
    fetchUsers();
  };
  // USER END ------------------------

 // TICKET START ------------------------

  const fetchTickets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tickets');
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const addTicket = async () => {
    if (!newTicket.BookingID.trim() || !newTicket.Ticket_Price.trim()) return;
    await axios.post('http://localhost:5000/tickets', newTicket);
    setNewTicket({ BookingID: '', SeatID: '', Ticket_Price: '' });
    fetchTickets();
  };

  const updateTicket = async () => {
    if (!editTicket || !editTicket.id) return;
    await axios.put(`http://localhost:5000/tickets/${editTicket.id}`, editTicket);
    setEditTicket(null);
    fetchTickets();
  };

  const deleteTicket = async (id) => {
    await axios.delete(`http://localhost:5000/tickets/${id}`);
    fetchTickets();
  };
 // TICKET END ------------------------

 // Movie START ------------------------

  const fetchMovies = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/movies");
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const addMovie = async () => {
    if (!newMovie.Title.trim()) return;
    await axios.post("http://localhost:5000/movies", newMovie);
    setNewMovie({ Title: "", Genre: "", Language: "", Release_date: "", Runtime_minutes: "", Festival_joined: "", Distributor: "", Director: "", Actors: "" });
    fetchMovies();
  };

  const updateMovie = async () => {
    if (!editMovie || !editMovie.MovieID) return;
    await axios.put(`http://localhost:5000/movies/${editMovie.MovieID}`, editMovie);
    setEditMovie(null);
    fetchMovies();
  };

  const deleteMovie = async (id) => {
    await axios.delete(`http://localhost:5000/movies/${id}`);
    fetchMovies();
  };

 // Movie END ------------------------

 // THEATERS START ------------------------
    const fetchTheaters = async () => {
    try {
      const response = await axios.get("http://localhost:5000/theaters");
      setTheaters(response.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const addTheater = async () => {
    if (!newTheater.TheaterName.trim()) return;
    await axios.post("http://localhost:5000/theaters", newTheater);
    setNewTheater({ TheaterName: "", Location: "", Capacity: "" });
    fetchTheaters();
  };

  const updateTheater = async () => {
    if (!editTheater || !editTheater.TheaterID) return;
    await axios.put(`http://localhost:5000/theaters/${editTheater.TheaterID}`, editTheater);
    setEditTheater(null);
    fetchTheaters();
  };

  const deleteTheater = async (id) => {
    await axios.delete(`http://localhost:5000/theaters/${id}`);
    fetchTheaters();
  };

 // THEATERS END ------------------------

 // CUSTOMER START ------------------------
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const addCustomer = async () => {
    if (!newCustomer.Name.trim()) return;
    await axios.post("http://localhost:5000/customers", newCustomer);
    setNewCustomer({ Name: "", Age: "", Gender: "", Email: "", Ticket_Purchase: "", Preferred_Movie_Genre: "", Membership: "" });
    fetchCustomers();
  };

  const updateCustomer = async () => {
    if (!editCustomer || !editCustomer.CustomerID) return;
    await axios.put(`http://localhost:5000/customers/${editCustomer.CustomerID}`, editCustomer);
    setEditCustomer(null);
    fetchCustomers();
  };

  const deleteCustomer = async (id) => {
    await axios.delete(`http://localhost:5000/customers/${id}`);
    fetchCustomers();
  };


 // CUSTOMER END ------------------------

 // BOOKING START ------------------------
    const fetchBookings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/bookings");
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const addBooking = async () => {
    if (!newBooking.CustomerID || !newBooking.ShowtimeID) return;
    await axios.post("http://localhost:5000/bookings", newBooking);
    setNewBooking({ CustomerID: "", ShowtimeID: "", Booking_Quantity: "", Booking_Status: "" });
    fetchBookings();
  };

  const updateBooking = async () => {
    if (!editBooking || !editBooking.BookingID) return;
    await axios.put(`http://localhost:5000/bookings/${editBooking.BookingID}`, editBooking);
    setEditBooking(null);
    fetchBookings();
  };

  const deleteBooking = async (id) => {
    await axios.delete(`http://localhost:5000/bookings/${id}`);
    fetchBookings();
  };

 // BOOKING END ------------------------

 // CUSTOMER START ------------------------
  
 // CUSTOMER END ------------------------

 // PRINT USER START ------------------------
  const printUsers = () => {
  const printContent = `
    <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        ${users
          .map(
            (user) => `
          <tr>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Users</title>
      </head>
      <body>
        <h1>Users List</h1>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};
 // PRINT USER END ------------------------

 // TICKET USER START ------------------------
const printTickets = () => {
    const printContent = `
      <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Booking ID</th>
            <th>Seat ID</th>
            <th>Ticket Price</th>
          </tr>
        </thead>
        <tbody>
          ${tickets.map(ticket => `
          <tr>
            <td>${ticket.TicketID}</td>
            <td>${ticket.BookingID}</td>
            <td>${ticket.SeatID}</td>
            <td>${ticket.Ticket_Price}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Tickets</title>
        </head>
        <body>
          <h1>Tickets List</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
   // PRINT TICKET END ------------------------

   // PRINT MOVIE START ------------------------
    const printMovies = () => {
  const printContent = `
    <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Genre</th>
          <th>Language</th>
          <th>Release Date</th>
          <th>Runtime</th>
          <th>Festival</th>
          <th>Distributor</th>
          <th>Director</th>
          <th>Actors</th>
        </tr>
      </thead>
      <tbody>
        ${movies
          .map(
            (movie) => `
        <tr>
          <td>${movie.MovieID}</td>
          <td>${movie.Title}</td>
          <td>${movie.Genre}</td>
          <td>${movie.Language}</td>
          <td>${movie.Release_date}</td>
          <td>${movie.Runtime_minutes}</td>
          <td>${movie.Festival_joined}</td>
          <td>${movie.Distributor}</td>
          <td>${movie.Director}</td>
          <td>${movie.Actors}</td>
        </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Movies</title>
      </head>
      <body>
        <h1>Movie List</h1>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
};
   // PRINT MOVIE END ------------------------

    // PRINT THEATERS START ------------------------

    const printTheaters = () => {
    const printContent = `
      <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody>
          ${theaters
            .map(
              (theater) => `
          <tr>
            <td>${theater.TheaterID}</td>
            <td>${theater.TheaterName}</td>
            <td>${theater.Location}</td>
            <td>${theater.Capacity}</td>
          </tr>
        `
            )
            .join("")}
        </tbody>
      </table>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Theaters</title>
        </head>
        <body>
          <h1>Theater List</h1>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };
      // PRINT THEATERS END ------------------------

      // PRINT CUSTOMER START ------------------------
        const printCustomers = () => {
          const printContent = `
            <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Ticket Purchase</th>
                  <th>Preferred Genre</th>
                  <th>Membership</th>
                </tr>
              </thead>
              <tbody>
                ${customers
                  .map(
                    (customer) => `
                <tr>
                  <td>${customer.CustomerID}</td>
                  <td>${customer.Name}</td>
                  <td>${customer.Age}</td>
                  <td>${customer.Gender}</td>
                  <td>${customer.Email}</td>
                  <td>${customer.Ticket_Purchase}</td>
                  <td>${customer.Preferred_Movie_Genre}</td>
                  <td>${customer.Membership}</td>
                </tr>
              `
                  )
                  .join("")}
              </tbody>
            </table>
          `;

          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
            <html>
              <head>
                <title>Print Customers</title>
              </head>
              <body>
                <h1>Customer List</h1>
                ${printContent}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        };

      // PRINT CUSTOMER END ------------------------

      // PRINT BOOKING START ------------------------
        const printBookings = () => {
        const printContent = `
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: left;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Showtime ID</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(
                (booking) => `
              <tr>
                <td>${booking.BookingID}</td>
                <td>${booking.CustomerID}</td>
                <td>${booking.ShowtimeID}</td>
                <td>${booking.Booking_Quantity}</td>
                <td>${booking.Booking_Status}</td>
              </tr>
            `
              ).join("")}
            </tbody>
          </table>
        `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Bookings</title>
            </head>
            <body>
              <h1>Bookings List</h1>
              ${printContent}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      };
      // PRINT BOOKING END ------------------------

      // PRINT BOOKING START ------------------------

      
      // PRINT BOOKING END ------------------------


     // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- START

    // If hasAccess is still null, show a loading state
    if (hasAccess === null) {
        return <div>Loading access information...</div>;
    }
  
    // Deny access if hasAccess is false
    if (!hasAccess) {
        return <div>You do not have access to this page. You need to ask permission to the administration.</div>;
    }
  // PAGE ACCESS SCRIPT ------------------------ LOWER PART --- END


  const logout = () => { 
  localStorage.removeItem('token');
  navigate('/');
}; 

  return (
  <Container>
    <h1>DASHBOARD</h1>
    <Button onClick={logout} variant="contained" color="secondary">Logout</Button>

    <h2>Users</h2>
      <div>
        <TextField
          label="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          />
        <TextField
          label="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <InputLabel>Role</InputLabel>
        <Select
          value={newUser.role}
          onChange={(e) =>
            setNewUser({ ...newUser, role: e.target.value })
          }
          label="Role"
        >
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="User">User</MenuItem>
        </Select>
        <TextField
          label="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <Button onClick={addUser} variant="contained" color="primary">Add</Button>
        <Button
          onClick={printUsers}
          variant="contained"
          color="secondary"
          style={{ marginLeft: '10px' }}
        >
          Print Users
        </Button>
        </div>
        <Table>
          <TableHead>
            <TableRow>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>ID</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Username</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Password</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Email</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Role</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(user => (
            <TableRow key={user.id}>
              <TableCell sx={{ border: '1px solid black' }}>{user.id}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editUser && editUser.id === user.id ? (
                  <TextField
                    value={editUser.username}
                    onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                  />
                ) : (
                  user.username
                )}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editUser && editUser.id === user.id ? (
                    <TextField
                    value={editUser.password}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                    />
                ) : (
                    '********' // Hide the actual password
                )}
                </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editUser && editUser.id === user.id ? (
                  <TextField
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
                </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editUser && editUser.id === user.id ? (
                <>
                  <InputLabel>Role</InputLabel>
                    <Select
                      value={newUser.role}
                      onChange={(e) =>
                        setEditUser({ ...editUser, role: e.target.value })
                      }
                      label="Role"
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="User">User</MenuItem>
                      </Select>
                      </>
                      ) : (
                        user.role
                      )}
                    </TableCell>

              <TableCell sx={{ border: '1px solid black' }}>
                {editUser && editUser.id === user.id ? (
                  <>
                    <Button onClick={updateUser} variant="contained" color="primary">
                      Save
                    </Button>
                    <Button onClick={() => setEditUser(null)} variant="outlined" color="secondary">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditUser(user)} variant="outlined" color="primary">
                      Edit
                    </Button>
                    <Button onClick={() => deleteUser(user.id)} variant="outlined" color="secondary">
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Movie</h2>
      <div>
        <TextField label="Title" value={newMovie.Title} onChange={(e) => setNewMovie({ ...newMovie, Title: e.target.value })} />
        <TextField label="Genre" value={newMovie.Genre} onChange={(e) => setNewMovie({ ...newMovie, Genre: e.target.value })} />
        <TextField label="Language" value={newMovie.Language} onChange={(e) => setNewMovie({ ...newMovie, Language: e.target.value })} />
        <TextField type="date" value={newMovie.Release_date} onChange={(e) => setNewMovie({ ...newMovie, Release_date: e.target.value })} />
        <TextField label="Runtime (HH:MM:SS)" value={newMovie.Runtime_minutes} onChange={(e) => setNewMovie({ ...newMovie, Runtime_minutes: e.target.value })} />
        <TextField label="Festival" value={newMovie.Festival_joined} onChange={(e) => setNewMovie({ ...newMovie, Festival_joined: e.target.value })} />
        <TextField label="Distributor" value={newMovie.Distributor} onChange={(e) => setNewMovie({ ...newMovie, Distributor: e.target.value })} />
        <TextField label="Director" value={newMovie.Director} onChange={(e) => setNewMovie({ ...newMovie, Director: e.target.value })} />
        <TextField label="Actors" value={newMovie.Actors} onChange={(e) => setNewMovie({ ...newMovie, Actors: e.target.value })} />
        <Button onClick={addMovie} variant="contained" color="primary">Add Movie</Button>
        <Button onClick={printMovies} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Print Movie</Button>
      </div>

      <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>ID</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Title</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Genre</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Language</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Release Date</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Runtime</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Festival</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Distributor</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Director</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Actors</TableCell>
              <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map(movie => (
              <TableRow key={movie.MovieID}>
                <TableCell sx={{ border: "1px solid black" }}>{movie.MovieID}</TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Title} onChange={(e) => setEditMovie({ ...editMovie, Title: e.target.value })} />
                  ) : (
                    movie.Title
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Genre} onChange={(e) => setEditMovie({ ...editMovie, Genre: e.target.value })} />
                  ) : (
                    movie.Genre
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Language} onChange={(e) => setEditMovie({ ...editMovie, Language: e.target.value })} />
                  ) : (
                    movie.Language
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField type="date" value={editMovie.Release_date} onChange={(e) => setEditMovie({ ...editMovie, Release_date: e.target.value })} />
                  ) : (
                    movie.Release_date
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Runtime_minutes} onChange={(e) => setEditMovie({ ...editMovie, Runtime_minutes: e.target.value })} />
                  ) : (
                    movie.Runtime_minutes
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Festival_joined} onChange={(e) => setEditMovie({ ...editMovie, Festival_joined: e.target.value })} />
                  ) : (
                    movie.Festival_joined
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Distributor} onChange={(e) => setEditMovie({ ...editMovie, Distributor: e.target.value })} />
                  ) : (
                    movie.Distributor
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Director} onChange={(e) => setEditMovie({ ...editMovie, Director: e.target.value })} />
                  ) : (
                    movie.Director
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <TextField value={editMovie.Actors} onChange={(e) => setEditMovie({ ...editMovie, Actors: e.target.value })} />
                  ) : (
                    movie.Actors
                  )}
                </TableCell>
                <TableCell sx={{ border: "1px solid black" }}>
                  {editMovie && editMovie.MovieID === movie.MovieID ? (
                    <>
                      <Button onClick={updateMovie} variant="contained" color="primary">Save</Button>
                      <Button onClick={() => setEditMovie(null)} variant="outlined" color="secondary">Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={() => setEditMovie(movie)} variant="outlined" color="primary">Edit</Button>
                      <Button onClick={() => deleteMovie(movie.MovieID)} variant="outlined" color="secondary">Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      <h2>Tickets</h2>
      <div>
        <TextField label="Booking ID" value={newTicket.BookingID} onChange={(e) => setNewTicket({ ...newTicket, BookingID: e.target.value })} />
        <TextField label="Seat ID" value={newTicket.SeatID} onChange={(e) => setNewTicket({ ...newTicket, SeatID: e.target.value })} />
        <TextField label="Ticket Price" value={newTicket.Ticket_Price} onChange={(e) => setNewTicket({ ...newTicket, Ticket_Price: e.target.value })} />
        <Button onClick={addTicket} variant="contained" color="primary">Add Ticket</Button>
        <Button onClick={printTickets} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>Print Tickets</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Ticket ID</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Booking ID</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Seat ID</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Ticket Price</TableCell>
            <TableCell sx={{ border: '1px solid black', fontWeight: 'bold', backgroundColor: 'yellow' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map(ticket => (
            <TableRow key={ticket.TicketID}>
              <TableCell sx={{ border: '1px solid black' }}>{ticket.TicketID}</TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editTicket && editTicket.TicketID === ticket.TicketID ? (
                  <TextField value={editTicket.BookingID} onChange={(e) => setEditTicket({ ...editTicket, BookingID: e.target.value })} />
                ) : (
                  ticket.BookingID
                )}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editTicket && editTicket.TicketID === ticket.TicketID ? (
                  <TextField value={editTicket.SeatID} onChange={(e) => setEditTicket({ ...editTicket, SeatID: e.target.value })} />
                ) : (
                  ticket.SeatID
                )}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editTicket && editTicket.TicketID === ticket.TicketID ? (
                  <TextField value={editTicket.Ticket_Price} onChange={(e) => setEditTicket({ ...editTicket, Ticket_Price: e.target.value })} />
                ) : (
                  ticket.Ticket_Price
                )}
              </TableCell>
              <TableCell sx={{ border: '1px solid black' }}>
                {editTicket && editTicket.TicketID === ticket.TicketID ? (
                  <>
                    <Button onClick={updateTicket} variant="contained" color="primary">Save</Button>
                    <Button onClick={() => setEditTicket(null)} variant="outlined" color="secondary">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditTicket(ticket)} variant="outlined" color="primary">Edit</Button>
                    <Button onClick={() => deleteTicket(ticket.TicketID)} variant="outlined" color="secondary">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

          <h2>Theaters</h2>
            <div>
              <TextField label="Name" value={newTheater.TheaterName} onChange={(e) => setNewTheater({ ...newTheater, TheaterName: e.target.value })} />
              <TextField label="Location" value={newTheater.Location} onChange={(e) => setNewTheater({ ...newTheater, Location: e.target.value })} />
              <TextField label="Capacity" type="number" value={newTheater.Capacity} onChange={(e) => setNewTheater({ ...newTheater, Capacity: e.target.value })} />
              <Button onClick={addTheater} variant="contained" color="primary">Add Theater</Button>
              <Button onClick={printTheaters} variant="contained" color="secondary" style={{ marginLeft: "10px" }}>Print Theaters</Button>
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>ID</TableCell>
                  <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Name</TableCell>
                  <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Location</TableCell>
                  <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Capacity</TableCell>
                  <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {theaters.map(theater => (
                  <TableRow key={theater.TheaterID}>
                    <TableCell sx={{ border: "1px solid black" }}>{theater.TheaterID}</TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {editTheater && editTheater.TheaterID === theater.TheaterID ? (
                        <TextField value={editTheater.TheaterName} onChange={(e) => setEditTheater({ ...editTheater, TheaterName: e.target.value })} />
                      ) : (
                        theater.TheaterName
                      )}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {editTheater && editTheater.TheaterID === theater.TheaterID ? (
                        <TextField value={editTheater.Location} onChange={(e) => setEditTheater({ ...editTheater, Location: e.target.value })} />
                      ) : (
                        theater.Location
                      )}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {editTheater && editTheater.TheaterID === theater.TheaterID ? (
                        <TextField type="number" value={editTheater.Capacity} onChange={(e) => setEditTheater({ ...editTheater, Capacity: e.target.value })} />
                      ) : (
                        theater.Capacity
                      )}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid black" }}>
                      {editTheater && editTheater.TheaterID === theater.TheaterID ? (
                        <>
                          <Button onClick={updateTheater} variant="contained" color="primary">Save</Button>
                          <Button onClick={() => setEditTheater(null)} variant="outlined" color="secondary">Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => setEditTheater(theater)} variant="outlined" color="primary">Edit</Button>
                          <Button onClick={() => deleteTheater(theater.TheaterID)} variant="outlined" color="secondary">Delete</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

        <h2>Customers</h2>
          <div>
            <TextField label="Name" value={newCustomer.Name} onChange={(e) => setNewCustomer({ ...newCustomer, Name: e.target.value })} />
            <TextField label="Age" type="number" value={newCustomer.Age} onChange={(e) => setNewCustomer({ ...newCustomer, Age: e.target.value })} />
            <InputLabel>Gender</InputLabel>
            <Select value={newCustomer.Gender} onChange={(e) => setNewCustomer({ ...newCustomer, Gender: e.target.value })} label="Gender">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
            <TextField label="Email" value={newCustomer.Email} onChange={(e) => setNewCustomer({ ...newCustomer, Email: e.target.value })} />
            <TextField label="Ticket Purchase" type="number" value={newCustomer.Ticket_Purchase} onChange={(e) => setNewCustomer({ ...newCustomer, Ticket_Purchase: e.target.value })} />
            <TextField label="Preferred Genre" value={newCustomer.Preferred_Movie_Genre} onChange={(e) => setNewCustomer({ ...newCustomer, Preferred_Movie_Genre: e.target.value })} />
            <TextField label="Membership" value={newCustomer.Membership} onChange={(e) => setNewCustomer({ ...newCustomer, Membership: e.target.value })} />
            <Button onClick={addCustomer} variant="contained" color="primary">Add Customer</Button>
            <Button onClick={printCustomers} variant="contained" color="secondary">Print Customers</Button>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>ID</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Name</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Age</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Gender</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Email</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Ticket Purchase</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Preferred Genre</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Membership</TableCell>
                <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map(customer => (
                <TableRow key={customer.CustomerID}>
                  <TableCell sx={{ border: "1px solid black" }}>{customer.CustomerID}</TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField value={editCustomer.Name} onChange={(e) => setEditCustomer({ ...editCustomer, Name: e.target.value })} />
                    ) : (
                      customer.Name
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField type="number" value={editCustomer.Age} onChange={(e) => setEditCustomer({ ...editCustomer, Age: e.target.value })} />
                    ) : (
                      customer.Age
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <Select value={editCustomer.Gender} onChange={(e) => setEditCustomer({ ...editCustomer, Gender: e.target.value })}>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    ) : (
                      customer.Gender
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField value={editCustomer.Email} onChange={(e) => setEditCustomer({ ...editCustomer, Email: e.target.value })} />
                    ) : (
                      customer.Email
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField type="number" value={editCustomer.Ticket_Purchase} onChange={(e) => setEditCustomer({ ...editCustomer, Ticket_Purchase: e.target.value })} />
                    ) : (
                      customer.Ticket_Purchase
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField value={editCustomer.Preferred_Movie_Genre} onChange={(e) => setEditCustomer({ ...editCustomer, Preferred_Movie_Genre: e.target.value })} />
                    ) : (
                      customer.Preferred_Movie_Genre
                    )}
                  </TableCell>

                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <TextField value={editCustomer.Membership} onChange={(e) => setEditCustomer({ ...editCustomer, Membership: e.target.value })} />
                    ) : (
                      customer.Membership
                    )}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid black" }}>
                    {editCustomer && editCustomer.CustomerID === customer.CustomerID ? (
                      <>
                        <Button onClick={updateCustomer} variant="contained" color="primary">Save</Button>
                        <Button onClick={() => setEditCustomer(null)} variant="outlined" color="secondary">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditCustomer(customer)} variant="outlined" color="primary">Edit</Button>
                        <Button onClick={() => deleteCustomer(customer.CustomerID)} variant="outlined" color="secondary">Delete</Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        <h2>Bookings</h2>
      <div>
        <TextField label="Customer ID" value={newBooking.CustomerID} onChange={(e) => setNewBooking({ ...newBooking, CustomerID: e.target.value })} />
        <TextField label="Showtime ID" value={newBooking.ShowtimeID} onChange={(e) => setNewBooking({ ...newBooking, ShowtimeID: e.target.value })} />
        <TextField label="Booking Quantity" type="number" value={newBooking.Booking_Quantity} onChange={(e) => setNewBooking({ ...newBooking, Booking_Quantity: e.target.value })} />
        <InputLabel>Status</InputLabel>
        <Select value={newBooking.Booking_Status} onChange={(e) => setNewBooking({ ...newBooking, Booking_Status: e.target.value })}>
          <MenuItem value="Confirmed">Confirmed</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Cancelled">Cancelled</MenuItem>
        </Select>
        <Button onClick={addBooking} variant="contained" color="primary">Add Booking</Button>
        <Button onClick={printBookings} variant="contained" color="secondary">Print Bookings</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>ID</TableCell>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Customer ID</TableCell>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Showtime ID</TableCell>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Quantity</TableCell>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Status</TableCell>
            <TableCell sx={{ border: "1px solid black", fontWeight: "bold", backgroundColor: "yellow" }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map(booking => (
            <TableRow key={booking.BookingID}>
              <TableCell sx={{ border: "1px solid black" }}>{booking.BookingID}</TableCell>
              <TableCell sx={{ border: "1px solid black" }}>
                {editBooking && editBooking.BookingID === booking.BookingID ? (
                  <TextField value={editBooking.CustomerID} onChange={(e) => setEditBooking({ ...editBooking, CustomerID: e.target.value })} />
                ) : (
                  booking.CustomerID
                )}
              </TableCell>

              <TableCell sx={{ border: "1px solid black" }}>
                {editBooking && editBooking.BookingID === booking.BookingID ? (
                  <TextField value={editBooking.ShowtimeID} onChange={(e) => setEditBooking({ ...editBooking, ShowtimeID: e.target.value })} />
                ) : (
                  booking.ShowtimeID
                )}
              </TableCell>

              <TableCell sx={{ border: "1px solid black" }}>
                {editBooking && editBooking.BookingID === booking.BookingID ? (
                  <TextField type="number" value={editBooking.Booking_Quantity} onChange={(e) => setEditBooking({ ...editBooking, Booking_Quantity: e.target.value })} />
                ) : (
                  booking.Booking_Quantity
                )}
              </TableCell>

              <TableCell sx={{ border: "1px solid black" }}>
                {editBooking && editBooking.BookingID === booking.BookingID ? (
                  <Select value={editBooking.Booking_Status} onChange={(e) => setEditBooking({ ...editBooking, Booking_Status: e.target.value })}>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                ) : (
                  booking.Booking_Status
                )}
              </TableCell>

              <TableCell sx={{ border: "1px solid black" }}>
                {editBooking && editBooking.BookingID === booking.BookingID ? (
                  <>
                    <Button onClick={updateBooking} variant="contained" color="primary">Save</Button>
                    <Button onClick={() => setEditBooking(null)} variant="outlined" color="secondary">Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setEditBooking(booking)} variant="outlined" color="primary">Edit</Button>
                    <Button onClick={() => deleteBooking(booking.BookingID)} variant="outlined" color="secondary">Delete</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

    </Container>
   );
};

export default Dashboard;