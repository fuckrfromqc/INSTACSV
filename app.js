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
    const url = `https://www.instagram.com/${username}/?__a=1`;
    const response = await axios.get(url);
    const data = response.data.graphql.user;
    const followers = data.edge_followed_by.edges.map(edge => edge.node.username);
    const following = data.edge_follow.edges.map(edge => edge.node.username);

    return { followers, following };
}
