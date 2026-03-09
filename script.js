const seats = document.querySelectorAll('.seat:not(.booked)');
const seatCountEl = document.getElementById('seatCount');
const totalPriceEl = document.getElementById('totalPrice');
const selectedSeatsEl = document.getElementById('selectedSeats');
const confirmBtn = document.getElementById('confirmBtn');

const TICKET_PRICE = 200;

seats.forEach(seat => {
    seat.addEventListener('click', () => {
        seat.classList.toggle('selected');
        updateSummary();
    });
});

function updateSummary() {
    const selected = document.querySelectorAll('.seat.selected');
    const names = Array.from(selected).map(s => s.dataset.seat);

    seatCountEl.textContent = names.length;
    totalPriceEl.textContent = names.length * TICKET_PRICE;
    selectedSeatsEl.textContent = names.length ? names.join(', ') : 'None';
    confirmBtn.disabled = names.length === 0;

    localStorage.setItem('selectedSeats', JSON.stringify(names));
}

window.addEventListener('DOMContentLoaded', () => {
    // Restore selected seats
    const savedSelected = JSON.parse(localStorage.getItem('selectedSeats')) || [];
    // Restore booked seats
    const savedBooked = JSON.parse(localStorage.getItem('bookedSeats')) || [];

    document.querySelectorAll('.seat').forEach(seat => {
        const id = seat.dataset.seat;
        if (savedBooked.includes(id)) {
            seat.classList.add('booked');
            seat.classList.remove('selected');
        } else if (savedSelected.includes(id)) {
            seat.classList.add('selected');
        }
    });

    updateSummary();
});

confirmBtn.addEventListener('click', () => {
    const ok = confirm('Confirm your booking?');
    if (!ok) return;

    const selected = document.querySelectorAll('.seat.selected');
    const booked = JSON.parse(localStorage.getItem('bookedSeats')) || [];

    selected.forEach(seat => {
        seat.classList.remove('selected');
        seat.classList.add('booked');
        booked.push(seat.dataset.seat);
    });

    localStorage.setItem('bookedSeats', JSON.stringify(booked));
    localStorage.removeItem('selectedSeats');
    updateSummary();
    alert('Booking confirmed! Enjoy the film. 🎬');
});

document.getElementById('resetBtn').addEventListener('click', () => {
    const ok = confirm('Reset all seats to original state?');
    if (!ok) return;
    localStorage.clear();
    location.reload();
});
