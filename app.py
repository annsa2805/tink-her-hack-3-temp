from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import cloudinary
import cloudinary.uploader
import random
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# Store outfits in a list
outfit_db = []

# Route for home page
@app.route("/")
def home():
    return render_template("index.html")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@app.route('/upload', methods=['POST'])
def upload_images():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Upload to Cloudinary
    upload_result = cloudinary.uploader.upload(file)
    image_url = upload_result["secure_url"]
    

    # Save outfit data (Simple AI Model)
    outfit_db.append({
        "image_url": image_url,
        "weather": ["Sunny", "Rainy", "Cold"],  # Placeholder, should be user-tagged
        "brightness": ["Bright", "Neutral", "Dark"],  # Placeholder, should be user-tagged
        "profession": ["Student", "Working"]  # Placeholder, should be user-tagged
    })


    return jsonify({"image_url": image_url})

# Find best outfit based on preferences


@app.route('/get_best_outfit', methods=['POST'])
def get_best_outfit():
    data = request.json
    weather = data.get("weather")
    brightness = data.get("brightness")
    profession = data.get("profession")

    # Filter outfits based on user preferences
    matching_outfits = [
        outfit for outfit in outfit_db
        if weather in outfit["weather"] and brightness in outfit["brightness"] and profession in outfit["profession"]
    ]

    # Return a random outfit from the filtered list
    if matching_outfits:
        random.shuffle(matching_outfits)  # Shuffle the list
        selected_outfit = random.choice(matching_outfits)  # Pick a random one
        return jsonify({"image_url": selected_outfit["image_url"]})

    return jsonify({"error": "No matching outfit found"}), 404




if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)