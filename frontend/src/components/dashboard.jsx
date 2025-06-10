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
      const response = await axios.get("http://localhost:5000/movies");
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
          {/* Print Users Button */}
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

    </Container>
   );
};

export default Dashboard;