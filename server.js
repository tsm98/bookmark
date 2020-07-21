const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect to db
connectDB();

app.get('/', (req, res) => res.send('Server started'));

//Middleware
app.use(express.json({ extended: false })); //bodyparser

//Routes
app.use('/api/tags', require('./routes/api/tags'));
app.use('/api/bookmarks', require('./routes/api/bookmarks'));
app.use('/api/display', require('./routes/api/display'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
