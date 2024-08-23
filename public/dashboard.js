document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');

  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => {
      section.style.display = 'none';
    });
  }

  function hideAllSubSections() {
    const subSections = document.querySelectorAll('.sub-section');
    subSections.forEach((sub) => {
      sub.style.display = 'none';
    });
  }

  function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
      section.style.display = 'block';
      hideAllSubSections();
    }

    if (sectionId === 'itemSection') {
      document.getElementById('addItemSection').style.display = 'block';
    } else if (sectionId === 'purchasesSection') {
      document.getElementById('addPurchasesSection').style.display = 'block';
    }
  }

  function showSubSection(subSectionId) {
    const subSection = document.getElementById(subSectionId);
    if (subSection && subSection.style.display === 'block') {
      return;
    }
    hideAllSections();
    hideAllSubSections();
    if (subSection) {
      subSection.style.display = 'block';
    }
  }

  const addSalesItemBtn = document.getElementById('addSalesItem');
  const salesItemDiv = document.getElementById('salesItems');

  addSalesItemBtn.addEventListener('click', () => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'sales-form';
    itemDiv.innerHTML = `
      <input type="test" class="salesItemName" placeholder="Item Name">
      <input type="number" class="salesItemQuantity" placeholder="Quantity">
      <input type="number" class="salesItemPrice" placeholder="Price">
    `;
    salesItemDiv.appendChild(itemDiv);
  });

  const addPurchasesItemBtn = document.getElementById('addPurchasesItem');
  const purchasesItemDiv = document.getElementById('purchasesItem');

  addPurchasesItemBtn.addEventListener('click', () => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'purchases-form';
    itemDiv.innerHTML = `
      <input type="test" class="purchasesItemName" placeholder="Item Name">
      <input type="number" class="purchasesItemQuantity" placeholder="Quantity">
      <input type="number" class="purchasesItemPrice" placeholder="Price">
    `;
    purchasesItemDiv.appendChild(itemDiv);
  });

  document.getElementById('salesButton').addEventListener('click', () => {
    showSubSection('salesSection');
  });

  document.getElementById('purchasesButton').addEventListener('click', () => {
    showSubSection('purchasesSection');
  });

  const addSalesForm = document.getElementById('addSalesForm');
  addSalesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('salesName').value;
    const bulstat = document.getElementById('salesBulstat').value;
    const address = document.getElementById('salesAddress').value;
    const email = document.getElementById('salesEmail').value;
    const phone = document.getElementById('salesPhone').value;

    const items = [];
    const itemElements = salesItemDiv.querySelectorAll('.sales-item');

    itemElements.forEach((itemEl) => {
      const itemName = itemEl.querySelector('.salesItemName').value;
      const itemQuantity = itemEl.querySelector('.salesItemQuantity').value;
      const itemPrice = itemEl.querySelector('.salesItemPrice').value;
      if (itemName && quantity && price) {
        items.push({ itemName, quantity, price });
      }
  });

  const saleData = { name, bulstat, address, email, phone, items };

  try {
    const response = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
      body: JSON.stringify(saleData)
    });

    if (response.ok) {
      alert('Sale added successfully');
      salesItemDiv.innerHTML = '';
    } else {
      const error = await response.json();
      alert('Error adding sale:', error.message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error adding sale:', error);
  }
});

  const addPurchasesForm = document.getElementById('addPurchasesForm');
  addPurchasesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('purchasesName').value;
    const bulstat = document.getElementById('purchasesBulstat').value;
    const address = document.getElementById('purchasesAddress').value;
    const email = document.getElementById('purchasesEmail').value;
    const phone = document.getElementById('purchasesPhone').value;

    const items = [];
    const itemElements = purchasesItemDiv.querySelectorAll('.purchases-item');

    itemElements.forEach((itemEl) => {
      const itemName = itemEl.querySelector('.purchasesItemName').value;
      const quantity = itemEl.querySelector('.purchasesItemQuantity').value;
      const price = itemEl.querySelector('.purchasesItemPrice').value;
      if (itemName && quantity && price) {
        items.push({ itemName, quantity, price });
      }
    });

    const purchaseData = { name, bulstat, address, email, phone, items };

    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(purchaseData)
      });

      if (response.ok) {
        alert('Purchase added successfully');
        purchasesItemDiv.innerHTML = '';
      } else {
        const error = await response.json();
        alert('Error adding purchase:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding purchase:', error);
    }
  });

  async function fetchItems() {
    try {
      const response = await fetch('/api/items', {
        headers: { 'x-auth-token': token }
      });
      const items = await response.json();
      const itemList = document.getElementById('itemList');
      if (itemList) {
        itemList.innerHTML = '';
        items.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = `${item.name} - ${item.unit} - ${item.quantity} - ${item.price}`;
          itemList.appendChild(li);
        });
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('itemName').value;
    const unit = document.getElementById('itemUnit').value;
    const quantity = document.getElementById('itemQuantity').value;
    const price = document.getElementById('price').value;

    console.log('Submitting new item:', { name, unit, quantity, price });

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name, unit, quantity, price })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const newItem = await response.json();
        console.log('New item created:', newItem);
        fetchItems();
      } else {
        const error = await response.json();
        alert('Error adding new item:', error.message || 'Unknown error');
        console.log('Error response:', newItem);
      }
    } catch (error) {
      console.log('Error adding item:', error);
    }
  });

  const addPartnerForm = document.getElementById('addPartnerForm');

  async function fetchPartners () {
    try {
      const response = await fetch('/api/partners', {
        headers: { 'x-auth-token': token }
      });
      const partners = await response.json();
      const partnersList = document.getElementById('partnerList');
      if (partnersList) {
        partnersList.innerHTML = '';
        partners.forEach((partner) => {
          const li = document.createElement('li');
          li.textContent = `${partner.name} - ${partner.address} - ${partner.phone} - ${partner.email} - ${partner.bulstat}`;
          partnersList.appendChild(li);
        });
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  addPartnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('partnerName').value;
    const address = document.getElementById('partnerAddress').value;
    const phone = document.getElementById('partnerPhone').value;
    const email = document.getElementById('partnerEmail').value;
    const bulstat = document.getElementById('partnerBulstat').value;

    console.log('Submitting new partner:', { name, address, phone, email, bulstat });

    try {
      const response = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify({ name, address, phone, email, bulstat })
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const newPartner = await response.json();
        console.log('New partner created:', newPartner);
        fetchPartners();
      } else {
        const error = await response.json();
        alert('Erroe adding new partner');
        console.log('Error response:', newPartner);
      }
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  });

  document.getElementById('itemsButton').addEventListener('click', () => {
    showSection('itemsSection');
  });

  document.getElementById('partnersButton').addEventListener('click', () => {
    showSection('partnersSection');
  });

  document.getElementById('documentsButton').addEventListener('click', () => {
    showSubSection('documentsSection');
  });

  fetchItems();
  fetchPartners();

});