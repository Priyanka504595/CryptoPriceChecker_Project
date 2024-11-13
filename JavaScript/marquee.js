function fetchTopCryptosForMarquee() {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Create content with spacing between items, no separator needed
            const marqueeItems = data.map(crypto => {
                return `<span>${crypto.name}: $${crypto.current_price.toFixed(2)}</span>`;
            }).join(''); // No separator here, only items with padding

            // Duplicate the content to make it loop seamlessly a
            const marqueeContent = `<span>${marqueeItems} ${marqueeItems}</span>`;

            document.getElementById('crypto-marquee').innerHTML = marqueeContent;
        })
        .catch(error => {
            console.error("Error fetching marquee data:", error);
            document.getElementById('crypto-marquee').innerHTML = "<span>Error loading data</span>";
        });
}

// Call the function to load marquee data
fetchTopCryptosForMarquee();
