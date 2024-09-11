document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = 'login.html';
    console.error('No token found');
  }

  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  }

  function hideAllSections() {
    const sections = document.querySelectorAll('.section, .sub-section');
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
  const purchaseButton = document.getElementById('purchaseButton');

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

  if (purchaseButton) {
    purchaseButton.addEventListener('click', () => {
      showSection('purchaseSection');
    });
  }

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items', {
        headers: { 'x-auth-token': token }
      });
      const items = await response.json();
      const itemsList = document.getElementById('itemsList');
      const itemsDropdown = document.getElementById('itemsDropdown');

      if (itemsList && itemsDropdown) {
        itemsList.innerHTML = '';
        itemsDropdown.innerHTML = '';
        items.forEach((item) => {
          const li = document.createElement('li');
          li.textContent = `${item.name} - ${item.unit} - ${item.quantity} - ${item.price} BGN`;
          itemsList.appendChild(li);

          const option = document.createElement('option');
          option.value = item._id;
          option.textContent = `${item.name} (${item.quantity} налични)`;
          itemsDropdown.appendChild(option);
        });
      }
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
      const partnersDropdown = document.getElementById('partnersDropdown');

      if (partnersDropdown) {
        partnersDropdown.innerHTML = '<option value="">-- Select Partner --</option>';
        partners.forEach((partner) => {
          const option = document.createElement('option');
          option.value = partner._id;
          option.textContent = `${partner.name}`;
          partnersDropdown.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  fetchPartners();

  const addItemForm = document.getElementById('addItemForm');
  const addPartnerForm = document.getElementById('addPartnerForm');

  if (addItemForm) {
    addItemForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('itemName').value;
      const unit = document.getElementById('itemUnit').value;
      const quantity = document.getElementById('itemQuantity').value;
      const price = document.getElementById('itemPrice').value;

      try {
        const response = await fetch('/api/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ name, unit, quantity, price })
        });
        const newItem = await response.json();
        if (response.ok) {
          const li = document.createElement('li');
          li.textContent = `${newItem.itemNumber} - ${newItem.name} - ${newItem.unit} - ${newItem.quantity} - ${newItem.price} BGN`;
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
      const phone = document.getElementById('partnerPhone').value;
      const email = document.getElementById('partnerEmail').value;

      try {
        const response = await fetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify({ name, bulstat, address, phone, email })
        });
        const newPartner = await response.json();
        if (response.ok) {
          const li = document.createElement('li');
          li.textContent = `${newPartner.partnerNumbur} - ${newPartner.name} - ${newPartner.bulstat} - ${newPartner.address} - ${newPartner.phone} - ${newPartner.email}`;
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

    const addSalesItemButton = document.getElementById('addSalesItem');
    const salesItemContainer = document.querySelector('.sales-items-list');

    if (addSalesItemButton && salesItemContainer) {
      addSalesItemButton.addEventListener('click', () => {
        const itemName = document.getElementById('name').value;
        const itemQuantity = document.getElementById('quantity').value;
        const itemPrice = document.getElementById('price').value;

        if (!itemName || !itemQuantity || !itemPrice) {
          alert('Please fill in all fields');
          return;
        }

        const newItem = document.createElement('div');
        newItem.classList.add('sales-item');
        newItem.innerHTML = `
          <p><strong>Name:</strong> ${itemName}</p>
          <p><strong>Quantity:</strong> ${itemQuantity}</p>
          <p><strong>Price:</strong> ${itemPrice}</p>
        `;
        salesItemContainer.appendChild(newItem);

        document.getElementById('name').value = '';
        document.getElementById('quantity').value = '';
        document.getElementById('price').value = '';
      });
    }

    let selectedItem = null;

    const itemInput = document.getElementById('name');
    const suggestionList = document.createElement('ul');
    suggestionList.id = 'suggestion';
    itemInput.parentElement.appendChild(suggestionList);

    itemInput.addEventListener('input', async () => {
      const query = itemInput.value;

      if (query.length >= 2) {
        try {
          const response = await fetch(`/api/sales/search-items?name=${encodeURIComponent(query)}`, {
            headers: { 'x-auth-token': token }
          });
          const items = await response.json();
          suggestionList.innerHTML = '';

          if (items.length > 0) {
            items.forEach(item => {
              const li = document.createElement('li');
              li.textContent = `${item.name} ${item.quantity} (${item.unit} in stock)`;
              li.addEventListener('click', () => {
                itemInput.value = item.name;
                document.getElementById('quantity').value = item.quantity;
                document.getElementById('price').value = item.price;
                selectedItem = item;
                suggestionList.innerHTML = '';
              });
              suggestionList.appendChild(li);
            });
          } else {
            const li = document.createElement('li');
            li.textContent = 'No items found';
            suggestionList.appendChild(li);
            selectedItem = null;
          }
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      } else {
        suggestionList.innerHTML = '';
        selectedItem = null;
      }
    });

    const addPartnerButton = document.getElementById('addPartnerToList');
    const partnerListContainer = document.querySelector('.partner-list');

    if (addPartnerButton && partnerListContainer) {
      addPartnerButton.addEventListener('click', () => {
        const selectedPartner = document.getElementById('partnersDropdown').value;
        const selectedPartnerText = document.getElementById('partnersDropdown').selectedOptions[0].text;

        if (partnerListContainer.children.length > 1) {
          alert('You can only select one partner');
          return;
        }

        if (!selectedPartner) {
          alert('Please select a partner');
          return;
        }

        const newPartner = document.createElement('div');
        newPartner.classList.add('partner-item');
        newPartner.innerHTML = `
          <p><strong>Name:</strong> ${selectedPartnerText}</p>
        `;
        partnerListContainer.appendChild(newPartner);
      });
    }
  
    const salesForm = document.getElementById('addSalesForm');

    if (salesForm) {
      salesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedPartner = document.getElementById('partnersDropdown').value;
        if (!selectedPartner) {
          alert('Please select a partner');
          return;
        }

        const items = [];
        const itemElements = document.querySelectorAll('.sales-item');

        itemElements.forEach((item) => {
          const itemNameElement = item.querySelector('p:nth-child(1)');
          const itemQuantityelement = item.querySelector('p:nth-child(2)');
          const itemPriceElement = item.querySelector('p:nth-child(3)');

          const itemName = itemNameElement.textContent.replace('Name:', '').trim();
          const itemQuantity = itemQuantityelement.textContent.replace('Quantity:', '').trim();
          const itemPrice = itemPriceElement.textContent.replace('Price:', '').trim();

          if (!itemName || !itemQuantity || !itemPrice) {
            alert('One or more fields are missing in the added items.');
            return;
          }

          items.push({
            itemName,
            itemQuantity: Number(itemQuantity),
            itemPrice: Number(itemPrice)
          });
        });

        if (items.length === 0) {
          alert('Please add at least one item');
          return;
        }

        const saleData = { partnerId: selectedPartner, items };

        try {
          const response = await fetch('/api/sales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify(saleData)
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            alert(`Error: ${errorResponse.msg}`);
            return;
          }

          alert('Sale added successfully');
          salesForm.reset();
          salesItemContainer.innerHTML = '';
          partnerListContainer.innerHTML = '';
        } catch (error) {
          console.error('Error adding sale:', error);
          alert('An error occurred while adding the sale');
        }
      });
    }

    fetchItems();
    fetchPartners();
  });
  
  function clearSalesItems() {
    const salesItemsList = document.querySelector('.sales-items-list');
    salesItemsList.innerHTML = '';
  }

  function getPurchaseQuantity(itemName) {
    const purchases = document.querySelectorAll('.purchase-item');
    let purchaseQuantity = 0;
    purchases.forEach((purchase) => {
      const purchaseItemName = purchase.querySelector('#name').value;
      if (purchaseItemName === itemName) {
        purchaseQuantity += Number(purchase.querySelector('#quantity').value);
      }
    });
    return totalQuantity;
  }

  function clearSalesItems() {
    const salesItemsList = document.querySelector('sales-items-list');
    salesItemsList.innerHTML = '';
  }

  const purchaseForm = document.getElementById('addPurchaseForm');
  const addPurchaseItemButton = document.getElementById('addPurchaseItem');

  if (purchaseForm) {
    purchaseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const purchaseName = document.getElementById('purchaseName').value;
      const purchaseBulstat = document.getElementById('purchaseBulstat').value;
      const purchaseAddress = document.getElementById('purchaseAddress').value;
      const purchaseEmail = document.getElementById('purchaseEmail').value;
      const purchasePhone = document.getElementById('purchasePhone').value;

      const items = Array.from(document.querySelectorAll('.purchase-item')).map((item) => ({
        itemName: item.querySelector('#name').value,
        itemQuantity: item.querySelector('#quantity').value,
        itemPrice: item.querySelector('#price').value
      }));

      const purchaseData = { purchaseName, purchaseBulstat, purchaseAddress, purchaseEmail, purchasePhone, items };

      try {
        const response = await fetch('/api/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
          body: JSON.stringify(purchaseData)
        });
        console.log('Response status:', response.status);
        console.log('Response data:', await response.json());

        if (response.ok) {
          console.log('Purchase added successfully');
          purchaseForm.reset();
        } else {
          const errorResponse = await response.json();
          console.error('Error adding purchase:', errorResponse);
          alert('Error adding purchase:', errorResponse);
        }
      } catch (error) {
        console.error('Error adding purchase:', error);
      }
    });
  }

  if (addPurchaseItemButton) {
    addPurchaseItemButton.addEventListener('click', () => {
      const itemName = document.querySelector('#name').value;
      const itemQuantity = document.querySelector('#quantity').value;
      const itemPrice = document.querySelector('#price').value;

      if (itemName && itemQuantity && itemPrice) {
        const purchaseItemContainer = document.getElementById('purchaseItem');
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('purchase-item');

        newItemDiv.innerHTML = `
        <input type="text" id="name" value="${itemName}" readonly>
        <input type="number" id="quantity" value="${itemQuantity}" readonly>
        <input type="number" id="price" value="${itemPrice}" readonly>
      `;

        purchaseItemContainer.appendChild(newItemDiv);

        document.querySelector('#name').value = '';
        document.querySelector('#quantity').value = '';
        document.querySelector('#price').value = '';
      } else {
        alert('Please fill in all fields');
      }
    });
  }