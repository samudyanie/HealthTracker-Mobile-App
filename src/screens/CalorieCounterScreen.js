import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  StatusBar,
  ImageBackground
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
  const [totalCholesterol, setTotalCholesterol] = useState(0);
  const [totalSugar, setTotalSugar] = useState(0);
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
            { "name": "Rice_and_Curry - Beef", "calories": 450, "sugar": 5, "cholesterol": 85 },
            { "name": "Rice_and_Curry - Chicken", "calories": 400, "sugar": 4, "cholesterol": 75 },
            { "name": "Rice_and_Curry - Vegetarian", "calories": 350, "sugar": 8, "cholesterol": 0 },
            { "name": "Kottu_Roti", "calories": 600, "sugar": 3, "cholesterol": 95 },
            { "name": "Fried_Rice", "calories": 500, "sugar": 2, "cholesterol": 65 },
            { "name": "Kiribath", "calories": 350, "sugar": 1, "cholesterol": 15 },
            { "name": "Hoppers", "calories": 150, "sugar": 1, "cholesterol": 45 },
            { "name": "String_Hoppers", "calories": 120, "sugar": 0.5, "cholesterol": 0 },
            { "name": "Roti - Plain", "calories": 150, "sugar": 1, "cholesterol": 0 },
            { "name": "Roti - Pol_Roti_with_Lunu_Miris", "calories": 200, "sugar": 2, "cholesterol": 0 },
            { "name": "Dhal_Curry", "calories": 180, "sugar": 3, "cholesterol": 0 },
            { "name": "Chicken_Curry", "calories": 500, "sugar": 5, "cholesterol": 120 },
            { "name": "Fish_Curry", "calories": 400, "sugar": 4, "cholesterol": 80 },
            { "name": "Deviled_Chicken", "calories": 450, "sugar": 8, "cholesterol": 110 },
            { "name": "Masala_Dosa", "calories": 300, "sugar": 2, "cholesterol": 25 },
            { "name": "Watalappan", "calories": 250, "sugar": 20, "cholesterol": 120 },
            { "name": "Curd_with_Honey", "calories": 120, "sugar": 15, "cholesterol": 25 },
            { "name": "Vegetables - Cabbage", "calories": 25, "sugar": 6, "cholesterol": 0 },
            { "name": "Vegetables - Carrot", "calories": 40, "sugar": 9, "cholesterol": 0 },
            { "name": "Vegetables - Pumpkin", "calories": 40, "sugar": 7, "cholesterol": 0 },
            { "name": "Vegetables - Brinjal", "calories": 25, "sugar": 4, "cholesterol": 0 },
            { "name": "Vegetables - Okra", "calories": 35, "sugar": 1.5, "cholesterol": 0 },
            { "name": "Vegetables - Beetroot", "calories": 45, "sugar": 10, "cholesterol": 0 },
            { "name": "Vegetables - Spinach", "calories": 23, "sugar": 0.4, "cholesterol": 0 },
            { "name": "Vegetables - Malabar_Spinach", "calories": 25, "sugar": 0.5, "cholesterol": 0 },
            { "name": "Snacks - Samosa", "calories": 150, "sugar": 2, "cholesterol": 15 },
            { "name": "Snacks - Vada", "calories": 250, "sugar": 1, "cholesterol": 0 },
            { "name": "Snacks - Cutlets", "calories": 300, "sugar": 3, "cholesterol": 45 },
            { "name": "Snacks - Prawn_Crackers", "calories": 220, "sugar": 2, "cholesterol": 25 },
            { "name": "Snacks - Fish_Bun", "calories": 180, "sugar": 4, "cholesterol": 35 },
            { "name": "Snacks - Onion_Rings", "calories": 200, "sugar": 3, "cholesterol": 0 },
            { "name": "Snacks - French_Fries", "calories": 200, "sugar": 0.3, "cholesterol": 0 }
          ],
          "Western_Foods": [
            { "name": "Cheeseburger", "calories": 400, "sugar": 5, "cholesterol": 95 },
            { "name": "Beef_Burger", "calories": 350, "sugar": 4, "cholesterol": 85 },
            { "name": "Veg_Burger", "calories": 300, "sugar": 6, "cholesterol": 15 },
            { "name": "Chicken_Burger", "calories": 350, "sugar": 4, "cholesterol": 75 },
            { "name": "Grilled_Cheese_Sandwich", "calories": 350, "sugar": 3, "cholesterol": 45 },
            { "name": "Hot_Dog", "calories": 250, "sugar": 2, "cholesterol": 55 },
            { "name": "Spaghetti_Bolognese", "calories": 600, "sugar": 8, "cholesterol": 65 },
            { "name": "Mac_and_Cheese", "calories": 500, "sugar": 4, "cholesterol": 85 },
            { "name": "Pizza - Margherita", "calories": 250, "sugar": 4, "cholesterol": 35 },
            { "name": "Pizza - Pepperoni", "calories": 300, "sugar": 4, "cholesterol": 45 },
            { "name": "Fried_Chicken", "calories": 450, "sugar": 1, "cholesterol": 135 },
            { "name": "Fried_Fish", "calories": 400, "sugar": 0.5, "cholesterol": 90 },
            { "name": "Mozzarella_Sticks", "calories": 250, "sugar": 2, "cholesterol": 55 },
            { "name": "Onion_Rings", "calories": 200, "sugar": 3, "cholesterol": 0 },
            { "name": "French_Fries", "calories": 200, "sugar": 0.3, "cholesterol": 0 }
          ],
          "Fruits": [
            { "name": "Mango", "calories": 150, "sugar": 32, "cholesterol": 0 },
            { "name": "Banana", "calories": 100, "sugar": 22, "cholesterol": 0 },
            { "name": "Papaya", "calories": 50, "sugar": 11, "cholesterol": 0 },
            { "name": "Pineapple", "calories": 80, "sugar": 18, "cholesterol": 0 },
            { "name": "Guava", "calories": 40, "sugar": 9, "cholesterol": 0 },
            { "name": "Passion_Fruit", "calories": 60, "sugar": 11, "cholesterol": 0 },
            { "name": "Orange", "calories": 60, "sugar": 14, "cholesterol": 0 },
            { "name": "Avocado", "calories": 160, "sugar": 1, "cholesterol": 0 },
            { "name": "Jackfruit", "calories": 155, "sugar": 38, "cholesterol": 0 },
            { "name": "Lychee", "calories": 70, "sugar": 17, "cholesterol": 0 },
            { "name": "Rambutan", "calories": 68, "sugar": 16, "cholesterol": 0 },
            { "name": "Watermelon", "calories": 80, "sugar": 18, "cholesterol": 0 },
            { "name": "Pomegranate", "calories": 100, "sugar": 21, "cholesterol": 0 },
            { "name": "Dates", "calories": 270, "sugar": 63, "cholesterol": 0 },
            { "name": "Sapodilla", "calories": 120, "sugar": 28, "cholesterol": 0 }
          ],
          "Beverages": [
            { "name": "Black_Tea", "calories": 4, "sugar": 0, "cholesterol": 0 },
            { "name": "Milk_Tea", "calories": 150, "sugar": 12, "cholesterol": 15 },
            { "name": "Lemon_Tea", "calories": 80, "sugar": 18, "cholesterol": 0 },
            { "name": "Iced_Tea", "calories": 50, "sugar": 12, "cholesterol": 0 },
            { "name": "Green_Tea", "calories": 2, "sugar": 0, "cholesterol": 0 },
            { "name": "Herbal_Tea", "calories": 0, "sugar": 0, "cholesterol": 0 },
            { "name": "Black_Coffee", "calories": 5, "sugar": 0, "cholesterol": 0 },
            { "name": "Cappuccino", "calories": 150, "sugar": 8, "cholesterol": 25 },
            { "name": "Latte", "calories": 100, "sugar": 6, "cholesterol": 20 },
            { "name": "Mocha", "calories": 200, "sugar": 15, "cholesterol": 30 },
            { "name": "Espresso", "calories": 5, "sugar": 0, "cholesterol": 0 },
            { "name": "Fruit_Juice - Orange", "calories": 120, "sugar": 26, "cholesterol": 0 },
            { "name": "Fruit_Juice - Apple", "calories": 130, "sugar": 28, "cholesterol": 0 },
            { "name": "Fruit_Juice - Pineapple", "calories": 90, "sugar": 20, "cholesterol": 0 },
            { "name": "Fresh_Coconut_Water", "calories": 45, "sugar": 9, "cholesterol": 0 },
            { "name": "Lemonade", "calories": 100, "sugar": 25, "cholesterol": 0 },
            { "name": "Coca_Cola", "calories": 150, "sugar": 35, "cholesterol": 0 },
            { "name": "Pepsi", "calories": 150, "sugar": 35, "cholesterol": 0 },
            { "name": "Chocolate_Milkshake", "calories": 400, "sugar": 45, "cholesterol": 65 },
            { "name": "Vanilla_Milkshake", "calories": 350, "sugar": 38, "cholesterol": 55 },
            { "name": "Iced_Coffee", "calories": 120, "sugar": 15, "cholesterol": 10 },
            { "name": "Hot_Chocolate", "calories": 250, "sugar": 30, "cholesterol": 25 }
          ],
          "Chocolates": [
            { "name": "Milk_Chocolate", "calories": 200, "sugar": 24, "cholesterol": 25 },
            { "name": "Dark_Chocolate", "calories": 150, "sugar": 15, "cholesterol": 5 },
            { "name": "White_Chocolate", "calories": 220, "sugar": 28, "cholesterol": 30 },
            { "name": "Chocolate_Truffles", "calories": 250, "sugar": 22, "cholesterol": 45 },
            { "name": "Chocolate_Brownie", "calories": 300, "sugar": 35, "cholesterol": 85 },
            { "name": "Chocolate_Mousse", "calories": 300, "sugar": 28, "cholesterol": 120 },
            { "name": "Chocolate_Pudding", "calories": 250, "sugar": 25, "cholesterol": 65 },
            { "name": "Curd_with_Chocolate_Sauce", "calories": 180, "sugar": 20, "cholesterol": 35 },
            { "name": "Milk_Toffee", "calories": 120, "sugar": 18, "cholesterol": 15 }
          ],
          "Desserts": [
            { "name": "Vanilla_Ice_Cream", "calories": 200, "sugar": 22, "cholesterol": 65 },
            { "name": "Chocolate_Ice_Cream", "calories": 250, "sugar": 26, "cholesterol": 70 },
            { "name": "Cheesecake", "calories": 400, "sugar": 32, "cholesterol": 165 },
            { "name": "Brownies", "calories": 300, "sugar": 30, "cholesterol": 75 },
            { "name": "Apple_Pie", "calories": 300, "sugar": 25, "cholesterol": 45 },
            { "name": "Cupcake", "calories": 250, "sugar": 28, "cholesterol": 55 },
            { "name": "Fruit_Salad", "calories": 150, "sugar": 30, "cholesterol": 0 },
            { "name": "Lemon_Cake", "calories": 350, "sugar": 35, "cholesterol": 85 },
            { "name": "Rice_Pudding", "calories": 250, "sugar": 20, "cholesterol": 45 },
            { "name": "Pudding", "calories": 250, "sugar": 22, "cholesterol": 50 },
            { "name": "Churros", "calories": 300, "sugar": 15, "cholesterol": 25 }
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

    // Find meal nutritional data
    let mealInfo = null;
    for (const category of Object.keys(mealData)) {
      const foundMeal = mealData[category]?.find(item => item.name === selectedMeal);
      if (foundMeal) {
        mealInfo = foundMeal;
        break;
      }
    }
    if (!mealInfo) return;

    const newMeal = {
      meal: selectedMeal,
      quantity: parseInt(quantity),
      calories: mealInfo.calories,
      cholesterol: mealInfo.cholesterol,
      sugar: mealInfo.sugar
    };

    setSelectedMeals(prev => ({
      ...prev,
      [selectedMealTime]: [...prev[selectedMealTime], newMeal]
    }));

    setSelectedMeal('');
    setQuantity(100);
  };

  // Remove meal from list
  const removeMeal = (mealTime, index) => {
    setSelectedMeals(prev => {
      const updated = { ...prev };
      updated[mealTime] = updated[mealTime].filter((_, i) => i !== index);
      return updated;
    });
  };

  // Calculate total nutritional values
  const calculateTotals = () => {
    let totalCal = 0;
    let totalChol = 0;
    let totalSug = 0;
    const allMeals = [
      ...selectedMeals.breakfast,
      ...selectedMeals.lunch,
      ...selectedMeals.dinner,
      ...selectedMeals.snacks
    ];
    allMeals.forEach(({ calories, cholesterol, sugar, quantity }) => {
      totalCal += (calories / 100) * quantity;
      totalChol += (cholesterol / 100) * quantity;
      totalSug += (sugar / 100) * quantity;
    });
    setTotalCalories(totalCal);
    setTotalCholesterol(totalChol);
    setTotalSugar(totalSug);
  };

  // Format meal name for display
  const formatMealName = (name) => {
    return name.replace(/_/g, ' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <ImageBackground 
        source={require('../assets/calorie.png')} // Add your background image
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Calculator Card */}
          <View style={styles.calculatorCard}>
            <Text style={styles.title}>Nutrition Calculator</Text>
            <Text style={styles.subtitle}>
              Track Calories, Sugar & Cholesterol - {new Date().toLocaleDateString()}
            </Text>

            {/* Form Grid */}
            <View style={styles.formGrid}>
              {/* Left Column */}
              <View style={styles.formColumn}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Select Meal Category</Text>
                  <View style={styles.pickerContainer}>
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
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Select Meal Time</Text>
                  <View style={styles.pickerContainer}>
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
                </View>
              </View>

              {/* Right Column */}
              <View style={styles.formColumn}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Select a meal</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedMeal}
                      onValueChange={handleMealChange}
                      style={styles.picker}
                      enabled={!!selectedCategory}
                    >
                      <Picker.Item label="Select a meal" value="" />
  {selectedCategory && mealData[selectedCategory]?.map((item) => (
    <Picker.Item 
      key={item.name} 
      label={formatMealName(item.name)}   // ← only show the name
      value={item.name} 
    />
  ))}
