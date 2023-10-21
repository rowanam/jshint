const API_KEY = "CZ-8nF1YgVUYn_Fff-joUpfRRWQ";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// learning note: won't use passed "e" event object in this lesson, but good practice to pass it to the event handler
document.getElementById("status").addEventListener("click", e => getStatus(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    // Set modal heading text
    let heading = "API Key Status";
    document.getElementById("resultsModalTitle").innerText = heading;

    // Set modal body text with expiration date
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status">${data.expiry}</div>`;
    document.getElementById("results-content").innerHTML = results;

    // Display modal
    resultsModal.show();
}