// Function to fetch and display the list of cryptocurrencies a
function fetchCryptoList() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/list';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCryptoList(data);
            window.cryptoData = data; // Store data globally for easy access in search
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("crypto-list").innerHTML = "Failed to fetch data.";
        });
}

// Function to display the list of cryptocurrencies
function displayCryptoList(cryptoData) {
    const cryptoListContainer = document.getElementById("crypto-list");
    cryptoListContainer.innerHTML = ''; // Clear any existing content

    cryptoData.forEach(crypto => {
        // Create a link for each cryptocurrency
        const cryptoLink = document.createElement("a");
        cryptoLink.href = `details.html?crypto=${crypto.id}`;
        cryptoLink.textContent = crypto.name;
        cryptoLink.style.display = "block"; // Display each link on a new line

        cryptoListContainer.appendChild(cryptoLink);
    });
}

// Function to filter cryptocurrencies based on search input
function filterCryptos() {
    const searchQuery = document.getElementById("crypto-search").value.toLowerCase();
    const filteredData = window.cryptoData.filter(crypto =>
        crypto.name.toLowerCase().includes(searchQuery) || crypto.id.toLowerCase().includes(searchQuery)
    );
    displayCryptoList(filteredData);
}

// Call the function to fetch and display the crypto list on page load
fetchCryptoList();

