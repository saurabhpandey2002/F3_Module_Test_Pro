const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

// Fetch data using .then
function fetchDataUsingThen() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => renderTable(data))
    .catch(error => console.error('Error fetching data:', error));
}

// Fetch data using async/await
async function fetchDataUsingAsyncAwait() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    renderTable(data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Render table
function renderTable(data) {
  const tableBody = document.getElementById('cryptoTableBody');
  tableBody.innerHTML = '';

  data.forEach(coin => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${coin.name}</td>
      <td>${coin.id}</td>
      <td><img src="${coin.image}" alt="${coin.name}" width="30"></td>
      <td>${coin.symbol}</td>
      <td>${coin.current_price}</td>
      <td>${coin.total_volume}</td>
    `;

    tableBody.appendChild(row);
  });
}

// Search functionality
function searchCrypto() {
  const searchInput = document.getElementById('search').value.toLowerCase();
  fetchDataUsingAsyncAwait().then(() => {
    const tableBody = document.getElementById('cryptoTableBody');
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
      const nameCell = row.cells[0].textContent.toLowerCase();
      if (nameCell.includes(searchInput)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

// Sort functionality
function sortData(key, isNumeric = false) {
  fetchDataUsingAsyncAwait().then(() => {
    const tableBody = document.getElementById('cryptoTableBody');
    const rows = Array.from(tableBody.getElementsByTagName('tr'));

    rows.sort((a, b) => {
      const aValue = a.cells[key].textContent;
      const bValue = b.cells[key].textContent;

      if (isNumeric) {
        return parseFloat(aValue) - parseFloat(bValue);
      } else {
        return aValue.localeCompare(bValue);
      }
    });

    rows.forEach(row => tableBody.appendChild(row));
  });
}

document.getElementById('searchButton').addEventListener('click', searchCrypto);
document.getElementById('sortMarketCapButton').addEventListener('click', () => sortData(4, true));
document.getElementById('sortPercentageChangeButton').addEventListener('click', () => sortData(5, true));

// Initial fetch
fetchDataUsingThen();
