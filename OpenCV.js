document.getElementById('uploadImage').addEventListener('change', handleImageUpload);

async function handleImageUpload(event) {
    let file = event.target.files[0];
    if (!file) return;

    let img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.onload = async function () {
        let mat = cv.imread(img);
        processImage(mat);
    };
}

function processImage(mat) {
    cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
    cv.imshow('suggestedOutfit', mat);
    mat.delete();
}

async function suggestOutfit() {
    let weather = document.getElementById('weather').value;
    let color = document.getElementById('color').value;
    let profession = document.getElementById('profession').value;

    let outfitSuggestion = await getOutfitRecommendation(weather, color, profession);
    document.getElementById('suggestedOutfit').innerText = outfitSuggestion;
}

async function getOutfitRecommendation(weather, color, profession) {
    // Dummy AI-based outfit suggestion logic (Replace with actual ML model)
    let model = await tf.loadLayersModel('path-to-your-model/model.json');
    let inputTensor = tf.tensor([weather, color, profession]); // Adjust based on model input format
    let prediction = model.predict(inputTensor);
    
    return prediction.dataSync()[0]; // Adjust output based on model response
}