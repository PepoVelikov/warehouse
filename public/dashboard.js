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
      fetchPartners();
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

      const purchasePartnersDropdown = document.getElementById('purchasePartnersDropdown');
      if (purchasePartnersDropdown) {
        purchasePartnersDropdown.innerHTML = '<option value="">-- Select Supplier --</option>';
        partners.forEach((partner) => {
          const option = document.createElement('option');
          option.value = partner._id;
          option.textContent = `${partner.name}`;
          purchasePartnersDropdown.appendChild(option);
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
        alert('You can select only one partner');
        return;
      }

      if (!selectedPartner) {
        alert('Please select a partner');
        return;
      }

      document.getElementById('partnersDropdown').disabled = true;

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
        const itemQuantityElement = item.querySelector('p:nth-child(2)');
        const itemPriceElement = item.querySelector('p:nth-child(3)');

        const itemName = itemNameElement.textContent.replace('Name:', '').trim();
        const itemQuantity = itemQuantityElement.textContent.replace('Quantity:', '').trim();
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

  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners', {
          headers: { 'x-auth-token': token }
        });
        const partners = await response.json();
        const purchasePartnersDropdown = document.getElementById('purchasePartnersDropdown');
  
        if (purchasePartnersDropdown) {
          purchasePartnersDropdown.innerHTML = '<option value="">-- Избери доставчик --</option>';
          partners.forEach((partner) => {
            const option = document.createElement('option');
            option.value = partner._id;
            option.textContent = `${partner.name}`;
            purchasePartnersDropdown.appendChild(option);
          });
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };

    fetchPartners();

    const addPurchasePartnerButton = document.getElementById('addPurchasePartnerToList');
    const supplierListContainer = document.querySelector('.supplier-list');
  
    if (addPurchasePartnerButton && supplierListContainer) {
      addPurchasePartnerButton.addEventListener('click', () => {
        const selectedSupplier = document.getElementById('purchasePartnersDropdown').value;
        const selectedSupplierText = document.getElementById('purchasePartnersDropdown').selectedOptions[0].text;
  
        if (!selectedSupplier) {
          alert('Please select a supplier');
          return;
        }
  
        const existingSuppliers = supplierListContainer.querySelectorAll('.supplier-item');
        if (existingSuppliers.length > 0) {
          alert('You can select only one supplier');
          return;
        }

        const newSupplier = document.createElement('div');
        newSupplier.classList.add('supplier-item');
        newSupplier.innerHTML = `<p><strong>Име на доставчик:</strong> ${selectedSupplierText}</p>`;
        supplierListContainer.appendChild(newSupplier);

        document.getElementById('purchasePartnersDropdown').disabled = true;
      });
    }
  
    const purchaseItemInput = document.getElementById('purchaseItemName');
    const purchaseSuggestionList = document.createElement('ul');
    purchaseSuggestionList.id = 'purchaseSuggestion';
    purchaseItemInput.parentElement.appendChild(purchaseSuggestionList);
  
    purchaseItemInput.addEventListener('input', async () => {
      const query = purchaseItemInput.value;
  
      if (query.length >= 2) {
        try {
          const response = await fetch(`/api/purchase/search-items?name=${encodeURIComponent(query)}`);
  
          if (!response.ok) {
            throw new Error('Грешка при търсене на артикули');
          }
  
          const items = await response.json();
          purchaseSuggestionList.innerHTML = '';
  
          if (items.length > 0) {
            items.forEach((item) => {
              const li = document.createElement('li');
              li.textContent = `${item.name} (${item.quantity} налични)`;
              li.addEventListener('click', () => {
                purchaseItemInput.value = item.name;
                document.getElementById('purchaseItemQuantity').value = item.quantity;
                document.getElementById('purchaseItemPrice').value = item.price;
                purchaseSuggestionList.innerHTML = '';
              });
              purchaseSuggestionList.appendChild(li);
            });
          } else {
            const li = document.createElement('li');
            li.textContent = 'Няма намерени артикули';
            purchaseSuggestionList.appendChild(li);
          }
        } catch (error) {
          console.error('Грешка при извличане на артикули:', error);
        }
      } else {
        purchaseSuggestionList.innerHTML = '';
      }
    });
  
    const addPurchaseItemButton = document.getElementById('addPurchaseItem');
    const purchaseItemsList = document.querySelector('.purchase-items-list');

    document.getElementById('addPurchaseItem').addEventListener('click', () => {
      const itemName = document.getElementById('purchaseItemName').value.trim();
      const itemQuantity = document.getElementById('purchaseItemQuantity').value.trim();
      const itemPrice = document.getElementById('purchaseItemPrice').value.trim();

      if (!itemName || !itemQuantity || !itemPrice) {
        alert('Моля, попълнете всички полета');
        return;
      }

      const newItem = document.createElement('div');
      newItem.classList.add('purchase-item');
      newItem.innerHTML = `
        <p class="item-name"><strong>Име:</strong> ${itemName}</p>
        <p class="item-quantity"><strong>Количество:</strong> ${itemQuantity}</p>
        <p class="item-price"><strong>Цена:</strong> ${itemPrice}</p>
      `;
      purchaseItemsList.appendChild(newItem);

      document.querySelector('.purchase-items-list').appendChild(newItem);

      document.getElementById('purchaseItemName').value = '';
      document.getElementById('purchaseItemQuantity').value = '';
      document.getElementById('purchaseItemPrice').value = '';
    });

    addPurchaseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const selectedSupplier = document.getElementById('purchasePartnersDropdown').value;
      if (!selectedSupplier) {
        alert('Please select a supplier');
        return;
      }
    
      const items = [];
      const itemElements = document.querySelectorAll('.purchase-item');
    
      if (itemElements.length === 0) {
        alert('Please add at least one item');
        return;
      }

    itemElements.forEach((item) => {
      const itemNameElement = item.querySelector('.item-name');
      const itemQuantityElement = item.querySelector('.item-quantity');
      const itemPriceElement = item.querySelector('.item-price');
      
      console.log("Item:", { itemNameElement, itemQuantityElement, itemPriceElement });

      if (!itemNameElement || !itemQuantityElement || !itemPriceElement) {
        alert('Missing item details');
        return;
      }

      const itemName = itemNameElement.innerText.replace('Name:', '').trim();
      const itemQuantity = itemQuantityElement.innerText.replace('Qantity:', '').trim();
      const itemPrice = itemPriceElement.innerText.replace('Price:', '').trim();

      if (!itemName || !itemQuantity || !itemPrice || Number(itemQuantity) <= 0 || Number(itemPrice) <= 0) {
        console.log("Invalid item details", { itemName, itemQuantity, itemPrice });
        return;
      }

      items.push({
        itemName: itemName,
        itemQuantity: Number(itemQuantity),
        itemPrice: Number(itemPrice),
      });
    });

    const purchaseData = { partnerId: selectedSupplier, items };
    console.log('Purchase data:', items);

    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
        
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }  

      alert('Purchase added successfully');
      addPurchaseForm.reset();
      purchaseItemsList.innerHTML = '';

    } catch (error) {
      console.error('Error:', error);
    }
  });
});      
