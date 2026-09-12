const totalSlots = 12;
let parkingSlots = Array(totalSlots).fill(0);
let selectedSlot = -1;
let vehicles = [];
let waitingQueue = [];
let history = [];

function displaySlots() {
    const grid = document.getElementById("parkingGrid");
    grid.innerHTML = "";

    parkingSlots.forEach((status, i) => {
        const div = document.createElement("div");
        div.className = "slot " + (status === 0 ? "free" : "busy");
        div.innerHTML = status === 0
            ? `<span>🅿️</span><strong>P${String(i+1).padStart(2,"0")}</strong><small>AVAILABLE</small>`
            : `<span>🚗</span><strong>P${String(i+1).padStart(2,"0")}</strong><small>OCCUPIED</small>`;

        if (status === 0) div.onclick = () => selectSlot(i);
        grid.appendChild(div);
    });

    updateDashboard();
}

function selectSlot(i) {
    selectedSlot = i;
    document.getElementById("selectedSlot").innerText =
        `Selected Slot: P${String(i+1).padStart(2,"0")}`;
}

function autoAssign() {
    const i = parkingSlots.findIndex(x => x === 0);
    if (i === -1) {
        alert("Parking Full");
        return;
    }
    selectSlot(i);
}

function parkVehicle() {
    const number = document.getElementById("vehicleNumber").value.trim();
    const type = document.getElementById("vehicleType").value;

    if (!number || selectedSlot === -1) {
        alert("Enter vehicle number and select slot");
        return;
    }

    if (parkingSlots[selectedSlot] === 1) return;

    parkingSlots[selectedSlot] = 1;

    vehicles.push({
        number,
        type,
        slot: selectedSlot + 1
    });

    history.push(number);

    document.getElementById("vehicleNumber").value = "";
    selectedSlot = -1;
    document.getElementById("selectedSlot").innerText = "No slot selected";

    displaySlots();
    displayHistory();
}

function exitVehicle() {
    const number = document.getElementById("exitVehicleNumber").value.trim();
    const index = vehicles.findIndex(v => v.number === number);

    if (index === -1) {
        alert("Vehicle not found");
        return;
    }

    const vehicle = vehicles[index];
    parkingSlots[vehicle.slot - 1] = 0;
    vehicles.splice(index, 1);

    if (waitingQueue.length > 0) {
        const next = waitingQueue.shift();
        alert(`Waiting vehicle ${next} can now park.`);
    }

    document.getElementById("exitVehicleNumber").value = "";
    displaySlots();
    displayWaitingQueue();
}

function searchVehicle() {
    const number = document.getElementById("searchVehicleNumber").value.trim();
    const vehicle = vehicles.find(v => v.number === number);
    const result = document.getElementById("searchResult");

    result.innerText = vehicle
        ? `Vehicle ${vehicle.number} | ${vehicle.type} | Slot P${vehicle.slot}`
        : "Vehicle not found";
}

function updateDashboard() {
    const occupied = parkingSlots.filter(x => x === 1).length;
    document.getElementById("totalSlots").innerText = totalSlots;
    document.getElementById("availableSlots").innerText = totalSlots - occupied;
    document.getElementById("occupiedSlots").innerText = occupied;
    document.getElementById("vehicleCount").innerText = history.length;
}

function displayHistory() {
    document.getElementById("history").innerHTML =
        history.length
            ? history.slice().reverse().map(v => `<p>🚗 ${v}</p>`).join("")
            : "No parking history.";
}

function displayWaitingQueue() {
    document.getElementById("waitingQueue").innerHTML =
        waitingQueue.length
            ? waitingQueue.map(v => `<p>${v}</p>`).join("")
            : "No vehicles waiting.";
}

displaySlots();
displayHistory();
displayWaitingQueue();