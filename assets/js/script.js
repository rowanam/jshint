const API_KEY = "CZ-8nF1YgVUYn_Fff-joUpfRRWQ";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// BUTTON EVENT LISTENERS //

// learning note: won't use passed "e" event object in this lesson, but good practice to pass it to the event handler
document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

// CHECK JSHINT API KEY STATUS //

/**
 * Check status of API key
 * @param {*} e 
 */
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

/**
 * Display expiration date of API key
 * @param {*} data 
 */
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

// CHECK JS CODE //

/**
 * Send js code to JSHint API, which returns information about any code errors
 * @param {*} e 
 */
async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

/**
 * Takes a FormData object and combines all "options" entries into one entry
 * with a value of a string of the comma-separated options
 * @param {*} form 
 * @returns form with options formatted
 */
function processOptions(form) {
    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

/**
 * Display the errors in the js code, if there are any
 * @param {*} data 
 */
function displayErrors(data) {
    // Set modal heading text
    let heading = `JSHint Results for ${data.file}`;
    document.getElementById("resultsModalTitle").innerText = heading;

    // Set modal body text with js errors, if any
    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("results-content").innerHTML = results;

    // Display modal
    resultsModal.show();
}

/**
 * Display information if an exception occurs
 * @param {*} data 
 */
function displayException(data) {
    // Set modal heading text
    let heading = `An Exception Occurred`;
    document.getElementById("resultsModalTitle").innerText = heading;

    // Set modal body text to exception and description
    let results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("results-content").innerHTML = results;

    // Display modal
    resultsModal.show();
}