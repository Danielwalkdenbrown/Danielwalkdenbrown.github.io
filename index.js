// const getDimensionsForScale = (scale = 1) => {
//     return `64 128 8.574 96 8.574 32 64 0 119.426 32 119.426 96`;
// }

// document.addEventListener("DOMContentLoaded", function (event) {
//     anime({
//         targets: ['.shape polygon', 'feTurbulence', 'feDisplacementMap'],
//         points: getDimensionsForScale(2),
//         baseFrequency: 0,
//         scale: 1,
//         loop: true,
//         direction: 'alternate',
//         easing: 'easeInOutExpo'
//     });
// });

function onMobileMenuIconClick(mobileMenuIconElement) {
    console.log('hello');
    mobileMenuIconElement.classList.toggle('change');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('show')
}