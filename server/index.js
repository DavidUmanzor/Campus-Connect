require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.SERVER_PORT || 5000;

// Import route handlers
const userRoutes = require('./routes/user');
const universityRoutes = require('./routes/university');
const rsosRoutes = require('./routes/rso');
const eventsRoutes = require('./routes/event');
const commentsratingsRoutes = require('./routes/commentsratings');
const loginRoutes = require('./routes/login');

//middleware
app.use(cors());
app.use(express.json());

//ROUTES//
app.use('/api/users', userRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/rsos', rsosRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/commentsratings', commentsratingsRoutes);
app.use('/api/login', loginRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});