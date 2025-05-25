// Script for navigation bar

// Main Img Slider
let MainImg = document.getElementById("MainImg");
let smallimg = document.getElementsByClassName("small-img");

if (smallimg.length > 0) {
    for (let i = 0; i < smallimg.length; i++) {
        smallimg[i].onclick = function() {
            MainImg.src = smallimg[i].src;
        }
    }
}

// Mobile Menu
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    })
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    })
}

// Single Product Page
let proDetails = document.querySelector('.single-pro-image');
let proDetails2 = document.querySelector('.single-pro-details');

if (proDetails) {
    proDetails.addEventListener('click', function(event) {
        if (event.target.classList.contains('small-img')) {
            let src = event.target.getAttribute('src');
            document.querySelector('.MainImg').src = src;
        }
    });
}

// Shopping Cart
let cart = [];
let wishlist = [];

// Login Icon Functionality
const loginIcon = document.getElementById('login-icon');

if (loginIcon) {
    loginIcon.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = 'login.html';
    });
}

// Add to Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Initialize cart from localStorage
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        updateCartCount();
    }

    // Initialize wishlist from localStorage
    if (localStorage.getItem('wishlist')) {
        wishlist = JSON.parse(localStorage.getItem('wishlist'));
        updateWishlistCount();
    }
});

