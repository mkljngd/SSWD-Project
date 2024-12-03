const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const createTables = async () => {
    const queries = [
        // Users Table
        `CREATE TABLE IF NOT EXISTS users (
            user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Profiles Table
        `CREATE TABLE IF NOT EXISTS profiles (
            profile_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            profile_name VARCHAR(100) NOT NULL,
            dietary_preferences JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Cuisines Table
        `CREATE TABLE IF NOT EXISTS cuisines (
            cuisine_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Recipes Table
        `CREATE TABLE IF NOT EXISTS recipes (
            recipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id),
            cuisine_id UUID REFERENCES cuisines(cuisine_id),
            title VARCHAR(255) NOT NULL,
            description TEXT,
            instructions TEXT,
            image_url TEXT,
            source_url TEXT,
            preparation_time INT,
            rating NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Ingredients Table
        `CREATE TABLE IF NOT EXISTS ingredients (
            ingredient_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(100) UNIQUE NOT NULL,
            unit VARCHAR(20) NOT NULL,
            category VARCHAR(50),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Recipe Ingredients Table
        `CREATE TABLE IF NOT EXISTS recipe_ingredients (
            recipe_id UUID REFERENCES recipes(recipe_id) ON DELETE CASCADE,
            ingredient_id UUID REFERENCES ingredients(ingredient_id),
            quantity NUMERIC NOT NULL,
            unit VARCHAR(20),
            PRIMARY KEY (recipe_id, ingredient_id)
        )`,

        // Inventory Items Table
        `CREATE TABLE IF NOT EXISTS inventory_items (
            inventory_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(profile_id),
            ingredient_id UUID REFERENCES ingredients(ingredient_id),
            quantity NUMERIC NOT NULL,
            unit VARCHAR(20) NOT NULL,
            expiry_date DATE,
            low_stock_threshold NUMERIC,
            added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Meal Plans Table
        `CREATE TABLE IF NOT EXISTS meal_plans (
            meal_plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES profiles(profile_id) ON DELETE CASCADE,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Meal Plan Recipes Table
        `CREATE TABLE IF NOT EXISTS meal_plan_recipes (
            meal_plan_id UUID REFERENCES meal_plans(meal_plan_id) ON DELETE CASCADE,
            recipe_id UUID REFERENCES recipes(recipe_id),
            scheduled_date DATE NOT NULL,
            meal_type VARCHAR(20) NOT NULL,
            PRIMARY KEY (meal_plan_id, recipe_id, scheduled_date, meal_type)
        )`,

        // Favorite Recipes Table
        `CREATE TABLE IF NOT EXISTS favorite_recipes (
            profile_id UUID REFERENCES profiles(profile_id) ON DELETE CASCADE,
            recipe_id UUID REFERENCES recipes(recipe_id) ON DELETE CASCADE,
            favorited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (profile_id, recipe_id)
        )`,


        // Shopping Lists Table
        `CREATE TABLE IF NOT EXISTS shopping_lists (
            shopping_list_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
            meal_plan_id UUID REFERENCES meal_plans(meal_plan_id),
            status VARCHAR(20) DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )`,

        // Shopping List Items Table
        `CREATE TABLE IF NOT EXISTS shopping_list_items (
            shopping_list_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            shopping_list_id UUID REFERENCES shopping_lists(shopping_list_id) ON DELETE CASCADE,
            ingredient_id UUID REFERENCES ingredients(ingredient_id),
            quantity NUMERIC NOT NULL,
            unit VARCHAR(20),
            purchased BOOLEAN DEFAULT FALSE,
            UNIQUE (shopping_list_id, ingredient_id)
        )`,
    ];

    for (const query of queries) {
        try {
            await pool.query(query);
            console.log('Table created/updated successfully.');
        } catch (error) {
            console.error(`Error creating/updating table: ${error.message}`);
        }
    }

    pool.end();
};

createTables();