 
        // SIMPLE USER DATABASE USING localStorage
        const USER_STORAGE_KEY = 'smileToursUsers';
        const CURRENT_USER_KEY = 'currentSmileToursUser';
        const CONTACT_MESSAGES_KEY = 'smileToursContactMessages';

        // Initialize databases
        function initializeDatabases() {
            try {
                // Users database
                if (!localStorage.getItem(USER_STORAGE_KEY)) {
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([]));
                }
                
                // Contact messages database
                if (!localStorage.getItem(CONTACT_MESSAGES_KEY)) {
                    localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify([]));
                }
                
                // Add test user if none exists
                const users = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
                if (users.length === 0) {
                    const testUsers = [
                        {
                            id: 1,
                            name: "Test User",
                            email: "test@example.com",
                            password: "password123",
                            phone: "123-456-7890",
                            createdAt: new Date().toISOString()
                        }
                    ];
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(testUsers));
                }
                
                return true;
            } catch (error) {
                console.error("Error initializing databases:", error);
                return false;
            }
        }

        // Initialize on page load
        initializeDatabases();

        // User database functions
        function getAllUsers() {
            try {
                const users = localStorage.getItem(USER_STORAGE_KEY);
                return users ? JSON.parse(users) : [];
            } catch (error) {
                console.error("Error getting users:", error);
                return [];
            }
        }

        function saveAllUsers(users) {
            try {
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
                return true;
            } catch (error) {
                console.error("Error saving users:", error);
                return false;
            }
        }

        function registerUser(userData) {
            try {
                const users = getAllUsers();
                
                if (users.find(user => user.email === userData.email)) {
                    return { success: false, message: 'User already exists with this email' };
                }

                const newUser = {
                    id: Date.now(),
                    ...userData,
                    createdAt: new Date().toISOString()
                };

                users.push(newUser);
                saveAllUsers(users);
                
                return { success: true, user: newUser, message: 'Registration successful!' };
            } catch (error) {
                return { success: false, message: 'Registration failed. Please try again.' };
            }
        }

        function loginUser(email, password) {
            try {
                const users = getAllUsers();
                const user = users.find(user => user.email === email && user.password === password);
                
                if (!user) {
                    return { success: false, message: 'Invalid email or password' };
                }

                const { password: _, ...userWithoutPassword } = user;
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
                
                return { success: true, user: userWithoutPassword, message: 'Login successful!' };
            } catch (error) {
                return { success: false, message: 'Login failed. Please try again.' };
            }
        }

        function logoutUser() {
            localStorage.removeItem(CURRENT_USER_KEY);
            return { success: true, message: 'Logged out successfully' };
        }

        function getCurrentUser() {
            try {
                const user = localStorage.getItem(CURRENT_USER_KEY);
                return user ? JSON.parse(user) : null;
            } catch (error) {
                return null;
            }
        }

        // Contact form functions
        function saveContactMessage(messageData) {
            try {
                const messages = JSON.parse(localStorage.getItem(CONTACT_MESSAGES_KEY)) || [];
                const newMessage = {
                    id: Date.now(),
                    ...messageData,
                    timestamp: new Date().toISOString(),
                    status: 'unread'
                };
                
                messages.push(newMessage);
                localStorage.setItem(CONTACT_MESSAGES_KEY, JSON.stringify(messages));
                
                return { success: true, message: 'Message sent successfully!', data: newMessage };
            } catch (error) {
                return { success: false, message: 'Failed to send message. Please try again.' };
            }
        }

        // DOM Elements
        const authButtons = document.getElementById('authButtons');
        const loginModal = document.getElementById('loginModal');
        const signupModal = document.getElementById('signupModal');
        const closeLogin = document.getElementById('closeLogin');
        const closeSignup = document.getElementById('closeSignup');
        const switchToSignup = document.getElementById('switchToSignup');
        const switchToLogin = document.getElementById('switchToLogin');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const contactForm = document.getElementById('contactForm');
        const loginMessage = document.getElementById('loginMessage');
        const signupMessage = document.getElementById('signupMessage');
        const contactMessage = document.getElementById('contactMessage');
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const signupSubmitBtn = document.getElementById('signupSubmitBtn');
        const contactSubmitBtn = document.getElementById('contactSubmitBtn');

        // Show/hide message
        function showMessage(element, message, type = 'success') {
            if (!element) return;
            
            element.textContent = message;
            element.className = `message ${type}`;
            element.style.display = 'block';
            
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }

        // Show notification
        function showNotification(message, type = 'success') {
            const notification = document.createElement('div');
            notification.className = `message ${type}`;
            notification.textContent = message;
            notification.style.position = 'fixed';
            notification.style.top = '20px';
            notification.style.right = '20px';
            notification.style.zIndex = '1001';
            notification.style.padding = '15px 20px';
            notification.style.borderRadius = '5px';
            notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            notification.style.fontWeight = '500';
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }, 3000);
        }

        // Update auth buttons based on login status
        function updateAuthButtons() {
            const currentUser = getCurrentUser();
            
            if (currentUser) {
                authButtons.innerHTML = `
                    <div class="user-welcome">
                        <span class="user-name">Welcome, ${currentUser.name}</span>
                        <button class="logout-btn" id="logoutBtn">Logout</button>
                    </div>
                `;
                
                document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
            } else {
                authButtons.innerHTML = `
                    <button class="login-btn" id="loginBtn">Login</button>
                    <button class="signup-btn" id="signupBtn">Sign Up</button>
                `;
                
                attachAuthButtonListeners();
            }
        }

        // Attach event listeners to auth buttons
        function attachAuthButtonListeners() {
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');
            
            loginBtn?.addEventListener('click', () => {
                loginModal.style.display = 'flex';
                loginMessage && (loginMessage.style.display = 'none');
            });
            
            signupBtn?.addEventListener('click', () => {
                signupModal.style.display = 'flex';
                signupMessage && (signupMessage.style.display = 'none');
            });
        }

        // Handle logout
        function handleLogout() {
            logoutUser();
            updateAuthButtons();
            showNotification('Logged out successfully', 'success');
        }

        // Handle login form submission
        loginForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showMessage(loginMessage, 'Please fill in all fields', 'error');
                return;
            }
            
            loginSubmitBtn.disabled = true;
            loginSubmitBtn.textContent = 'Logging in...';
            
            setTimeout(() => {
                const result = loginUser(email, password);
                
                if (result.success) {
                    showMessage(loginMessage, result.message, 'success');
                    
                    setTimeout(() => {
                        loginModal.style.display = 'none';
                        updateAuthButtons();
                        showNotification('Welcome back!', 'success');
                        loginForm.reset();
                    }, 1500);
                } else {
                    showMessage(loginMessage, result.message, 'error');
                }
                
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.textContent = 'Login';
            }, 1000);
        });

        // Handle signup form submission
        signupForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const phone = document.getElementById('signupPhone').value || '';
            
            if (!name || !email || !password) {
                showMessage(signupMessage, 'Please fill in all required fields', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage(signupMessage, 'Password must be at least 6 characters', 'error');
                return;
            }
            
            signupSubmitBtn.disabled = true;
            signupSubmitBtn.textContent = 'Creating account...';
            
            setTimeout(() => {
                const result = registerUser({ name, email, password, phone });
                
                if (result.success) {
                    showMessage(signupMessage, result.message, 'success');
                    
                    const loginResult = loginUser(email, password);
                    
                    if (loginResult.success) {
                        setTimeout(() => {
                            signupModal.style.display = 'none';
                            updateAuthButtons();
                            showNotification('Account created successfully!', 'success');
                            signupForm.reset();
                        }, 1500);
                    }
                } else {
                    showMessage(signupMessage, result.message, 'error');
                }
                
                signupSubmitBtn.disabled = false;
                signupSubmitBtn.textContent = 'Sign Up';
            }, 1000);
        });

        // Handle contact form submission
        contactForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value || '';
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessageText').value;
            
            if (!name || !email || !subject || !message) {
                showMessage(contactMessage, 'Please fill in all required fields', 'error');
                return;
            }
            
            contactSubmitBtn.disabled = true;
            contactSubmitBtn.textContent = 'Sending...';
            
            setTimeout(() => {
                const result = saveContactMessage({
                    name,
                    email,
                    phone,
                    subject,
                    message
                });
                
                if (result.success) {
                    showMessage(contactMessage, result.message, 'success');
                    
                    setTimeout(() => {
                        contactForm.reset();
                        showNotification('Message sent! We\'ll get back to you soon.', 'success');
                    }, 1000);
                } else {
                    showMessage(contactMessage, result.message, 'error');
                }
                
                contactSubmitBtn.disabled = false;
                contactSubmitBtn.textContent = 'Send Message';
            }, 1500);
        });

        // Modal functionality
        closeLogin?.addEventListener('click', () => {
            loginModal.style.display = 'none';
            loginForm.reset();
            loginMessage && (loginMessage.style.display = 'none');
        });
        
        closeSignup?.addEventListener('click', () => {
            signupModal.style.display = 'none';
            signupForm.reset();
            signupMessage && (signupMessage.style.display = 'none');
        });
        
        // Switch between modals
        switchToSignup?.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
            loginForm.reset();
            loginMessage && (loginMessage.style.display = 'none');
        });
        
        switchToLogin?.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
            signupForm.reset();
            signupMessage && (signupMessage.style.display = 'none');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                loginForm.reset();
                loginMessage && (loginMessage.style.display = 'none');
            }
            if (e.target === signupModal) {
                signupModal.style.display = 'none';
                signupForm.reset();
                signupMessage && (signupMessage.style.display = 'none');
            }
        });

        // Car booking buttons
        const bookButtons = document.querySelectorAll('.book-btn');
        bookButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentUser = getCurrentUser();
                
                if (!currentUser) {
                    showNotification('Please login to book a car', 'error');
                    loginModal.style.display = 'flex';
                } else {
                    const carCard = button.closest('.car-card');
                    const carName = carCard.querySelector('h3').textContent;
                    const carPrice = carCard.querySelector('.car-price').textContent;
                    
                    showNotification(`Booking ${carName} for ${carPrice}...`, 'success');
                    
                    setTimeout(() => {
                        showNotification(`Successfully booked ${carName}! We'll contact you shortly.`, 'success');
                    }, 1500);
                }
            });
        });

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', function() {
            // Attach initial event listeners
            attachAuthButtonListeners();
            
            // Update auth buttons
            updateAuthButtons();
            
            // Add smooth scrolling to all anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
         // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Only initialize if the stay with us section exists
        const stayWithUsSection = document.getElementById('stay-with-us');
        if (!stayWithUsSection) return;
        
        // Initialize date inputs
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const formatDate = (date) => {
            return date.toISOString().split('T')[0];
        };
        
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput && checkoutInput) {
            checkinInput.value = formatDate(today);
            checkinInput.min = formatDate(today);
            checkoutInput.value = formatDate(tomorrow);
            checkoutInput.min = formatDate(tomorrow);
        }
        
        // Tab functionality - scoped to stay-with-us section
        const tabButtons = stayWithUsSection.querySelectorAll('.tab-btn');
        const tabContents = stayWithUsSection.querySelectorAll('.tab-content');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const tabId = button.getAttribute('data-tab');
                const activeContent = stayWithUsSection.querySelector(`#${tabId}`);
                
                if (tabId === 'all') {
                    // Show all cards
                    stayWithUsSection.querySelectorAll('.accommodation-card').forEach(card => {
                        card.style.display = 'block';
                    });
                    if (activeContent) {
                        activeContent.classList.add('active');
                    }
                } else {
                    // Filter cards based on tab
                    stayWithUsSection.querySelectorAll('.accommodation-card').forEach(card => {
                        const cardTypes = card.getAttribute('data-type').split(' ');
                        if (cardTypes.includes(tabId)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Copy filtered cards to the active tab content
                    const filteredCards = Array.from(stayWithUsSection.querySelectorAll(`.accommodation-card[data-type*="${tabId}"]`));
                    const tabContentContainer = activeContent;
                    
                    // Clear existing content and add filtered cards
                    if (tabContentContainer) {
                        tabContentContainer.innerHTML = '';
                        if (filteredCards.length > 0) {
                            const grid = document.createElement('div');
                            grid.className = 'accommodation-grid';
                            filteredCards.forEach(card => {
                                grid.appendChild(card.cloneNode(true));
                            });
                            tabContentContainer.appendChild(grid);
                        } else {
                            tabContentContainer.innerHTML = `
                                <div style="text-align: center; padding: 60px 20px;">
                                    <h3 style="color: #7f8c8d; margin-bottom: 20px;">No accommodations found in this category</h3>
                                    <p style="color: #bdc3c7;">Try selecting a different category or view all stays.</p>
                                </div>
                            `;
                        }
                        tabContentContainer.classList.add('active');
                    }
                }
                
                // Reattach event listeners for buttons in the new content
                attachStayWithUsEventListeners();
            });
        });
        
        // Booking form submission
        const bookingForm = stayWithUsSection.querySelector('#bookingForm');
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const destination = stayWithUsSection.querySelector('#destination').value;
                const checkin = stayWithUsSection.querySelector('#checkin').value;
                const checkout = stayWithUsSection.querySelector('#checkout').value;
                const guests = stayWithUsSection.querySelector('#guests').value;
                
                // Simple validation
                if (!destination || !checkin || !checkout) {
                    showStayNotification('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Format dates for display
                const checkinDate = new Date(checkin);
                const checkoutDate = new Date(checkout);
                
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const formattedCheckin = checkinDate.toLocaleDateString('en-US', options);
                const formattedCheckout = checkoutDate.toLocaleDateString('en-US', options);
                
                // Show success message
                const destinationSelect = stayWithUsSection.querySelector('#destination');
                const destinationText = destinationSelect.options[destinationSelect.selectedIndex].text;
                
                showStayNotification(
                    `Searching for ${destinationText} accommodations for ${guests} guest(s) from ${formattedCheckin} to ${formattedCheckout}. Our best available rates are now being loaded.`,
                    'success'
                );
            });
        }
        
        // Update checkout date minimum when checkin changes
        if (checkinInput) {
            checkinInput.addEventListener('change', function() {
                const checkinDate = new Date(this.value);
                const newMinDate = new Date(checkinDate);
                newMinDate.setDate(newMinDate.getDate() + 1);
                
                if (checkoutInput) {
                    checkoutInput.min = formatDate(newMinDate);
                    
                    // If checkout is before the new minimum, update it
                    const checkoutDate = new Date(checkoutInput.value);
                    if (checkoutDate <= checkinDate) {
                        checkoutInput.value = formatDate(newMinDate);
                    }
                }
            });
        }
        
        // Attach event listeners to buttons
        function attachStayWithUsEventListeners() {
            // Book Now button functionality
            stayWithUsSection.querySelectorAll('.book-now').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const hotelName = this.getAttribute('data-hotel');
                    
                    // Pre-fill the destination based on hotel name
                    let destination = 'all';
                    if (hotelName.includes('Diani') || hotelName.includes('Watamu') || hotelName.includes('Nyali')) {
                        destination = hotelName.includes('Diani') ? 'diani' : 
                                     hotelName.includes('Watamu') ? 'watamu' : 'mombasa';
                    } else if (hotelName.includes('Mara')) {
                        destination = 'masaimara';
                    } else if (hotelName.includes('Amboseli')) {
                        destination = 'amboseli';
                    } else if (hotelName.includes('Samburu')) {
                        destination = 'samburu';
                    }
                    
                    const destinationSelect = stayWithUsSection.querySelector('#destination');
                    if (destinationSelect) {
                        destinationSelect.value = destination;
                    }
                    
                    // Scroll to booking form
                    const bookingSection = stayWithUsSection.querySelector('.booking-widget-section');
                    if (bookingSection) {
                        bookingSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                    
                    showStayNotification(`Now booking ${hotelName}. Please select your dates to continue.`, 'info');
                });
            });
            
            // View Details button functionality
            stayWithUsSection.querySelectorAll('.view-details').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const hotelName = this.getAttribute('data-hotel');
                    
                    // In a real implementation, this would open a modal or navigate to a details page
                    showStayNotification(`Loading detailed information for ${hotelName}...`, 'info');
                    
                    // Simulate loading and show hotel details
                    setTimeout(() => {
                        const modalHtml = `
                            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center;">
                                <div style="background: white; border-radius: 10px; padding: 30px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                        <h2 style="margin: 0; color: #2c3e50;">${hotelName}</h2>
                                        <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #7f8c8d;">×</button>
                                    </div>
                                    <p>Detailed information about ${hotelName} including amenities, room types, dining options, and guest reviews would be displayed here.</p>
                                    <p>This modal is for demonstration purposes. In a real implementation, this would show complete hotel details.</p>
                                    <div style="margin-top: 30px; display: flex; gap: 10px;">
                                        <button class="btn btn-primary" style="flex: 1;" onclick="document.querySelector('#stay-with-us .book-now[data-hotel=\"${hotelName}\"]').click(); this.closest('[style*=\"position: fixed\"]').remove()">Book Now</button>
                                        <button class="btn btn-secondary" onclick="this.closest('[style*=\"position: fixed\"]').remove()">Close</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        const modal = document.createElement('div');
                        modal.innerHTML = modalHtml;
                        document.body.appendChild(modal);
                    }, 500);
                });
            });
        }
        
        // Initial attachment of event listeners
        attachStayWithUsEventListeners();
        
        // Notification function specific to stay with us section
        function showStayNotification(message, type = 'info') {
            // Remove existing notification
            const existingNotification = stayWithUsSection.querySelector('.page-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // Create notification
            const notification = document.createElement('div');
            notification.className = `page-notification ${type}`;
            notification.innerHTML = `
                <div style="padding: 15px 20px; border-radius: 8px; background: ${type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'}; color: white; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0 0 0 10px;">×</button>
                </div>
            `;
            
            // Style for notification
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                min-width: 300px;
                max-width: 500px;
                animation: slideInRight 0.3s ease-out;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 8px;
                overflow: hidden;
            `;
            
            // Add animation if not already added
            if (!document.querySelector('#stay-notification-animations')) {
                const style = document.createElement('style');
                style.id = 'stay-notification-animations';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-out';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, 5000);
        }
    });