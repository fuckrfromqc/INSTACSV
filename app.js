document.getElementById('instaForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const exportFollowers = document.getElementById('followers').checked;
    const exportFollowing = document.getElementById('following').checked;

    if (!exportFollowers && !exportFollowing) {
        alert("Please select at least one option (followers or following)!");
        return;
    }

    const instagramData = await getInstagramData(username);
    const followers = exportFollowers ? instagramData.followers : [];
    const following = exportFollowing ? instagramData.following : [];

    const csvContent = convertToCSV(followers, following);
    downloadCSV(csvContent, `${username}_INSTACSV.csv`);
});

async function getInstagramData(username) {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${proxyUrl}https://www.instagram.com/${username}/?__a=1`;
    const response = await axios.get(url);
    const data = response.data.graphql.user;
    const followers = data.edge_followed_by.edges.map(edge => edge.node.username);
    const following = data.edge_follow.edges.map(edge => edge.node.username);

    return { followers, following };
}


function convertToCSV(followers, following) {
    const maxRows = Math.max(followers.length, following.length);
    let csvContent = 'Followers,Following\n';

    for (let i = 0; i < maxRows; i++) {
        const follower = followers[i] ? `"${followers[i]}"` : '';
        const following = following[i] ? `"${following[i]}"` : '';
        csvContent += `${follower},${following}\n`;
    }

    return csvContent;
}

function downloadCSV(csvContent, fileName) {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
