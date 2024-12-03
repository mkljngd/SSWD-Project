const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { Pool } = require('pg');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recipeRoutes = require('./routes/recipes');
const ingredientRoutes = require('./routes/ingredients');
const mealPlanRoutes = require('./routes/mealPlans');
const inventoryRoutes = require('./routes/inventory');
const notificationRoutes = require('./routes/notifications');
const profileRoutes = require('./routes/profiles');

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/recipes', authMiddleware, recipeRoutes);
app.use('/api/ingredients', authMiddleware, ingredientRoutes);
app.use('/api/mealPlans', authMiddleware, mealPlanRoutes);
app.use('/api/inventory', authMiddleware, inventoryRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

app.use('/api/profiles', authMiddleware, profileRoutes);
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home Page
app.get('/', (req, res) => {
    res.render('index', { title: 'Smart Meal Planner' });
});

// Recipes Page
app.get('/recipes', async (req, res) => {
    try {
        const { rows: recipes } = await pool.query('SELECT * FROM recipes');
        res.render('pages/recipes', { title: 'Recipes', recipes });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).send('Error fetching recipes');
    }
});

// Meal Plans Page
app.get('/mealPlans', async (req, res) => {
    try {
        const { rows: mealPlans } = await pool.query('SELECT * FROM meal_plans');
        res.render('pages/mealPlans', { title: 'Meal Plans', mealPlans });
    } catch (error) {
        console.error('Error fetching meal plans:', error);
        res.status(500).send('Error fetching meal plans');
    }
});

// Inventory Page
app.get('/inventory', async (req, res) => {
    try {
        const { rows: inventory } = await pool.query(`
            SELECT ii.inventory_item_id, i.name, ii.quantity, ii.unit, ii.expiry_date 
            FROM inventory_items ii 
            JOIN ingredients i ON ii.ingredient_id = i.ingredient_id
        `);
        res.render('pages/inventory', { title: 'Inventory', inventory });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).send('Error fetching inventory');
    }
});
// Ingredients Page
app.get('/ingredients', async (req, res) => {
    try {
        const { rows: ingredients } = await pool.query('SELECT * FROM ingredients');
        res.render('pages/ingredients', { title: 'Ingredients', ingredients });
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).send('Error fetching ingredients');
    }
});

// Notifications Page
app.get('/notifications', async (req, res) => {
    try {
        const { rows: notifications } = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.render('pages/notifications', { title: 'Notifications', notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).send('Error fetching notifications');
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;