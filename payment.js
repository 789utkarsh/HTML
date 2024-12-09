window.onload = function() {
    // Retrieve amounts from sessionStorage
    const totalAmount = parseFloat(sessionStorage.getItem("totalAmount")) || 0; // Get total amount
    const advanceAmount = parseFloat(sessionStorage.getItem("advanceAmount")) || 0; // Get advance amount
    const remainingAmount = totalAmount - advanceAmount; // Calculate remaining amount

    // Display amounts in the HTML
    document.getElementById("total-amount").innerText = totalAmount.toFixed(2); // Total amount
    document.getElementById("advance-amount").innerText = advanceAmount.toFixed(2); // Advance amount
    document.getElementById("remaining-amount").innerText = remainingAmount.toFixed(2); // Remaining amount

     // Generate UPI payment link for PhonePe with the advance amount
     const upiID = "8112620713@ibl"; // Replace with your PhonePe UPI ID
        const paymentLink = `upi://pay?pa=8112620713@ibl&pn=Utkarsh Kumar&am=${advanceAmount.toFixed(2)}&cu=INR`;
        const qrCodeImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=245x270&data=${encodeURIComponent(paymentLink)}`;

        // Set the QR code image source dynamically
        document.getElementById("qr-code").src = qrCodeImgSrc;
    
}
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const transactionIdInput = document.getElementById('transaction-id');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission initially

        const transactionId = transactionIdInput.value.trim();

        // Check if transaction ID is empty
        if (transactionId === "") {
            alert("Please fill in all the required fields.");
            return; // Stop further processing
        }

        // Validate if transaction ID is alphanumeric and has at least 6 characters
        const isValid = /^[a-zA-Z0-9]{6,}$/.test(transactionId);

        if (isValid) {
            const bookingId = sessionStorage.getItem("booking_id"); // Retrieve booking ID from session storage
        if (!bookingId) {
            alert("Error: Booking ID not found. Please try booking again.");
            return;
        }
        fetch('http://localhost:3000/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_id: bookingId, transaction_id: transactionId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Payment processed successfully') {
                alert("Booking Successful, Thanks for the Payment");
                transactionIdInput.value = ""; // Clear the field after a successful booking
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while processing your payment.");
        });
    } else {
        alert("Please enter a valid Transaction ID.");
    }
});
});


