// Function to get query parameters from the URL a
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch and display cryptocurrency details
function fetchCryptoDetails() {
    const cryptoId = getQueryParam('crypto'); // Get the 'crypto' parameter from the URL

    if (cryptoId) {
        const apiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                displayCryptoDetails(data);
                fetchCryptoHistory(cryptoId, 365); // Default to 1 year for price chart
            })
            .catch(error => {
                console.error("Error fetching cryptocurrency details:", error);
                document.getElementById("crypto-details").innerHTML = "Failed to load cryptocurrency details.";
            });
    } else {
        document.getElementById("crypto-details").innerHTML = "No cryptocurrency selected.";
    }
}

// Function to display cryptocurrency details
function displayCryptoDetails(data) {
    const detailsContainer = document.getElementById("crypto-details");
    detailsContainer.innerHTML = `
        <h2>${data.name} (${data.symbol.toUpperCase()})</h2>
        <p><strong>Current Price:</strong> $${data.market_data.current_price.usd}</p>
        <p><strong>Market Cap:</strong> $${data.market_data.market_cap.usd}</p>
        <p><strong>24h High:</strong> $${data.market_data.high_24h.usd}</p>
        <p><strong>24h Low:</strong> $${data.market_data.low_24h.usd}</p>
        <p><strong>Rank:</strong> ${data.market_cap_rank}</p>
        <p><strong>Description:</strong> ${data.description.en ? data.description.en.split('. ')[0] : 'No description available.'}</p>
    `;
}

// Function to fetch historical price data for a selected time range
function fetchCryptoHistory(cryptoId, days) {
    const historyApiUrl = `https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${days}`;

    fetch(historyApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.prices.length === 0) {
                alert("The selected cryptocurrency does not have enough historical data for the chosen time range.");
                document.getElementById("priceChart").style.display = "none";
            } else {
                document.getElementById("priceChart").style.display = "block";
                const prices = data.prices.map(price => ({ date: new Date(price[0]), value: price[1] }));
                displayPriceChart(prices);
            }
        })
        .catch(error => {
            console.error("Error fetching historical data:", error);
            document.getElementById("priceChart").innerHTML = "Failed to load price data.";
        });
}

// Function to display the price trend chart
function displayPriceChart(prices) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    const labels = prices.map(price => price.date.toLocaleDateString());
    const data = prices.map(price => price.value);

    if (window.priceChart instanceof Chart) {
        window.priceChart.destroy();
    }

    window.priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price (USD)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    },
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// Function to update the chart data based on selected time range
function updateChartTimeRange() {
    const cryptoId = getQueryParam('crypto');
    const selectedDays = parseInt(document.getElementById('timeRange').value);
    fetchCryptoHistory(cryptoId, selectedDays);
}

// Call the function to fetch and display crypto details on page load
fetchCryptoDetails();
