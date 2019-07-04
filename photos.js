function onMobileMenuIconClick(mobileMenuIconElement) {
    mobileMenuIconElement.classList.toggle('change');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('show')
}