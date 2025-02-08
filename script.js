let outfits = [];

function uploadOutfit() {
    let input = document.getElementById("uploadImage");
    if (input.files.length === 0) {
        alert("Please select an image!");
        return;
    }

    let file = input.files[0];
    let reader = new FileReader();
    
    reader.onload = function (event) {
        let outfitData = {
            image: event.target.result,
            lastWorn: new Date().getTime() - (Math.random() * 7 * 24 * 60 * 60 * 1000), // Random past date
            color: document.getElementById("color").value
        };

        outfits.push(outfitData);
        alert("Outfit uploaded successfully!");
    };

    reader.readAsDataURL(file);
}

function suggestOutfit() {
    if (outfits.length === 0) {
        alert("No outfits uploaded yet!");
        return;
    }

    let weather = document.getElementById("weather").value;
    let profession = document.getElementById("profession").value;
    let colorPreference = document.getElementById("color").value;

    // Filter outfits based on color preference & sort by least worn
    let filteredOutfits = outfits
        .filter(outfit => outfit.color === colorPreference)
        .sort((a, b) => a.lastWorn - b.lastWorn);

    if (filteredOutfits.length === 0) {
        alert("No matching outfits found!");
        return;
    }

    let suggestedOutfit = filteredOutfits[0]; // Least worn outfit
    document.getElementById("suggestedOutfit").innerHTML = `<h3>Suggested Outfit:</h3>
        <img src="${suggestedOutfit.image}" alt="Suggested Outfit">`;
    
    // Update last worn date
    suggestedOutfit.lastWorn = new Date().getTime();
}