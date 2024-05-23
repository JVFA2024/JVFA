require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/Users');
const PORT = process.env.PORT || 3000;
const axios = require('axios');
app.use(express.json());
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:5173', // Adjust as per your React app's URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//Connection to mongoDB 
mongoose.connect(process.env.DB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


//Check if the server is up and running 
app.listen(PORT, ()=> console.log("the server is running on port 3000"));



//General check route  
app.get('/', (req, res)=>{

  res.send("Welcome to Jana Virtual Financial Assistant");
 
 });


//Health check route
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is up and running' });
  });
  

// Login route
app.post('/login', async (req, res) => {
  console.log("login successfully");  
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Find user by username
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Middleware to authenticate and set user on request
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


//AI data exchange route (react and python)
app.post('/api/general_query', authenticateToken, async (req, res) => {
  try {
      const { prompt } = req.body;  // Make sure 'prompt' is being sent by the client
      console.log("Sending query to Flask:", prompt);
      const response = await fetch("http://127.0.0.1:5000/general_query", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt }),  // Ensure this matches the Flask expectation
      });
      const data = await response.json();
      console.log("receiving data:", data);
      return res.json({data})
  } catch (error) {
      console.error('Error calling Flask API:', error);
      res.status(500).json({ error: 'Failed to process query' });
  }
});


//Fetch user balance route 
app.get('/userbalance', authenticateToken, async (req, res) => {
  try {
    // The user's ID is extracted from the token in the authenticateToken middleware
    const userId = req.user._id;
    const user = await User.findById(userId).select('accountBalance');
    
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    
    res.status(200).json({
      accountBalance: user.accountBalance
    });
  } catch (err) {
    console.error('There is an error:', err);
    res.status(500).send('Error retrieving user balance from database');
  }
});



//Fetch user transactions route 
app.get('/recent_transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('+transactions');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.transactions || user.transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found' });
    }

    res.status(200).json({ transactions: user.transactions });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'An error occurred while fetching user transactions.' });
  }
});



//Fetch user spending route 
app.get('/user_spendings', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('+spendings');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.spendings || user.spendings.length === 0) {
      return res.status(404).json({ error: 'No spendings found' });
    }

    res.status(200).json({ spendings: user.spendings });
  } catch (err) {
    console.error('Server Error:', err);
    res.status(500).json({ error: 'An error occurred while fetching user spendings.' });
  }
});


// Route to add an appointment
app.post('/appointments', authenticateToken, async (req, res) => {
  try {
    const { fullname, nationalID, accountNumber, serviceType, appointmentDate } = req.body;
    
    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Create new appointment
    const newAppointment = {
      fullname,
      nationalID,
      accountNumber,
      serviceType,
      appointmentDate: new Date(appointmentDate)
    };

    // Add to the user's appointments
    user.appointments.push(newAppointment);
    await user.save();
    console.log("Appointment submitted")
    res.status(201).send(newAppointment);
  } catch (error) {
    console.error('Error adding appointment:', error);
    res.status(500).send({ error: 'Failed to add appointment' });
  }
});