function addToCart(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const product = event.target.closest('.pro');
    const productId = product.dataset.id;
    const productName = product.querySelector('h5').textContent;
    const productPrice = product.querySelector('h4').textContent;
    const productImg = product.querySelector('img').src;

    const cartItem = {
        id: productId,
        name: productName,
        price: productPrice,
        img: productImg,
        quantity: 1
    };

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
        showNotification('Quantité mise à jour dans le panier!', 'info');
    } else {
        cart.push(cartItem);
        showNotification('Produit ajouté au panier!', 'success');
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    // Si nous sommes sur la page du panier, mettre à jour l'affichage
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
        updateCartTotal();
    }
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    // Vider le conteneur
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<tr><td colspan="6"><p class="empty-cart">Votre panier est vide</p></td></tr>';
        return;
    }

    // Ajouter chaque produit du panier
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        const subtotal = price * item.quantity;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="#" class="remove-item" data-id="${item.id}"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.img}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}"></td>
            <td>$${subtotal.toFixed(2)}</td>
        `;
        cartItemsContainer.appendChild(tr);
    });

    // Ajouter les écouteurs d'événements pour les boutons de suppression et les inputs de quantité
    addCartEventListeners();
}

function addCartEventListeners() {
    // Écouteurs pour les boutons de suppression
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.id;
            removeFromCart(productId);
        });
    });

    // Écouteurs pour les inputs de quantité
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = this.dataset.id;
            const newQuantity = parseInt(this.value);
            updateCartItemQuantity(productId, newQuantity);
        });
    });
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Produit supprimé du panier!', 'success');
}

function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showNotification('Quantité mise à jour!', 'info');
    }
}

// Wishlist Functionality
function toggleWishlist(event) {
    event.preventDefault(); // Empêche le rechargement de la page
    const product = event.target.closest('.pro');
    const wishlistBtn = event.target.closest('.wishlist-btn');
    const productId = product.dataset.id;
    const productName = product.querySelector('h5').textContent;
    const productPrice = product.querySelector('h4').textContent;
    const productImg = product.querySelector('img').src;

    const wishlistItem = {
        id: productId,
        name: productName,
        price: productPrice,
        img: productImg
    };

    const existingIndex = wishlist.findIndex(item => item.id === productId);
    if (existingIndex === -1) {
        wishlist.push(wishlistItem);
        wishlistBtn.classList.add('active');
        showNotification('Produit ajouté aux favoris!', 'success');
    } else {
        wishlist.splice(existingIndex, 1);
        wishlistBtn.classList.remove('active');
        showNotification('Produit retiré des favoris!', 'info');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Product Filtering
function filterProducts() {
    const filterButtons = document.querySelectorAll('.filter-option');
    const products = document.querySelectorAll('.pro');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const activeButtons = document.querySelectorAll('.filter-option.active');
            activeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            products.forEach(product => {
                const productCategory = product.dataset.category;

                // Reset display
                product.style.display = 'none';

                // Category filtering
                const categoryMatch = filter === 'all' || productCategory === filter;

                // Show product if category matches
                if (categoryMatch) {
                    product.style.display = 'block';
                }
            });
        });
    });
}

// Search Functionality
function searchProducts(query) {
    const products = document.querySelectorAll('.pro');
    const searchQuery = query.toLowerCase();
    
    products.forEach(product => {
        const productName = product.querySelector('h5').textContent.toLowerCase();
        const productCategory = product.querySelector('span').textContent.toLowerCase();
        
        if (productName.includes(searchQuery) || productCategory.includes(searchQuery)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });

    return isValid;
}

// Image Zoom Functionality
function initImageZoom() {
    const productImages = document.querySelectorAll('.pro img');
    productImages.forEach(img => {
        img.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            this.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            this.style.transform = 'scale(2)';
        });

        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    });

    // Suppression après 3 secondes
    setTimeout(() => {
        notification.style.transform = 'translateY(-100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Initialize features
document.addEventListener('DOMContentLoaded', function() {
    initImageZoom();

    // Initialize filter buttons for both category and price range
    document.querySelectorAll('.filter-option').forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings
            const filterGroup = this.closest('.filter-group');
            filterGroup.querySelectorAll('.filter-option').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Apply filters
            filterProducts();
        });
    });
    
    // Add event listeners for search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProducts(e.target.value);
        });
    }

    // Add event listeners for filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterProducts(e.target.dataset.filter);
        });
    });

    // Add event listeners for wishlist
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', toggleWishlist);
    });

    // Add form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form.id)) {
                e.preventDefault();
            }
        });
    });
});

// Cart Page Functionality
function updateCartTotal() {
    const cartItems = document.querySelectorAll('#cart tbody tr');
    let subtotal = 0;

    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('td:nth-child(4)').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('input[type="number"]').value);
        const itemTotal = price * quantity;
        
        item.querySelector('td:last-child').textContent = `$${itemTotal.toFixed(2)}`;
        subtotal += itemTotal;
    });

    document.querySelector('#subtotal td:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('#subtotal strong').textContent = `$${subtotal.toFixed(2)}`;
}

// Initialize cart page functionality
if (document.getElementById('cart')) {
    const quantityInputs = document.querySelectorAll('#cart input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateCartTotal);
    });

    const removeButtons = document.querySelectorAll('#cart .fa-times-circle');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('tr').remove();
            updateCartTotal();
        });
    });
}

// Newsletter Sign Up
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('#newsletter .form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="text"]');
            const email = emailInput.value.trim();
            
            if (email && isValidEmail(email)) {
                // Save to localStorage
                let subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                    showNotification('Thank you for subscribing to our newsletter!');
                } else {
                    showNotification('You are already subscribed!');
                }
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address!', 'error');
            }
        });
    }
});

// Coupon Application
document.addEventListener('DOMContentLoaded', function() {
    const couponForm = document.querySelector('#coupon form');
    if (couponForm) {
        couponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const couponInput = this.querySelector('input[type="text"]');
            const couponCode = couponInput.value.trim();
            
            if (applyCoupon(couponCode)) {
                showNotification('Coupon applied successfully!');
                couponInput.value = '';
                updateCartTotal();
            } else {
                showNotification('Invalid coupon code!', 'error');
            }
        });
    }
});

// Checkout Process
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.querySelector('#subtotal button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            // Create order
            const order = {
                id: generateOrderId(),
                items: cart,
                total: calculateTotal(),
                date: new Date().toISOString(),
                status: 'pending'
            };
            
            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Redirect to order confirmation page
            window.location.href = 'order-confirmation.html';
        });
    }
});

// Helper Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function applyCoupon(code) {
    const validCoupons = {
        'WELCOME10': 0.1,  // 10% off
        'FREESHIP': 'free-shipping',
        'SUMMER20': 0.2   // 20% off
    };
    
    if (validCoupons[code]) {
        const discount = validCoupons[code];
        localStorage.setItem('activeCoupon', JSON.stringify({ code, discount }));
        return true;
    }
    return false;
}

function calculateTotal() {
    let subtotal = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        subtotal += price * item.quantity;
    });
    
    // Apply coupon if exists
    const activeCoupon = JSON.parse(localStorage.getItem('activeCoupon') || 'null');
    if (activeCoupon) {
        if (typeof activeCoupon.discount === 'number') {
            subtotal *= (1 - activeCoupon.discount);
        } else if (activeCoupon.discount === 'free-shipping') {
            // Handle free shipping logic
        }
    }
    
    return subtotal.toFixed(2);
}

function generateOrderId() {
    return 'ORD-' + Date.now().toString(36).toUpperCase();
}

// Dark Mode Toggle
document.addEventListener('DOMContentLoaded', function() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(darkModeToggle);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
        this.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
});

// Enhanced Image Zoom
function initEnhancedImageZoom() {
    const productImages = document.querySelectorAll('.pro img');
    productImages.forEach(img => {
        const container = document.createElement('div');
        container.className = 'zoom-container';
        img.parentNode.insertBefore(container, img);
        container.appendChild(img);

        container.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = this.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            img.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            img.style.transform = 'scale(2)';
        });

        container.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
}

// Live Product Search
function initLiveSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchInput.parentNode.appendChild(searchResults);

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
            const products = document.querySelectorAll('.pro');
            products.forEach(product => product.style.display = 'block');
            return;
        }

        const products = document.querySelectorAll('.pro');
        const matchedProducts = [];

        products.forEach(product => {
            const productName = product.querySelector('h5').textContent.toLowerCase();
            const productCategory = product.querySelector('span').textContent.toLowerCase();
            const productDescription = product.querySelector('p').textContent.toLowerCase();

            if (productName.includes(query) || 
                productCategory.includes(query) || 
                productDescription.includes(query)) {
                product.style.display = 'block';
                matchedProducts.push(product);
            } else {
                product.style.display = 'none';
            }
        });

        // Update search results
        searchResults.innerHTML = '';
        searchResults.classList.toggle('active', matchedProducts.length > 0);

        matchedProducts.slice(0, 5).forEach(product => {
            const name = product.querySelector('h5').textContent;
            const img = product.querySelector('img').src;
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${img}" alt="${name}">
                <span>${name}</span>
            `;
            resultItem.dataset.id = product.dataset.id;
            searchResults.appendChild(resultItem);
        });

        // Add click event to result items
        searchResults.querySelectorAll('.search-result-item').forEach(resultItem => {
            resultItem.addEventListener('click', function() {
                const productId = this.dataset.id;
                const product = document.querySelector(`.pro[data-id="${productId}"]`);
                if (product) {
                    product.scrollIntoView({ behavior: 'smooth' });
                    product.classList.add('highlight');
                    setTimeout(() => product.classList.remove('highlight'), 2000);
                }
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
        });
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
            searchResults.innerHTML = '';
        }
    });
}