</Picker>
                  </View>
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
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.addButton, (!selectedMeal || !selectedMealTime) && styles.disabledButton]} 
              onPress={addMeal}
              disabled={!selectedMeal || !selectedMealTime}
            >
              <Text style={styles.buttonText}>Add Meal</Text>
            </TouchableOpacity>

            {/* Selected Meals Display */}
            <View style={styles.selectedMealsContainer}>
              <Text style={styles.selectedMealsTitle}>Selected Meals:</Text>
              
              {Object.keys(selectedMeals).map((mealTime) =>
                selectedMeals[mealTime].length > 0 && (
                  <View key={mealTime} style={styles.mealTimeSection}>
                    <Text style={styles.mealTimeTitle}>
                      {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                    </Text>
                    {selectedMeals[mealTime].map((meal, index) => (
                      <View key={index} style={styles.mealItem}>
                        <View style={styles.mealInfo}>
                          <Text style={styles.mealName}>
                            {formatMealName(meal.meal)} - {meal.quantity}g
                          </Text>
                          <View style={styles.nutritionTags}>
                            <View style={styles.calorieTag}>
                              <Text style={styles.tagText}>
                                {((meal.calories / 100) * meal.quantity).toFixed(1)} cal
                              </Text>
                            </View>
                            <View style={styles.sugarTag}>
                              <Text style={styles.tagText}>
                                {((meal.sugar / 100) * meal.quantity).toFixed(1)}g sugar
                              </Text>
                            </View>
                            <View style={styles.cholesterolTag}>
                              <Text style={styles.tagText}>
                                {((meal.cholesterol / 100) * meal.quantity).toFixed(1)}mg chol
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity 
                          style={styles.removeButton}
                          onPress={() => removeMeal(mealTime, index)}
                        >
                          <Text style={styles.removeButtonText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )
              )}
            </View>

            {/* Calculate Button */}
            <TouchableOpacity 
              style={styles.calculateButton} 
              onPress={calculateTotals}
            >
              <Text style={styles.buttonText}>Calculate Total Daily Nutrition</Text>
            </TouchableOpacity>

            {/* Totals Display */}
            <View style={styles.totalsGrid}>
              <View style={styles.calorieTotal}>
                <Text style={styles.totalLabel}>Total Calories</Text>
                <Text style={styles.totalValue}>{totalCalories.toFixed(1)}</Text>
                <Text style={styles.totalUnit}>kcal</Text>
              </View>
              
              <View style={styles.sugarTotal}>
                <Text style={styles.totalLabel}>Total Sugar</Text>
                <Text style={styles.totalValue}>{totalSugar.toFixed(1)}</Text>
                <Text style={styles.totalUnit}>grams</Text>
              </View>
              
              <View style={styles.cholesterolTotal}>
                <Text style={styles.totalLabel}>Total Cholesterol</Text>
                <Text style={styles.totalValue}>{totalCholesterol.toFixed(1)}</Text>
                <Text style={styles.totalUnit}>milligrams</Text>
              </View>
            </View>

           {/* Daily Value Progress */}
<View style={styles.progressSection}>
  <Text style={styles.progressTitle}>Daily Value Progress</Text>
  
  {/* Calories Progress */}
  <View style={styles.progressItem}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>Calories</Text>
      <Text style={styles.progressPercent}>
        {Math.round((totalCalories / 2000) * 100)}% of 2000 kcal
      </Text>
    </View>
    <View style={styles.progressBarContainer}>
      <View 
        style={[
          styles.progressBar, 
          styles.calorieProgress,
          { width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }
        ]} 
      />
    </View>
    {totalCalories >= 2000 && (
      <Text style={styles.warningText}>
        ⚠️ Danger! You’ve hit your calorie limit. Overeating increases risk of obesity and heart disease!
      </Text>
    )}
  </View>

  {/* Sugar Progress */}
  <View style={styles.progressItem}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>Sugar</Text>
      <Text style={styles.progressPercent}>
        {Math.round((totalSugar / 50) * 100)}% of 50g limit
      </Text>
    </View>
    <View style={styles.progressBarContainer}>
      <View 
        style={[
          styles.progressBar, 
          styles.sugarProgress,
          { width: `${Math.min((totalSugar / 50) * 100, 100)}%` }
        ]} 
      />
    </View>
    {totalSugar >= 50 && (
      <Text style={styles.warningText}>
        ⚠️ Warning! Too much sugar can lead to diabetes, liver damage, and heart problems!
      </Text>
    )}
  </View>

  {/* Cholesterol Progress */}
  <View style={styles.progressItem}>
    <View style={styles.progressHeader}>
      <Text style={styles.progressLabel}>Cholesterol</Text>
      <Text style={styles.progressPercent}>
        {Math.round((totalCholesterol / 300) * 100)}% of 300mg limit
      </Text>
    </View>
    <View style={styles.progressBarContainer}>
      <View 
        style={[
          styles.progressBar, 
          styles.cholesterolProgress,
          { width: `${Math.min((totalCholesterol / 300) * 100, 100)}%` }
        ]} 
      />
    </View>
    {totalCholesterol >= 300 && (
      <Text style={styles.warningText}>
        ⚠️ Alert! High cholesterol clogs arteries and raises risk of heart attack or stroke!
      </Text>
    )}
  </View>
</View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  backgroundImage: {
    flex: 1,
  },
  imageStyle: {
    opacity: 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },
  calculatorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 24,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0d7377',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  formGrid: {
    marginBottom: 24,
  },
  formColumn: {
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    height: 60,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#14b8a6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  warningText: {
  color: 'red',
  fontWeight: 'bold',
  marginTop: 6,
  fontSize: 14,
  textAlign: 'center',
},
  calculateButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedMealsContainer: {
    marginBottom: 24,
  },
  selectedMealsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  mealTimeSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  mealTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d7377',
    marginBottom: 12,
    textTransform: 'capitalize',
  },
  mealItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  nutritionTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  calorieTag: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sugarTag: {
    backgroundColor: '#fffbeb',
    borderColor: '#fed7aa',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cholesterolTag: {
    backgroundColor: '#faf5ff',
    borderColor: '#ddd6fe',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 12,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  totalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 8,
  },
  calorieTotal: {
    flex: 1,
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  sugarTotal: {
    flex: 1,
    backgroundColor: '#fffbeb',
    borderColor: '#fed7aa',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  cholesterolTotal: {
    flex: 1,
    backgroundColor: '#faf5ff',
    borderColor: '#ddd6fe',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  totalUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressSection: {
    marginTop: 32,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressPercent: {
    fontSize: 14,
    color: '#6b7280',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  calorieProgress: {
    backgroundColor: '#ef4444',
  },
  sugarProgress: {
    backgroundColor: '#eab308',
  },
  cholesterolProgress: {
    backgroundColor: '#8b5cf6',
  },
});