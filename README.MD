# Food Analysis API

The Food Analysis API provides a unique way to analyze food items using either a text description or an image. By leveraging the OPEN AI GPT-4o model, this API can break down the macronutrient content of a food item, offering insights into its nutritional composition.

## Features

- **Text Analysis**: Users can submit a detailed description of a food item. The API will analyze the description and return an estimate breakdown of its macronutrients, such as proteins, carbohydrates, and fats.

- **Image Analysis**: Users have the option to upload an image of a food item. The API utilizes image recognition to identify the food item and returns an estimate macronutrient breakdown.

## Getting Started

To use the Food Analysis API, follow these steps:

1. **API Key**: Ensure you have an  Open AI API key.

2. **Make a Request**: Depending on your preference, make a request to the API endpoint with either a text description or an image of the food item.

   - For **text analysis**, send a POST request with the description in the request body.
   - For **image analysis**, send a POST request with the image file attached.

3. **Receive Response**: The API will process your request and return a JSON response with the macronutrient breakdown.

## Example Request

### Text Analysis

To analyze the food item using a food description, you can make a `curl` request as follows:

```bash
curl --location 'https://food-analyser-api.vercel.app/api/analyze-food' \
--header 'Content-Type: application/json' \
--data '{
        "description":"Creamy Garlic Skillet Chicken with Spinach is a delicious and comforting dish that combines tender chicken breasts cooked in a creamy garlic sauce with fresh spinach. Here'\''s a general overview of the ingredients and steps involved in making this dish: Ingredients: Chicken breastsOlive oil or butter Garlic cloves, minced Heavy cream or half-and-half Chicken broth Parmesan cheese, gratedFresh spinach Salt and pepperOptional: red pepper flakes, lemon juice, fresh herbs (e.g., parsley or basil)"
}'
```

## Image Analysis
Submit an image file with your request. Please note that the API only accepts image files in PNG or JPG formats.

Example curl request for image analysis:
```bash
curl --location 'https://food-analyser-api.vercel.app/api/analyze-food' \
--form 'photo=@"/Users/augustoromero/Downloads/chicken with rice.jpg"'
```

## Response Format
The API returns a JSON response containing the macronutrient breakdown:

```json
{
  "proteins": "10g",
  "carbohydrates": "35g",
  "fats": "12g",
  "calories": "298 kcal"
}
```
## Possible Improvements

While the Food Analysis API provides valuable insights into the macronutrient breakdown of food items, it is important to note that the current model may occasionally produce inaccurate results or "allucinate" when analyzing complex descriptions or images. This means that the API might generate estimated macronutrient values that may not precisely match the actual composition of the food.

To achieve a more accurate approach, one possible improvement could be to incorporate a vector database that contains the ingredients of various foods. By searching this database based on the description or image, it would be possible to obtain a more precise macronutrient breakdown.

This alternative approach would involve calculating the total macronutrient content based on the individual ingredients found in the food item. By leveraging a comprehensive database, the API could provide more accurate and reliable results, ensuring a higher level of precision in the analysis.

Implementing this improvement would require building and maintaining a robust vector database that covers a wide range of food items. Additionally, it would involve developing algorithms to efficiently search and calculate the total macronutrient content based on the identified ingredients.

By incorporating a vector database and adopting this more accurate approach, the Food Analysis API could enhance its capabilities and provide users with more reliable and precise macronutrient breakdowns.