// Customer Reviews
function initReviews() {
    const reviewsSection = document.querySelector('.reviews-section');
    if (!reviewsSection) return;

    // Load reviews from localStorage or default data
    let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    if (reviews.length === 0) {
        reviews = [
            {
                id: 1,
                author: 'John Doe',
                rating: 5,
                comment: 'Great product! Very satisfied with my purchase.',
                date: '2024-01-15'
            },
            {
                id: 2,
                author: 'Jane Smith',
                rating: 4,
                comment: 'Good quality, but shipping took longer than expected.',
                date: '2024-01-10'
            }
        ];
        localStorage.setItem('reviews', JSON.stringify(reviews));
    }

    // Display reviews
    reviewsSection.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-stars">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
                <div class="review-author">${review.author}</div>
                <div class="review-date">${review.date}</div>
            </div>
            <div class="review-comment">${review.comment}</div>
        </div>
    `).join('');

    // Add review form
    const reviewForm = document.createElement('form');
    reviewForm.className = 'review-form';
    reviewForm.innerHTML = `
        <h4>Add Your Review</h4>
        <div class="rating-input">
            ${[1,2,3,4,5].map(i => `
                <i class="fas fa-star" data-rating="${i}"></i>
            `).join('')}
        </div>
        <textarea placeholder="Your review" required></textarea>
        <button type="submit">Submit Review</button>
    `;
    reviewsSection.appendChild(reviewForm);

    // Handle review submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const rating = this.querySelector('.fa-star.active')?.dataset.rating || 0;
        const comment = this.querySelector('textarea').value.trim();

        if (rating === 0) {
            showCustomAlert('Please select a rating by clicking on the stars!', 'error');
            return;
        }

        if (!comment) {
            showCustomAlert('Please write your review comment!', 'error');
            return;
        }

        const newReview = {
            id: Date.now(),
            author: 'You',
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString().split('T')[0]
        };

        reviews.unshift(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Show success alert
        showCustomAlert('Thank you for your review! Your feedback has been submitted successfully.', 'success');
        
        // Clear form
        this.querySelector('textarea').value = '';
        const stars = this.querySelectorAll('.fa-star');
        stars.forEach(star => star.classList.remove('active'));
        
        // Refresh reviews display
        initReviews();
    });

    // Rating stars interaction
    const stars = reviewForm.querySelectorAll('.fa-star');
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, i) => {
                s.classList.toggle('active', i < rating);
            });
        });

        // Add hover effect
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, i) => {
                s.classList.toggle('hover', i < rating);
            });
        });

        star.addEventListener('mouseout', function() {
            stars.forEach(s => s.classList.remove('hover'));
        });
    });
}

// Load More Products
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;

    const products = document.querySelectorAll('.pro');
    const productsPerPage = 8;
    let currentPage = 1;

    // Initially hide all products after the first page
    products.forEach((product, index) => {
        if (index >= productsPerPage) {
            product.style.display = 'none';
        }
    });

    loadMoreBtn.addEventListener('click', function() {
        const startIndex = currentPage * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        
        // Show next batch of products
        for (let i = startIndex; i < endIndex && i < products.length; i++) {
            products[i].style.display = 'block';
        }

        currentPage++;

        // Hide button if all products are shown
        if (endIndex >= products.length) {
            loadMoreBtn.style.display = 'none';
        }
    });
}

// Initialize all features
document.addEventListener('DOMContentLoaded', function() {
    // Charger les favoris depuis le localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
        // Mettre à jour l'apparence des boutons wishlist
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const product = btn.closest('.pro');
            const productId = product.dataset.id;
            if (wishlist.some(item => item.id === productId)) {
                btn.classList.add('active');
            }
        });
    }

    // Ajouter les écouteurs d'événements pour les boutons wishlist
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', toggleWishlist);
    });

    initEnhancedImageZoom();
    initLiveSearch();
    initReviews();
    initLoadMore();
});

// Product filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-option');
    const products = document.querySelectorAll('.pro');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            products.forEach(product => {
                if (filterValue === 'all') {
                    product.style.display = 'block';
                } else {
                    const category = product.getAttribute('data-category');
                    if (category === filterValue) {
                        product.style.display = 'block';
                    } else {
                        product.style.display = 'none';
                    }
                }
            });
        });
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();

        products.forEach(product => {
            const productName = product.querySelector('h5').textContent.toLowerCase();
            const productBrand = product.querySelector('span').textContent.toLowerCase();

            if (productName.includes(searchValue) || productBrand.includes(searchValue)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});

// Custom Alert Function
function showCustomAlert(message, type = 'success') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert ${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    alert.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="alert-content">${message}</div>
        <div class="close-alert"><i class="fas fa-times"></i></div>
    `;

    // Add to document
    document.body.appendChild(alert);

    // Show alert with animation
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);

    // Add close functionality
    const closeBtn = alert.querySelector('.close-alert');
    closeBtn.addEventListener('click', () => {
        alert.classList.remove('show');
        setTimeout(() => {
            alert.remove();
        }, 300);
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        if (alert.parentElement) {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }
    }, 5000);
}

