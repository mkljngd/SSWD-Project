async function fetchRecipesFromAPI() {
    const fetch = (await import('node-fetch')).default; // Dynamically import node-fetch
    const response = await fetch('http://localhost:3000/api/recipes');
    if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}

module.exports = { fetchRecipesFromAPI };