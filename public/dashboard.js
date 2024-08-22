document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');

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
  });