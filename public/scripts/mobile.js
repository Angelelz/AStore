const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  if (mobileMenuElement) {
    mobileMenuElement.classList.toggle('open')
  }
  
}

mobileMenuBtnElement?.addEventListener('click', toggleMobileMenu)