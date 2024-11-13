// Function to show the selected chart and hide others a
function showChart(chartId) {
    const allChartContainers = [
        'priceChangeChartContainer',
        'topMarketCapChartContainer',
        'volumeTrendsChartContainer'
    ];

    // Hide all chart containers
    allChartContainers.forEach(containerId => {
        document.getElementById(containerId).style.display = 'none';
    });

    // Show the selected chart container
    document.getElementById(chartId + 'Container').style.display = 'block';

    // Load data for the selected chart if it’s not already loaded
    if (chartId === 'priceChangeChart') {
        fetchTopCryptosPriceChange(10);
    } else if (chartId === 'topMarketCapChart') {
        fetchTopMarketCapCryptos();
    } else if (chartId === 'volumeTrendsChart') {
        fetchVolumeTrends();
    }
}

// Fetch and display the 24-hour price change distribution chart
function fetchTopCryptosPriceChange(count) {
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${count}&page=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const gainers = data.filter(crypto => crypto.price_change_percentage_24h > 0).length;
            const losers = data.filter(crypto => crypto.price_change_percentage_24h < 0).length;
            const noChange = data.length - gainers - losers;
            displayPriceChangeChart(gainers, losers, noChange);
        })
        .catch(error => {
            console.error("Error fetching 24-hour price change data:", error);
        });
}

// Display the 24-hour price change distribution chart
function displayPriceChangeChart(gainers, losers, noChange) {
    console.log("Displaying Price Change Chart"); // Debugging line
    const ctx = document.getElementById('priceChangeChart').getContext('2d');

    // Check if priceChangeChart exists and is a Chart instance before destroying
    if (window.priceChangeChart instanceof Chart) {
        window.priceChangeChart.destroy();
    }

    window.priceChangeChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Gainers', 'Losers', 'No Change'],
            datasets: [{
                label: '24h Price Change Distribution',
                data: [gainers, losers, noChange],
                backgroundColor: ['#28a745', '#dc3545', '#6c757d'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}


// Fetch and display the Top 10 by Market Cap chart
function fetchTopMarketCapCryptos() {
    const apiUrl = 'https://api.coinlore.net/api/tickers/?start=0&limit=10';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const labels = data.data.map(crypto => crypto.name); // Adjusted path for correct parsing
            const marketCaps = data.data.map(crypto => crypto.market_cap_usd); // Adjusted key for market cap
            console.log(marketCaps);
            displayTopMarketCapChart(labels, marketCaps);
        })
        .catch(error => {
            console.error("Error fetching top market cap data:", error);
        });
}


function displayTopMarketCapChart(labels, marketCaps) {
    const ctx = document.getElementById('topMarketCapChart').getContext('2d');

    // Check if the chart already exists before attempting to destroy it
    if (window.topMarketCapChart instanceof Chart) {
        window.topMarketCapChart.destroy();
    }

    // Example for Top Market Cap Chart
    window.topMarketCapChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Market Cap (USD)',
                data: marketCaps,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                barThickness: 40  // Adjust the thickness of bars for better visibility
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.8,  // Sets a wider aspect ratio
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Cryptocurrency',
                        font: { size: 14 }
                    },
                    ticks: {
                        font: { size: 12 },
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Market Cap (USD)',
                        font: { size: 14 }
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + (value / 1e9).toFixed(1) + 'B';
                        },
                        font: { size: 12 }
                    },
                    grid: {
                        color: 'rgba(200, 200, 200, 0.2)'
                    }
                }
            }
        }
    });

}

// Fetch and display Volume Trends chart
function fetchVolumeTrends() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const labels = data.map(crypto => crypto.name);
            const volumes = data.map(crypto => crypto.total_volume);
            displayVolumeTrendsChart(labels, volumes);
        })
        .catch(error => {
            console.error("Error fetching volume trends data:", error);
        });
}

function displayVolumeTrendsChart(labels, volumes) {
    const ctx = document.getElementById('volumeTrendsChart').getContext('2d');

    // Check if the chart already exists and is a valid Chart instance before attempting to destroy it
    if (window.volumeTrendsChart instanceof Chart) {
        window.volumeTrendsChart.destroy();
    }

    window.volumeTrendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '24h Trading Volume (USD)',
                data: volumes,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
                        text: 'Cryptocurrency'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Volume (USD)'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}


// Initial call to display the default chart
showChart('priceChangeChart');
