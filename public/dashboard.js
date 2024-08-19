function hideAllSections() {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
}

function showSection(section) {
  hideAllSections();
  document.getElementById(section + 'Section').style.display = 'block';
}

function showSubsection(subsection) {
  hideAllSubsections();
  document.getElementById(subsection).style.display = 'block';
}

function hideAllSubsections() {
  const subSections = document.querySelectorAll('.sub-section');
  subSections.forEach(sec => sec.style.display = 'none');
}

hideAllSubsections();

hideAllSections();

document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
  } else {
    fetch('/api/dashboard', {
      method: 'GET',
      headers: { 'x-auth-token': token }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Dashboard data:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while fetching dashboard data');
      });
  }

  const itemsList = document.getElementById('itemsList');
  const addItemForm = document.getElementById('addItemForm');
  const partnersList = document.getElementById('partnersList');
  const addPartnerForm = document.getElementById('addPartnerForm');

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items', {
        headers: { 'x-auth-token': token }
      });
      const items = await response.json();
      itemsList.innerHTML = '';
      items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.unit} - ${item.quantity} - ${item.price} BGN`;
        itemsList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await fetch('/api/partners', {
        headers: { 'x-auth-token': token }
      });
      const partners = await response.json();
      partnersList.innerHTML = '';
      partners.forEach((partner) => {
        const li = document.createElement('li');
        li.textContent = `${partner.name} - ${partner.bulstat} - ${partner.address} - ${partner.phoneNumber} - ${partner.email}`;
        partnersList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const unit = document.getElementById('itemUnit').value;
    const quantity = document.getElementById('itemQuantity').value;
    const price = document.getElementById('price').value;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name, unit, quantity, price })
      });
      const newItem = await response.json();
      if (response.ok) {
        const li = document.createElement('li');
        li.textContent = `${newItem.name} - ${newItem.unit} - ${newItem.quantity} - ${newItem.price} BGN`;
        itemsList.appendChild(li);
        addItemForm.reset();
        fetchItems();
      } else {
        alert('Error adding item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  });

  addPartnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('partnerName').value;
    const bulstat = document.getElementById('partnerBulstat').value;
    const address = document.getElementById('partnerAddress').value;
    const phoneNumber = document.getElementById('partnerPhone').value;
    const email = document.getElementById('partnerEmail').value;

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name, bulstat, address, phoneNumber, email })
      });
      const newPartner = await response.json();
      if (response.ok) {
        const li = document.createElement('li');
        li.textContent = `${newPartner.name} - ${newPartner.bulstat} - ${newPartner.address} - ${newPartner.phoneNumber} - ${newPartner.email}`;
        partnersList.appendChild(li);
        addPartnerForm.reset();
        fetchPartners();
      } else {
        alert('Error adding partner', error);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  });

  fetchItems();
  fetchPartners();

  const salesForm = document.getElementById('salesForm');
  const purchasesForm = document.getElementById('purchasesForm');

  salesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemId = document.getElementById('salesItemId').value;
    const quantity = document.getElementById('saleQuantity').value;

    try {
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ itemId, quantity })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Sale successfully');
        fetchItems();
      } else {
        alert('Error selling item' + result.message);
      }
    } catch (error) {
      console.error('Error selling item:', error);
    }
  });

  purchasesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const itemId = document.getElementById('purchaseItemId').value;
    const quantity = document.getElementById('purchaseQuantity').value;

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ itemId, quantity })
      });
      const result = await response.json();
      if (response.ok) {
        alert('Purchase successfully');
        fetchItems();
      } else {
        alert('Error purchasing item' + result.message);
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  });
});