// Update the sign up button event listener
document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.querySelector('.form button');
    const emailInput = document.querySelector('.form input[type="text"]');

    signUpButton.addEventListener('click', function() {
        if (!emailInput.value) {
            showCustomAlert('Please enter your email address in the format: example@domain.com', 'error');
        } else if (!emailInput.value.includes('@')) {
            showCustomAlert('Please enter a valid email address that includes @ symbol', 'error');
        } else if (!emailInput.value.includes('.')) {
            showCustomAlert('Please enter a valid email address that includes a domain (e.g., .com, .net)', 'error');
        } else {
            // Email is valid
            showCustomAlert('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = ''; // Clear the input after successful submission
        }
    });
});

// Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('#form-details form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = this.querySelector('button.normal');
            const nameInput = this.querySelector('input[placeholder="Your Name"]');
            const emailInput = this.querySelector('input[placeholder="E-mail"]');
            const subjectInput = this.querySelector('input[placeholder="Subject"]');
            const messageInput = this.querySelector('textarea');

            // Check if any field is empty
            if (!nameInput.value.trim()) {
                showCustomAlert('Please enter your name', 'error');
                return;
            }

            if (!emailInput.value.trim()) {
                showCustomAlert('Please enter your email address', 'error');
                return;
            }

            if (!subjectInput.value.trim()) {
                showCustomAlert('Please enter a subject', 'error');
                return;
            }

            if (!messageInput.value.trim()) {
                showCustomAlert('Please enter your message', 'error');
                return;
            }

            // Validate email format
            if (!isValidEmail(emailInput.value.trim())) {
                showCustomAlert('Please enter a valid email address (e.g., example@domain.com)', 'error');
                return;
            }

            // Add loading animation
            submitButton.classList.add('loading');
            submitButton.disabled = true;

            // Simulate form submission (remove this in production and use actual form submission)
            setTimeout(() => {
                // Remove loading animation
                submitButton.classList.remove('loading');
                
                // Add success animation
                submitButton.classList.add('success');
                
                // Show success message
                showCustomAlert('Thank you for your message! We will get back to you soon.', 'success');
                
                // Clear the form
                this.reset();
                
                // Reset button after animation
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    submitButton.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
});
