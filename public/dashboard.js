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

    hideAllSubSections();
    if (subSection) {
      subSection.style.display = 'block';
    }
  }

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

    document.getElementById('itemsButton').addEventListener('click', () => {
      showSection('itemsSection');
    });

    document.getElementById('partnersButton').addEventListener('click', () => {
      showSection('partnersSection');
    });

    document.getElementById('documentsButton').addEventListener('click', () => {
      showSubSection('documentsSection');
    });

    document.getElementById('salesButton').addEventListener('click', () => {
      showSubSection('salesSection');
    });

    document.getElementById('purchasesButton').addEventListener('click', () => {
      showSubSection('purchasesSection');
    });

    fetchItems();

});