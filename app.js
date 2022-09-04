// API ENDPOINT : `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`

// I get all interesting elements of DOM
const form = document.querySelector("form");
const input = document.querySelector("input");
const errorMsg = document.querySelector(".error-msg");
const resultsDisplay = document.querySelector(".results-display");
const loader = document.querySelector(".loader");

// Put an EventListener on the form
form.addEventListener("submit", handleSubmit);

function handleSubmit(e) {
  e.preventDefault();
    // Here if the value of input is empty display this error message
  if (input.value === "") {
    errorMsg.textContent = "Wops, veuillez remplir l'input";
    return;
  } else {
    // Else display the loader and call a new function to call API
    errorMsg.textContent = "";
    loader.style.display = "flex";
    resultsDisplay.textContent = "";
    // input.value is the value of the input enter by the user
    wikiApiCall(input.value);
  }
}
// the searchInput argument is the value of input 
async function wikiApiCall(searchInput) {
    // Try to do a request on this adress with the data value input
  try {
    const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srlimit=20&srsearch=${searchInput}`);
    console.log(response);
    // If the response is false display the status send
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const data = await response.json();

    // We give the data of API in the function createCards
    createCards(data.query.search);
  } catch (error) {
    errorMsg.textContent = `${error}`;
    loader.style.display = "none";
  }
}

function createCards(data) {
  if (!data.length) {
    errorMsg.textContent = "Wopsy, aucun résultat";
    loader.style.display = "none";
    return;
  }
  data.forEach(el => {
    const url = `https://en.wikipedia.org/?curid=${el.pageid}`;
    const card = document.createElement("div");
    card.className = "result-item";
    card.innerHTML = `
      <h3 class="result-title">
        <a href=${url} target="_blank">${el.title}</a>
      </h3>
      <a href=${url} class="result-link" target="_blank">${url}</a>
      <span class="result-snippet">${el.snippet}</span>
      <br>
    `;
    resultsDisplay.appendChild(card);
  });
  loader.style.display = "none";
}
