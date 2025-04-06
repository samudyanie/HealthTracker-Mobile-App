import React, { useState } from 'react';
import axios from 'axios';

const CalorieCountPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [category, setCategory] = useState('');
  const [userId, setUserId] = useState('user1'); // You can set this dynamically based on the logged-in user

  // Search for food items based on user input
  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/searchFood?searchTerm=${searchTerm}`);
      setFoodResults(res.data.foodItems);
    } catch (error) {
      console.error("Error fetching food items:", error);
    }
  };

  // Handle food selection
  const handleSelectFood = (food) => {
    setSelectedFoods([...selectedFoods, food]);
    setSearchTerm(''); // Reset search term after selection
    setFoodResults([]); // Reset food results
  };

  // Submit food data (Calorie intake)
  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/postCalorieData', {
        userId,
        foodItems: selectedFoods,
        category,
      });
      console.log("Food data saved:", res.data);
    } catch (error) {
      console.error("Error saving calorie data:", error);
    }
  };

  return (
    <div>
      <h2>Calorie Count</h2>

      <div>
        <button onClick={() => setCategory('Breakfast')}>Add Breakfast</button>
        <button onClick={() => setCategory('Lunch')}>Add Lunch</button>
        <button onClick={() => setCategory('Dinner')}>Add Dinner</button>
        <button onClick={() => setCategory('Snack')}>Add Snack</button>
      </div>

      {category && (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for food..."
            onKeyUp={handleSearch}
          />
          <ul>
            {foodResults.map((food) => (
              <li key={food.name} onClick={() => handleSelectFood(food)}>
                {food.name} - {food.calories} Calories
              </li>
            ))}
          </ul>

          <h3>Selected Foods:</h3>
          <ul>
            {selectedFoods.map((food) => (
              <li key={food.name}>{food.name}</li>
            ))}
          </ul>

          <button onClick={handleSubmit}>Save Food Intake</button>
        </div>
      )}
    </div>
  );
};

export default CalorieCountPage;
