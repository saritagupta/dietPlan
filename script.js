document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Function to handle the "Place Order" button click
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            // Validate the form
            const form = document.getElementById('delivery-form');
            if (form.checkValidity()) {
                // Get selected store and delivery method
                const selectedStore = document.getElementById('store-selector').value;
                const deliveryMethod = document.querySelector('input[name="delivery-method"]:checked').value;
                
                // Process the order based on store and delivery method
                processOrder(selectedStore, deliveryMethod);
            } else {
                // Show validation errors
                form.reportValidity();
            }
        });
    }
    
    // Function to process orders based on store and delivery method
    function processOrder(store, deliveryMethod) {
        // Get order details
        const orderDetails = collectOrderDetails();
        
        // Show loading indicator
        document.getElementById('order-processing').style.display = 'block';
        document.getElementById('delivery-form').style.display = 'none';
        
        // Simulate API call with timeout
        setTimeout(() => {
            if (deliveryMethod === 'instacart') {
                // Process through Instacart
                processInstacartOrder(store, orderDetails);
            } else {
                // Process direct with store
                processDirectStoreOrder(store, orderDetails);
            }
        }, 2000);
    }
    
    // Function to collect all order details
    function collectOrderDetails() {
        const cartItems = [];
        document.querySelectorAll('.cart-items tr:not(.cart-header)').forEach(row => {
            const nameEl = row.querySelector('.item-name');
            const quantityEl = row.querySelector('.item-quantity');
            const priceEl = row.querySelector('.item-price');
            const totalEl = row.querySelector('.item-total');
            
            if (nameEl && quantityEl && priceEl && totalEl) {
                cartItems.push({
                    name: nameEl.textContent,
                    quantity: parseInt(quantityEl.textContent),
                    price: parseFloat(priceEl.getAttribute('data-base-price') || priceEl.textContent.replace('$', '')),
                    total: parseFloat(totalEl.textContent.replace('$', ''))
                });
            }
        });
        
        return {
            customer: {
                name: document.getElementById('name')?.value || '',
                email: document.getElementById('email')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                address: document.getElementById('address')?.value || '',
                city: document.getElementById('city')?.value || '',
                state: document.getElementById('state')?.value || '',
                zip: document.getElementById('zip')?.value || ''
            },
            delivery: {
                date: document.getElementById('delivery-date')?.value || '',
                time: document.getElementById('delivery-time')?.value || '',
                instructions: document.getElementById('delivery-instructions')?.value || ''
            },
            order: {
                items: cartItems,
                subtotal: parseFloat(document.getElementById('cart-subtotal')?.textContent.replace('$', '') || '0'),
                deliveryFee: parseFloat(document.getElementById('cart-delivery-fee')?.textContent.replace('$', '') || '0'),
                tax: parseFloat(document.getElementById('cart-tax')?.textContent.replace('$', '') || '0'),
                total: parseFloat(document.getElementById('cart-total')?.textContent.replace('$', '') || '0')
            }
        };
    }
    
    // Function to process orders directly with the store
    function processDirectStoreOrder(store, orderDetails) {
        console.log(`Processing direct order with ${store}`, orderDetails);
        
        // Simulate API endpoints for different stores
        const storeApiEndpoints = {
            'aldi-direct': 'https://api.aldi.com/orders',
            'walmart': 'https://api.walmart.com/orders/create',
            'trader-joes': 'https://api.traderjoes.com/online-orders',
            'whole-foods': 'https://api.wholefoods.com/delivery/orders'
        };
        
        const endpoint = storeApiEndpoints[store] || storeApiEndpoints['aldi-direct'];
        
        // In a real implementation, this would be an actual API call
        // fetch(endpoint, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(orderDetails)
        // })
        
        // For demo purposes, simulate a successful order
        const orderNumber = generateOrderNumber();
        const storeNames = {
            'aldi-direct': 'Aldi',
            'walmart': 'Walmart',
            'trader-joes': 'Trader Joe\'s',
            'whole-foods': 'Whole Foods'
        };
        
        const storeName = storeNames[store] || 'Aldi';
        
        // Hide loading and show confirmation
        document.getElementById('order-processing').style.display = 'none';
        document.getElementById('order-confirmation').style.display = 'block';
        
        // Update confirmation message with store-specific details
        document.getElementById('confirmation-store').textContent = storeName;
        document.getElementById('confirmation-order-number').textContent = orderNumber;
        document.getElementById('confirmation-delivery-date').textContent = orderDetails.delivery.date;
        
        // Scroll to the confirmation message
        document.getElementById('order-confirmation').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to process orders through Instacart
    function processInstacartOrder(store, orderDetails) {
        console.log(`Processing Instacart order for ${store}`, orderDetails);
        
        // In a real implementation, this would integrate with Instacart's API
        // const instacartEndpoint = 'https://api.instacart.com/connect/v1/orders';
        
        // Prepare Instacart-specific payload
        const instacartPayload = {
            retailer_id: getInstacartRetailerId(store),
            customer: orderDetails.customer,
            delivery_address: {
                street: orderDetails.customer.address,
                city: orderDetails.customer.city,
                state: orderDetails.customer.state,
                zip: orderDetails.customer.zip
            },
            delivery_window: {
                date: orderDetails.delivery.date,
                time_window: orderDetails.delivery.time
            },
            items: orderDetails.order.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price
            })),
            special_instructions: orderDetails.delivery.instructions
        };
        
        console.log('Instacart payload:', instacartPayload);
        
        // For demo purposes, simulate a successful Instacart order
        const orderNumber = 'IC-' + generateOrderNumber();
        const storeNames = {
            'aldi-instacart': 'Aldi via Instacart',
            'walmart': 'Walmart via Instacart',
            'trader-joes': 'Trader Joe\'s via Instacart',
            'whole-foods': 'Whole Foods via Instacart'
        };
        
        const storeName = storeNames[store] || 'Aldi via Instacart';
        
        // Hide loading and show confirmation
        document.getElementById('order-processing').style.display = 'none';
        document.getElementById('order-confirmation').style.display = 'block';
        
        // Update confirmation message with Instacart-specific details
        document.getElementById('confirmation-store').textContent = storeName;
        document.getElementById('confirmation-order-number').textContent = orderNumber;
        document.getElementById('confirmation-delivery-date').textContent = orderDetails.delivery.date;
        document.getElementById('instacart-tracking-info').style.display = 'block';
        
        // Scroll to the confirmation message
        document.getElementById('order-confirmation').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Helper function to get Instacart retailer IDs
    function getInstacartRetailerId(store) {
        const retailerIds = {
            'aldi-instacart': 'aldi-123',
            'walmart': 'walmart-456',
            'trader-joes': 'traderjoes-789',
            'whole-foods': 'wholefoods-101'
        };
        
        return retailerIds[store] || retailerIds['aldi-instacart'];
    }
    
    // Helper function to generate a random order number
    function generateOrderNumber() {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }

    // Add day navigation
    const days = document.querySelectorAll('.day');
    const dayNav = document.createElement('div');
    dayNav.className = 'day-navigation';
    dayNav.innerHTML = '<h3>Quick Navigation</h3>';
    
    const dayList = document.createElement('ul');
    dayList.className = 'day-list';
    
    days.forEach(day => {
        const dayId = day.id;
        const dayName = day.querySelector('h3').textContent;
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#${dayId}">${dayName}</a>`;
        dayList.appendChild(listItem);
    });
    
    dayNav.appendChild(dayList);
    document.querySelector('.meal-plan').insertBefore(dayNav, document.querySelector('.day'));

    // Add styles for day navigation
    const style = document.createElement('style');
    style.textContent = `
        .day-navigation {
            background-color: var(--light-bg);
            border-radius: var(--border-radius);
            padding: 1rem;
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .day-list {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            list-style-type: none;
            padding: 0;
        }
        
        .day-list li {
            margin: 0.5rem;
        }
        
        .day-list a {
            display: block;
            padding: 0.5rem 1rem;
            background-color: var(--secondary-color);
            color: white;
            text-decoration: none;
            border-radius: var(--border-radius);
            transition: background-color 0.3s;
        }
        
        .day-list a:hover {
            background-color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .day-list {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);

    // Add print button
    const printBtn = document.createElement('button');
    printBtn.className = 'print-button';
    printBtn.textContent = 'Print Diet Plan';
    printBtn.addEventListener('click', () => {
        window.print();
    });
    document.querySelector('header').appendChild(printBtn);

    // Add styles for print button
    const printBtnStyle = document.createElement('style');
    printBtnStyle.textContent = `
        .print-button {
            background-color: white;
            color: var(--primary-color);
            border: 2px solid var(--primary-color);
            padding: 0.5rem 1rem;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-weight: bold;
            margin-top: 1rem;
            transition: all 0.3s;
        }
        
        .print-button:hover {
            background-color: var(--primary-color);
            color: white;
        }
        
        @media print {
            .print-button, .day-navigation {
                display: none;
            }
        }
    `;
    document.head.appendChild(printBtnStyle);

    // Add calorie counter
    const calorieCounter = document.createElement('div');
    calorieCounter.className = 'calorie-counter';
    calorieCounter.innerHTML = `
        <h3>Daily Calorie Tracker</h3>
        <p>Track your daily calories to ensure you're meeting your goals.</p>
        <div class="calorie-inputs">
            <div class="calorie-input">
                <label for="breakfast-calories">Breakfast:</label>
                <input type="number" id="breakfast-calories" placeholder="Calories" min="0">
            </div>
            <div class="calorie-input">
                <label for="lunch-calories">Lunch:</label>
                <input type="number" id="lunch-calories" placeholder="Calories" min="0">
            </div>
            <div class="calorie-input">
                <label for="snack-calories">Snack:</label>
                <input type="number" id="snack-calories" placeholder="Calories" min="0">
            </div>
            <div class="calorie-input">
                <label for="dinner-calories">Dinner:</label>
                <input type="number" id="dinner-calories" placeholder="Calories" min="0">
            </div>
        </div>
        <div class="calorie-total">
            <p>Total Calories: <span id="total-calories">0</span> / 1500</p>
            <div class="progress-bar">
                <div class="progress" id="calorie-progress"></div>
            </div>
        </div>
    `;
    
    document.querySelector('.intro').appendChild(calorieCounter);
    
    // Add styles for calorie counter
    const calorieStyle = document.createElement('style');
    calorieStyle.textContent = `
        .calorie-counter {
            background-color: var(--light-bg);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            margin-top: 2rem;
        }
        
        .calorie-inputs {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .calorie-input {
            flex: 1;
            min-width: 200px;
        }
        
        .calorie-input label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        
        .calorie-input input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
        }
        
        .calorie-total {
            margin-top: 1rem;
            text-align: center;
        }
        
        .progress-bar {
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            margin-top: 0.5rem;
            overflow: hidden;
        }
        
        .progress {
            height: 100%;
            background-color: var(--primary-color);
            width: 0%;
            transition: width 0.3s;
        }
        
        @media print {
            .calorie-counter {
                display: none;
            }
        }
    `;
    document.head.appendChild(calorieStyle);
    
    // Add calorie counter functionality
    const calorieInputs = document.querySelectorAll('.calorie-input input');
    const totalCaloriesElement = document.getElementById('total-calories');
    const calorieProgress = document.getElementById('calorie-progress');
    
    calorieInputs.forEach(input => {
        input.addEventListener('input', updateCalories);
    });
    
    function updateCalories() {
        let total = 0;
        calorieInputs.forEach(input => {
            const value = parseInt(input.value) || 0;
            total += value;
        });
        
        totalCaloriesElement.textContent = total;
        const percentage = Math.min((total / 1500) * 100, 100);
        calorieProgress.style.width = `${percentage}%`;
        
        if (percentage > 100) {
            calorieProgress.style.backgroundColor = '#F44336';
        } else {
            calorieProgress.style.backgroundColor = '';
        }
    }
    
    // Store tabs navigation for budget grocery list
    const storeTabs = document.querySelectorAll('.store-tab');
    const storeContents = document.querySelectorAll('.store-content');
    
    if (storeTabs.length > 0 && storeContents.length > 0) {
        storeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                storeTabs.forEach(t => t.classList.remove('active'));
                storeContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const store = tab.getAttribute('data-store');
                document.getElementById(store).classList.add('active');
            });
        });
        
        // Set first tab as active by default
        if (!document.querySelector('.store-tab.active')) {
            storeTabs[0].click();
        }
    }
    
    // Store selection dropdown functionality
    const storeSelector = document.getElementById('store-selector');
    const storeInfoDivs = document.querySelectorAll('.store-direct');
    const deliveryMethodRadios = document.querySelectorAll('input[name="delivery-method"]');
    
    if (storeSelector) {
        storeSelector.addEventListener('change', function() {
            // Hide all store info divs
            storeInfoDivs.forEach(div => div.classList.remove('active'));
            
            // Show selected store info
            const selectedStore = this.value;
            const selectedStoreInfo = document.getElementById(`${selectedStore}-info`);
            if (selectedStoreInfo) {
                selectedStoreInfo.classList.add('active');
            }
            
            // Update form UI based on store selection
            updateFormForSelectedStore(selectedStore);
            
            // Update cart items and pricing based on store
            updateCartForSelectedStore(selectedStore);
        });
    }
    
    // Delivery method change handler
    if (deliveryMethodRadios.length > 0) {
        deliveryMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const deliveryMethod = this.value;
                const selectedStore = storeSelector.value;
                updateDeliveryMethod(selectedStore, deliveryMethod);
            });
        });
    }
    
    // Functions to update form based on store selection
    function updateFormForSelectedStore(store) {
        const directOrderForm = document.getElementById('direct-order-form');
        
        // Show/hide appropriate form sections based on store
        if (store.includes('instacart') || store === 'trader-joes') {
            // For Instacart options, we'll hide the direct order form
            if (directOrderForm) directOrderForm.style.display = 'none';
        } else {
            // For direct store ordering, show the form
            if (directOrderForm) directOrderForm.style.display = 'block';
            
            // Update store-specific form elements
            updateStoreSpecificFormElements(store);
        }
    }
    
    // Update cart items and pricing based on selected store
    function updateCartForSelectedStore(store) {
        const cartTable = document.querySelector('.cart-items');
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const deliveryFeeElement = document.getElementById('cart-delivery-fee');
        const totalElement = document.getElementById('cart-total');
        
        if (!cartTable || !subtotalElement) return;
        
        // Store-specific pricing data
        const storePricing = {
            'aldi-direct': {
                multiplier: 1.0,
                deliveryFee: 5.99
            },
            'aldi-instacart': {
                multiplier: 1.15, // 15% markup on Instacart
                deliveryFee: 7.99
            },
            'walmart': {
                multiplier: 0.9, // Walmart often has lower prices
                deliveryFee: 5.99
            },
            'trader-joes': {
                multiplier: 1.2,
                deliveryFee: 6.99
            },
            'whole-foods': {
                multiplier: 1.4, // Adjusted to be more competitive
                deliveryFee: 8.99
            }
        };
        
        // Get pricing info for selected store
        const pricing = storePricing[store] || storePricing['aldi-direct'];
        
        // Update cart items with store-specific pricing
        const cartItems = cartTable.querySelectorAll('tr:not(.cart-header)');
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const priceCell = item.querySelector('.item-price');
            const quantityCell = item.querySelector('.item-quantity');
            const totalCell = item.querySelector('.item-total');
            
            if (priceCell && quantityCell && totalCell) {
                // Get base price and apply store multiplier
                const basePrice = parseFloat(priceCell.getAttribute('data-base-price') || priceCell.textContent.replace('$', ''));
                const storePrice = (basePrice * pricing.multiplier).toFixed(2);
                const quantity = parseInt(quantityCell.textContent);
                const itemTotal = (storePrice * quantity).toFixed(2);
                
                // Update displayed price and total
                priceCell.textContent = `$${storePrice}`;
                totalCell.textContent = `$${itemTotal}`;
                
                subtotal += parseFloat(itemTotal);
            }
        });
        
        // Update order summary
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        
        // Update delivery fee
        if (deliveryFeeElement) {
            deliveryFeeElement.textContent = `$${pricing.deliveryFee.toFixed(2)}`;
        }
        
        // Calculate tax (assume 7.5% tax rate)
        const taxRate = 0.075;
        const tax = subtotal * taxRate;
        if (taxElement) {
            taxElement.textContent = `$${tax.toFixed(2)}`;
        }
        
        // Update total
        if (totalElement) {
            const total = subtotal + tax + pricing.deliveryFee;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
        
        // Update store name in cart heading
        const storeDisplayNames = {
            'aldi-direct': 'Aldi',
            'aldi-instacart': 'Aldi via Instacart',
            'walmart': 'Walmart',
            'trader-joes': 'Trader Joe\'s',
            'whole-foods': 'Whole Foods'
        };
        
        const storeName = storeDisplayNames[store] || 'Aldi';
        const storeNameElements = document.querySelectorAll('.store-name');
        storeNameElements.forEach(el => {
            el.textContent = storeName;
        });
    }
    
    // Update delivery method (delivery vs pickup)
    function updateDeliveryMethod(store, method) {
        const deliveryFeeElement = document.getElementById('cart-delivery-fee');
        const deliveryFeeRow = document.querySelector('.delivery-fee-row');
        
        if (deliveryFeeElement && deliveryFeeRow) {
            if (method === 'pickup') {
                // For pickup, hide delivery fee
                deliveryFeeRow.style.display = 'none';
                deliveryFeeElement.textContent = '$0.00';
            } else {
                // For delivery, show fee
                deliveryFeeRow.style.display = 'table-row';
                
                // Get store-specific delivery fee
                const storePricing = {
                    'aldi-direct': 5.99,
                    'aldi-instacart': 9.99,
                    'walmart': 7.95,
                    'trader-joes': 9.99,
                    'whole-foods': 9.95
                };
                
                const fee = storePricing[store] || 5.99;
                deliveryFeeElement.textContent = `$${fee.toFixed(2)}`;
            }
            
            // Recalculate total
            updateTotal();
        }
    }
    
    // Update store-specific form elements
    function updateStoreSpecificFormElements(store) {
        const storeNameElements = document.querySelectorAll('.store-name');
        const storeName = getStoreDisplayName(store);
        
        // Update any elements that display the store name
        storeNameElements.forEach(el => {
            el.textContent = storeName;
        });
        
        // Update form title if it exists
        const formTitle = document.querySelector('.aldi-order-form h4');
        if (formTitle) {
            formTitle.textContent = `Order from ${storeName}`;
        }
    }
    
    // Helper function to get display name for store
    function getStoreDisplayName(storeValue) {
        const storeNames = {
            'aldi-direct': 'Aldi',
            'aldi-instacart': 'Aldi via Instacart',
            'walmart': 'Walmart',
            'trader-joes': 'Trader Joe\'s',
            'whole-foods': 'Whole Foods'
        };
        
        return storeNames[storeValue] || 'Aldi';
    }
    
    // Calculate total based on current values
    function updateTotal() {
        const subtotalElement = document.getElementById('cart-subtotal');
        const taxElement = document.getElementById('cart-tax');
        const deliveryFeeElement = document.getElementById('cart-delivery-fee');
        const totalElement = document.getElementById('cart-total');
        
        if (subtotalElement && taxElement && deliveryFeeElement && totalElement) {
            const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
            const tax = parseFloat(taxElement.textContent.replace('$', ''));
            const deliveryFee = parseFloat(deliveryFeeElement.textContent.replace('$', ''));
            
            const total = subtotal + tax + deliveryFee;
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Initialize the form with default store selection
    if (document.getElementById('store-selector')) {
        // Trigger change event to initialize the form
        document.getElementById('store-selector').dispatchEvent(new Event('change'));
    }
});