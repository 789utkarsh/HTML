
document.addEventListener('DOMContentLoaded', function() {
    const bookingForm = document.forms["booking"];
    const productDropdown = document.getElementById('pdct');
    const priceField = document.querySelector('input[name="price"]');

    // Retrieve product name and price from sessionStorage
    const savedProductName = sessionStorage.getItem('selectedProductName');
    const savedProductPrice = sessionStorage.getItem('selectedProductPrice');

    // Populate dropdown and price field if there's a saved product
    if (savedProductName) {
        // Set the selected product in the dropdown
        let optionExists = false;
        for (let i = 0; i < productDropdown.options.length; i++) {
            if (productDropdown.options[i].text === savedProductName) {
                productDropdown.selectedIndex = i;
                optionExists = true;
                break;
            }
        }
        if (!optionExists) {
            const newOption = new Option(savedProductName, savedProductName);
            productDropdown.add(newOption);
            productDropdown.value = savedProductName;
        }

        // Set the price field
        priceField.value = savedProductPrice || "";
    }

    // Define product prices
    const productPrices = {
        "Blouse": 250,
        "Blouse (Astar)": 300,
        "Middy": 800,
        "Suit Pant": 499,
        "Salwar Suit": 599,
        "Suit Plazo": 699,
        "Lehenga": 799,
        "CropTop Skirt": 999,
        "Gown": 999,
        "Frock": 860,
        "Frock-Suit": 1550,
        "Mini-Frock": 999,
        "Co-ord Dress": 2100,
        "Kurti": 950,
        "Kurti for Kids": 450,
        "Anarkali Suit": 799,
        "Plazo-Dress": 2200,
        "Jumpsuit": 2490,
        "Maxi-Dress": 1900,
        "Fall-Pico": 100,
        "Crop-Top": 500,
        "Pant": 900,
        "Shirt": 700,
        "Dhoti-Kurta": 1500,
        "Suit": 2500,
        "Kurta Pyjama": 2000,
        "Short-Kurta": 800,
        "Suit for Kids": 2000,
        "Kurta-Pyjama for Kids": 1600,
        "Kids-Sherwani": 2800,
        "Dhoti-Kurta for Kids": 2000,
        "Alteration": 100,
        "Lehenga Choli for Kids":1900
    };

    // Update price based on dropdown selection
    productDropdown.addEventListener('change', function() {
        const selectedProduct = this.value;
        const selectedPrice = productPrices[selectedProduct];

        if (selectedPrice) {
            priceField.value = selectedPrice;
            sessionStorage.setItem('selectedProductName', selectedProduct);
            sessionStorage.setItem('selectedProductPrice', selectedPrice);
        } else {
            priceField.value = "";
            sessionStorage.removeItem('selectedProductName');
            sessionStorage.removeItem('selectedProductPrice');
        }
    });
     // Reset sessionStorage when form is reset or on page refresh
     bookingForm.addEventListener('reset', function(){
        sessionStorage.removeItem('selectedProductName');
        sessionStorage.removeItem('selectedProductPrice');
        productDropdown.selectedIndex = 0; // Reset to the first option (or any default state)
        priceField.value = ""; // Clear the price field
     });
     bookingForm.addEventListener('submit', function(event) {
        // Clear sessionStorage when the form is submitted (optional)
        sessionStorage.removeItem('selectedProductName');
        sessionStorage.removeItem('selectedProductPrice');
    });
    });
  
//  code for booking form validation.

