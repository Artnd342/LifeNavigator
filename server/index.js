const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks'); // Assuming you have this
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes); // protect with auth middleware if needed

app.listen(3001, () => console.log('Server running on http://localhost:3001'));




