import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function CalorieCalculator() {
  // State variables
  const [mealData, setMealData] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMealTime, setSelectedMealTime] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });

  // Fetch meal data on component mount
  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = {
          "Sri_Lankan_Foods": [
            { "name": "Rice_and_Curry - Beef", "calories": 450 },
            { "name": "Rice_and_Curry - Chicken", "calories": 400 },
            { "name": "Rice_and_Curry - Vegetarian", "calories": 350 },
            { "name": "Kottu_Roti", "calories": 600 },
            { "name": "Fried_Rice", "calories": 500 },
            { "name": "Kiribath", "calories": 350 },
            { "name": "Hoppers", "calories": 150 },
            { "name": "String_Hoppers", "calories": 120 },
            { "name": "Roti - Plain", "calories": 150 },
            { "name": "Roti - Pol_Roti_with_Lunu_Miris", "calories": 200 },
            { "name": "Dhal_Curry", "calories": 180 },
            { "name": "Chicken_Curry", "calories": 500 },
            { "name": "Fish_Curry", "calories": 400 },
            { "name": "Deviled_Chicken", "calories": 450 },
            { "name": "Masala_Dosa", "calories": 300 },
            { "name": "Watalappan", "calories": 250 },
            { "name": "Curd_with_Honey", "calories": 120 },
            { "name": "Vegetables - Cabbage", "calories": 25 },
            { "name": "Vegetables - Carrot", "calories": 40 },
            { "name": "Vegetables - Pumpkin", "calories": 40 },
            { "name": "Vegetables - Brinjal", "calories": 25 },
            { "name": "Vegetables - Okra", "calories": 35 },
            { "name": "Vegetables - Beetroot", "calories": 45 },
            { "name": "Vegetables - Spinach", "calories": 23 },
            { "name": "Vegetables - Malabar_Spinach", "calories": 25 },
            { "name": "Snacks - Samosa", "calories": 150 },
            { "name": "Snacks - Vada", "calories": 250 },
            { "name": "Snacks - Cutlets", "calories": 300 },
            { "name": "Snacks - Prawn_Crackers", "calories": 220 },
            { "name": "Snacks - Fish_Bun", "calories": 180 },
            { "name": "Snacks - Onion_Rings", "calories": 200 },
            { "name": "Snacks - French_Fries", "calories": 200 }
          ],
          "Western_Foods": [
            { "name": "Cheeseburger", "calories": 400 },
            { "name": "Beef_Burger", "calories": 350 },
            { "name": "Veg_Burger", "calories": 300 },
            { "name": "Chicken_Burger", "calories": 350 },
            { "name": "Grilled_Cheese_Sandwich", "calories": 350 },
            { "name": "Hot_Dog", "calories": 250 },
            { "name": "Spaghetti_Bolognese", "calories": 600 },
            { "name": "Mac_and_Cheese", "calories": 500 },
            { "name": "Pizza - Margherita", "calories": 250 },
            { "name": "Pizza - Pepperoni", "calories": 300 },
            { "name": "Fried_Chicken", "calories": 450 },
            { "name": "Fried_Fish", "calories": 400 },
            { "name": "Mozzarella_Sticks", "calories": 250 },
            { "name": "Onion_Rings", "calories": 200 },
            { "name": "French_Fries", "calories": 200 }
          ],
          "Fruits": [
            { "name": "Mango", "calories": 150 },
            { "name": "Banana", "calories": 100 },
            { "name": "Papaya", "calories": 50 },
            { "name": "Pineapple", "calories": 80 },
            { "name": "Guava", "calories": 40 },
            { "name": "Passion_Fruit", "calories": 60 },
            { "name": "Orange", "calories": 60 },
            { "name": "Avocado", "calories": 160 },
            { "name": "Jackfruit", "calories": 155 },
            { "name": "Lychee", "calories": 70 },
            { "name": "Rambutan", "calories": 68 },
            { "name": "Watermelon", "calories": 80 },
            { "name": "Pomegranate", "calories": 100 },
            { "name": "Dates", "calories": 270 },
            { "name": "Sapodilla", "calories": 120 }
          ],
          "Beverages": [
            { "name": "Black_Tea", "calories": 4 },
            { "name": "Milk_Tea", "calories": 150 },
            { "name": "Lemon_Tea", "calories": 80 },
            { "name": "Iced_Tea", "calories": 50 },
            { "name": "Green_Tea", "calories": 2 },
            { "name": "Herbal_Tea", "calories": 0 },
            { "name": "Black_Coffee", "calories": 5 },
            { "name": "Cappuccino", "calories": 150 },
            { "name": "Latte", "calories": 100 },
            { "name": "Mocha", "calories": 200 },
            { "name": "Espresso", "calories": 5 },
            { "name": "Fruit_Juice - Orange", "calories": 120 },
            { "name": "Fruit_Juice - Apple", "calories": 130 },
            { "name": "Fruit_Juice - Pineapple", "calories": 90 },
            { "name": "Fresh_Coconut_Water", "calories": 45 },
            { "name": "Lemonade", "calories": 100 },
            { "name": "Coca_Cola", "calories": 150 },
            { "name": "Pepsi", "calories": 150 },
            { "name": "Chocolate_Milkshake", "calories": 400 },
            { "name": "Vanilla_Milkshake", "calories": 350 },
            { "name": "Iced_Coffee", "calories": 120 },
            { "name": "Hot_Chocolate", "calories": 250 }
          ],
          "Chocolates": [
            { "name": "Milk_Chocolate", "calories": 200 },
            { "name": "Dark_Chocolate", "calories": 150 },
            { "name": "White_Chocolate", "calories": 220 },
            { "name": "Chocolate_Truffles", "calories": 250 },
            { "name": "Chocolate_Brownie", "calories": 300 },
            { "name": "Chocolate_Mousse", "calories": 300 },
            { "name": "Chocolate_Pudding", "calories": 250 },
            { "name": "Curd_with_Chocolate_Sauce", "calories": 180 },
            { "name": "Milk_Toffee", "calories": 120 }
          ],
          "Desserts": [
            { "name": "Vanilla_Ice_Cream", "calories": 200 },
            { "name": "Chocolate_Ice_Cream", "calories": 250 },
            { "name": "Cheesecake", "calories": 400 },
            { "name": "Brownies", "calories": 300 },
            { "name": "Apple_Pie", "calories": 300 },
            { "name": "Cupcake", "calories": 250 },
            { "name": "Fruit_Salad", "calories": 150 },
            { "name": "Lemon_Cake", "calories": 350 },
            { "name": "Rice_Pudding", "calories": 250 },
            { "name": "Pudding", "calories": 250 },
            { "name": "Churros", "calories": 300 }
          ]
        };

        setMealData(response);
        setCategories(Object.keys(response));
      } catch (error) {
        console.error("Error fetching meal data:", error);
      }
    };

    fetchMealData();
  }, []);

  // Handle category selection
  const handleCategoryChange = (itemValue) => {
    setSelectedCategory(itemValue);
    setSelectedMeal('');
  };

  // Handle meal time selection
  const handleMealTimeChange = (itemValue) => {
    setSelectedMealTime(itemValue);
  };

  // Handle meal selection
  const handleMealChange = (itemValue) => {
    setSelectedMeal(itemValue);
  };

  // Handle quantity change
  const handleQuantityChange = (text) => {
    setQuantity(text);
  };

  // Add meal to the selected meals
  const addMeal = () => {
    if (!selectedMeal || !selectedMealTime) return;

    let mealCalories = 0;
    for (const category of Object.keys(mealData)) {
      const foundMeal = mealData[category]?.find(item => item.name === selectedMeal);
      if (foundMeal) {
        mealCalories = foundMeal.calories;
        break;
      }
    }

    const newMeal = {
      meal: selectedMeal,
      quantity: parseInt(quantity),
      calories: mealCalories
    };

    setSelectedMeals(prev => ({
      ...prev,
      [selectedMealTime]: [...prev[selectedMealTime], newMeal]
    }));

    setSelectedMeal('');
    setQuantity(100);
  };

  // Calculate total calories
  const calculateCalories = () => {
    let total = 0;
    const allMeals = [
      ...selectedMeals.breakfast,
      ...selectedMeals.lunch,
      ...selectedMeals.dinner,
      ...selectedMeals.snacks
    ];

    allMeals.forEach(({ calories, quantity }) => {
      total += (calories / 100) * quantity;
    });

    setTotalCalories(total);
  };

  // Format meal name for display (replace underscores with spaces)
  const formatMealName = (name) => {
    return name.replace(/_/g, ' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Calorie Calculator</Text>

        {/* Meal Selection Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Meal Category</Text>
          {categories.length > 0 && (
            <Picker
              selectedValue={selectedCategory}
              onValueChange={handleCategoryChange}
              style={styles.picker}
            >
              <Picker.Item label="Select Meal Category" value="" />
              {categories.map((category) => (
                <Picker.Item key={category} label={formatMealName(category)} value={category} />
              ))}
            </Picker>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Meal Time</Text>
          <Picker
            selectedValue={selectedMealTime}
            onValueChange={handleMealTimeChange}
            style={styles.picker}
          >
            <Picker.Item label="Select Meal Time" value="" />
            <Picker.Item label="Breakfast" value="breakfast" />
            <Picker.Item label="Lunch" value="lunch" />
            <Picker.Item label="Dinner" value="dinner" />
            <Picker.Item label="Snacks" value="snacks" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Select a Meal</Text>
          {selectedCategory && mealData[selectedCategory]?.length > 0 && (
            <Picker
              selectedValue={selectedMeal}
              onValueChange={handleMealChange}
              style={styles.picker}
              enabled={!!selectedCategory}
            >
              <Picker.Item label="Select a meal" value="" />
              {mealData[selectedCategory].map((item) => (
                <Picker.Item 
                  key={item.name} 
                  label={`${formatMealName(item.name)} (${item.calories} cal/100g)`} 
                  value={item.name} 
                />
              ))}
            </Picker>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantity (grams)</Text>
          <TextInput
            style={styles.input}
            value={String(quantity)}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={styles.addButton} 
          onPress={addMeal}
          disabled={!selectedMeal || !selectedMealTime}
        >
          <Text style={styles.buttonText}>Add Meal</Text>
        </TouchableOpacity>

        {/* Display selected meals */}
        <View style={styles.selectedMealsContainer}>
          <Text style={styles.selectedMealsTitle}>Selected Meals:</Text>
          {Object.keys(selectedMeals).map((mealTime) =>
            selectedMeals[mealTime].length > 0 && (
              <View key={mealTime}>
                <Text style={styles.mealTimeTitle}>
                  {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                </Text>
                {selectedMeals[mealTime].map((meal, index) => (
                  <View key={index} style={styles.mealItem}>
                    <Text style={styles.mealText}>
                      {formatMealName(meal.meal)} - {meal.quantity}g 
                      ({((meal.calories / 100) * meal.quantity).toFixed(1)} cal)
                    </Text>
                  </View>
                ))}
              </View>
            )
          )}
        </View>

        {/* Calculate total calories */}
        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={calculateCalories}
        >
          <Text style={styles.buttonText}>Calculate Total Day Calories</Text>
        </TouchableOpacity>

        {/* Display total calories */}
        <Text style={styles.totalCaloriesText}>Total Calories: {totalCalories.toFixed(1)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    padding: 20,
  },
  content: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,  // Add margin for spacing between Picker components
    paddingLeft: 10,  // Add padding for better visibility
  },
  input: {
    height: 50,
    paddingLeft: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,  // Add margin for spacing between Input components
  },
  formGroup: {
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  calculateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  selectedMealsContainer: {
    marginBottom: 20,
  },
  selectedMealsTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  mealTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  mealItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  mealText: {
    fontSize: 14,
    color: '#333',
  },
  totalCaloriesText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
});