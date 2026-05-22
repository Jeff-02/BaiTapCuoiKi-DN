const menuItems = document.querySelectorAll('.menu-item');
const mainTitle = document.getElementById('main-title');
menuItems.forEach(item => {
    item.addEventListener('click', function() {       
        menuItems.forEach(el => el.classList.remove('active'));       
        this.classList.add('active');        
        const newTitle = this.getAttribute('data-title');
        mainTitle.textContent = newTitle;
    });
});
