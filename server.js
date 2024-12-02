const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const recipeRoutes = require('./routes/recipes');
app.use('/api/recipes', recipeRoutes);
const ingredientRoutes = require('./routes/ingredients');
app.use('/api/ingredients', ingredientRoutes);
const mealPlanRoutes = require('./routes/mealPlans');
app.use('/api/mealPlans', mealPlanRoutes);
const inventoryRoutes = require('./routes/inventory');
app.use('/api/inventory', inventoryRoutes);
const expenseRoutes = require('./routes/expenses');
app.use('/api/expenses', expenseRoutes);
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});