document.addEventListener("DOMContentLoaded", function() {
    const bookingForm = document.forms["booking"];

    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting immediately

        // Fetch all form inputs
        const formData = new FormData(bookingForm);
        formData.forEach((value, key) => console.log(`${key}: ${value}`));


        // Fetch all form inputs
        const firstName = bookingForm["first_name"].value.trim();
        const lastName = bookingForm["last_name"].value.trim();
        const contactNumber = bookingForm["contact_number"].value.trim();
        const address = bookingForm["address"].value.trim();
        const landmark= bookingForm["landmark"].value.trim();
        const city = bookingForm["city"].value.trim();
        const pincode = bookingForm["pincode"].value.trim();
        const product = bookingForm["product"].value;
        const quantity = bookingForm["quantity"].value;
        const appointmentDate = bookingForm["appointment_date"].value;
        const appointmentTime = bookingForm["appointment_time"].value;
        const homeDelivery = document.querySelector('input[name="home_delivery"]').checked ? "Yes" : "No";
        const needFabric = document.querySelector('input[name="need_fabric"]').checked ? "Yes" : "No";
        const sampleFile = bookingForm["sample_design"].files[0];

        // Validate required fields
        if (!firstName || !lastName || !contactNumber || !address || !city || !pincode || !product || !quantity) {
            alert("It is compulsory to fill in all fields.");
            return false;
        }

        // Validate contact number (10 digits)
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(contactNumber)) {
            alert("Please enter a valid 10-digit contact number.");
            return false;
        }

        // Validate pincode (6 digits)
        if (pincode.length !== 6) {
            alert("Please enter a valid 6-digit pincode.");
            return false;
        }

        // Validate quantity
        if (isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return false;
        }

        // Validate product selection
        if (product === "") {
            alert("Please select a product.");
            return false;
        }

        // Validate file size for the uploaded design (optional but max 2MB)
        if (sampleFile && sampleFile.size > 2 * 1024 * 1024) {
            alert("File size should be less than 2MB.");
            return false;
        }

        // Validate appointment time within working hours (9 AM - 6 PM)
        const appointmentTimeHours = new Date(`1970-01-01T${appointmentTime}Z`).getUTCHours();
        if (appointmentTimeHours < 11 || appointmentTimeHours > 18) {
            alert("Please select an appointment time during working hours (11 AM - 6 PM).");
            return false;
        }

        // Assuming the price and quantity are already captured from the booking form
    const price = parseFloat(bookingForm["price"].value) || 0;
//const quantity = parseInt(bookingForm["quantity"].value) || 0;

// Calculate the total amount based on the selected product's price and quantity
const totalAmount = price * quantity;

// Calculate the advance amount (50% of total amount)
const advanceAmount = totalAmount * 0.5;

// Calculate remaining amount
const remainingAmount = totalAmount - advanceAmount; 

// Store the total and advance amounts in sessionStorage
sessionStorage.setItem("totalAmount", totalAmount);
sessionStorage.setItem("advanceAmount", advanceAmount);
 // Create an object for sending to the backend
 const bookingData = {
    first_name: firstName,
    last_name: lastName,
    contact_number: contactNumber,
    address: address,
    landmark:landmark,
    city: city,
    pincode: pincode,
    product: product,
    quantity: quantity,
    price: price,
    totalAmount: totalAmount,
    advanceAmount: advanceAmount,
    remainingAmount:remainingAmount,
    sample_design: sampleFile ? sampleFile.name : null,  // Send the file name (or you can handle file uploads differently)
    appointment_date: appointmentDate,
    appointment_time: appointmentTime,
    need_fabric: needFabric,
    home_delivery: homeDelivery,
    created_at: new Date().toISOString()  // Optional: if needed for tracking creation time
};

// Send data to backend via fetch API
fetch('http://localhost:3000/booking', {  // Change this URL if needed
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData)
})
.then(response => response.json())
.then(data => {
    if (data.message === 'Booking successful') {
       // alert('Your booking has been successfully made!');
        sessionStorage.setItem("booking_id", data.booking_id); // Save booking_id

        window.location.href = "payment.html"; // Redirect to payment page
    } else {
        alert('Error: ' + data.message);
    }
})
.catch(error => {
    console.error("Error:", error);
    alert("An error occurred while submitting your booking.");
});
});
});

