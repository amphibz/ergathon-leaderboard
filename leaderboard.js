async function fetchData() {
    const sheetId = '1u89p77VcMmxkEvmGsgEccq5nyOcyiw0Ux117v4537-I'; // Replace with your actual Sheet ID
    const apiKey = SHEETS_API_KEY;   // Replace with your actual API Key
    const range = 'Form Responses 1!A:Z';      // Adjust range as needed

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`);
        const data = await response.json();
        const rows = data.values;

        if (rows.length) {
            const header = rows[0];
            const teamIndex = header.indexOf('Team or Individual Donor is Sponsoring');
            const donationIndex = header.indexOf('Enter the dollar amount of your donation'); // Assuming there's a column for this

            // Initialize or reset the teamDonations object
            const teamDonations = {};

            // Iterate through rows to aggregate donations by team
            for (let i = 1; i < rows.length; i++) {
                const teamName = rows[i][teamIndex];
                const donationAmount = parseFloat(rows[i][donationIndex]) || 0;

                if (teamName && teamName !== "General") {
                    // If the team is already in the object, add to their donation total; otherwise, initialize it
                    if (!teamDonations[teamName]) {
                        teamDonations[teamName] = 0;
                    }
                    teamDonations[teamName] += donationAmount;
                }
            }

            // Convert the object to an array and sort by donation amount
            const sortedTeams = Object.entries(teamDonations).sort((a, b) => b[1] - a[1]);

            // Display in the table
            const leaderboard = document.getElementById('leaderboard');
            leaderboard.innerHTML = sortedTeams.map((entry, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${entry[0]}</td>
                    <td>${entry[1]}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Fetch the data on page load
fetchData();
