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
  const salesItemsDiv = document.getElementById('salesItems');

  addSalesItemBtn.addEventListener('click', () => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'sales-item';
    itemDiv.innerHTML = `
      <input type="text" class="salesItemName" placeholder="Item Name">
      <input type="number" class="salesItemQuantity" placeholder="Quantity">
      <input type="number" class="salesItemPrice" placeholder="Price">
    `;
    salesItemsDiv.appendChild(itemDiv);
  });

  const addPurchaseItemBtn = document.getElementById('addPurchaseItem');
  const purchaseItemsDiv = document.getElementById('purchaseItems');

  addPurchaseItemBtn.addEventListener('click', () => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'purchase-item';
    itemDiv.innerHTML = `
      <input type="text" class="purchaseItemName" placeholder="Item Name">
      <input type="number" class="purchaseItemQuantity" placeholder="Quantity">
      <input type="number" class="purchaseItemPrice" placeholder="Price">
    `;
    purchaseItemsDiv.appendChild(itemDiv);
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
    const itemElements = salesItemsDiv.querySelectorAll('.sales-item');

    itemElements.forEach((itemEl) => {
      const itemName = itemEl.querySelector('.salesItemName').value;
      const quantity = itemEl.querySelector('.salesItemQuantity').value;
      const price = itemEl.querySelector('.salesItemPrice').value;
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
        alert('Sale submitted successfully');
        salesItemsDiv.innerHTML = '';
        const error = await response.json();
        alert('Error submitting sale:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting sale:', error);
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
    const itemElements = purchaseItemsDiv.querySelectorAll('.purchase-item');

    itemElements.forEach((itemEl) => {
      const itemName = itemEl.querySelector('.purchaseItemName').value;
      const quantity = itemEl.querySelector('.purchaseItemQuantity').value;
      const price = itemEl.querySelector('.purchaseItemPrice').value;
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
        alert('Purchase submitted successfully');
        purchaseItemsDiv.innerHTML = ''; // Clear form
      } else {
        const error = await response.json();
        alert('Error submitting purchase:', error.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting purchase:', error);
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