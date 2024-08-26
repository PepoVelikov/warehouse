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

  function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      section.style.display = 'none';
    });
  }

  function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
    }
  }

  const itemsButton = document.getElementById('itemsButton');
  const partnersButton = document.getElementById('partnersButton');
  const salesButton = document.getElementById('salesButton');
  const purchasesButton = document.getElementById('purchasesButton');

  if (itemsButton) {
    itemsButton.addEventListener('click', () => {
      showSection('itemsSection');
    });
  }

  if (partnersButton) {
    partnersButton.addEventListener('click', () => {
      showSection('partnersSection');
    });
  }

  if (salesButton) {
    salesButton.addEventListener('click', () => {
      showSection('salesSection');
    });
  }

  if (purchasesButton) {
    purchasesButton.addEventListener('click', () => {
      showSection('purchasesSection');
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
        li.textContent = `${partner.name} - ${partner.bulstat} - ${partner.address} - ${partner.phone} - ${partner.email}`;
        partnersList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  if (addItemForm) {
    addItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const unit = document.getElementById('unit').value;
      const quantity = document.getElementById('quantity').value;
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
          alert('Error adding item:', newItem);
        }
      } catch (error) {
        console.error('Error adding item:', error);
      }
    });
  }

  if (addPartnerForm) {
    addPartnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('partnerName').value;
      const bulstat = document.getElementById('partnerBulstat').value;
      const address = document.getElementById('partnerAddress').value;
      const email = document.getElementById('partnerEmail').value;
      const phone = document.getElementById('partnerPhone').value;

      try {
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ name, bulstat, address, email, phone })
        });
        const newPartner = await response.json();
        if (response.ok) {
          const li = document.createElement('li');
          li.textContent = `${newPartner.name} - ${newPartner.bulstat} - ${newPartner.address} - ${newPartner.phone} - ${newPartner.email}`;
          partnersList.appendChild(li);
          addPartnerForm.reset();
          fetchPartners();
        } else {
          alert('Error adding partner:', newPartner);
        }
      } catch (error) {
        console.error('Error adding partner:', error);
      }
    });
  }

  fetchItems();
  fetchPartners();

  const salesForm = document.getElementById('salesForm');
  const purchasesForm = document.getElementById('purchasesForm');

  if (salesForm) {
    salesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const itemName = document.querySelector('.salesItemName').value;
      const itemQuantity = document.querySelector('.salesItemQuantity').value;
      const itemPrice = document.querySelector('.salesItemPrice').value;

      try {
        const response = await fetch('/api/sales', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ itemName, itemQuantity, itemPrice })
        });
        const result = await response.json();
        if (response.ok) {
          alert('Sale added successfully');
          salesForm.reset();
        } else {
          alert('Error adding sale:', result);
        }
      } catch (error) {
        console.error('Error adding sale:', error);
      }
    });
  }

  if (purchasesForm) {
    purchasesForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const itemName = document.querySelector('.purchasesItemName').value;
      const itemQuantity = document.querySelector('.purchasesItemQuantity').value;
      const itemPrice = document.querySelector('.purchasesItemPrice').value;

      try {
        const response = await fetch('/api/purchases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ itemName, itemQuantity, itemPrice })
        });
        const result = await response.json();
        if (response.ok) {
          alert('Purchase added successfully');
          purchasesForm.reset();
        } else {
          alert('Error adding purchase:', result);
        }
      } catch (error) {
        console.error('Error adding purchase:', error);
      }
    });
  }
});