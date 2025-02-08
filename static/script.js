async function uploadImages() {
    let input = document.getElementById("imageUpload");
    let files = input.files;
    let previewDiv = document.getElementById("imagePreview");
    let uploadStatus = document.getElementById("uploadStatus");

    if (files.length === 0) {
        alert("Please select at least one file to upload.");
        return;
    }

    uploadStatus.innerHTML = "Uploading...";
    previewDiv.innerHTML = ""; // Clear previous preview

    let uploadedImages = [];

    for (let file of files) {
        let formData = new FormData();
        formData.append("file", file);

        let response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        let result = await response.json();
        if (result.image_url) {
            // Show uploaded image
            let img = document.createElement("img");
            img.src = result.image_url;
            img.alt = "Uploaded Outfit";
            img.style.width = "100px"; // Adjust size
            img.style.margin = "5px";
            previewDiv.appendChild(img);
        }
    }

    uploadStatus.innerHTML = "Upload Complete!";
}

// Fetch best outfit based on preferences
async function fetchBestOutfit() {
    let weather = document.getElementById("weather").value;
    let brightness = document.getElementById("brightness").value;
    let profession = document.getElementById("profession").value;

    let response = await fetch("/get_best_outfit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ weather, brightness, profession })
    });

    let result = await response.json();
    if (result.image_url) {
        document.getElementById("suggestedOutfit").src = result.image_url;
    } else {
        alert("No matching outfit found.");
    }
}