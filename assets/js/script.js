let history = JSON.parse(localStorage.getItem("userHistory")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];

// Verificar estado al cargar (para index.html)
window.onload = function() {
    if (document.getElementById("loginSection")) { // Si estamos en index.html
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData && userData.status === "approved") {
            showMenu();
        } else if (userData && userData.status === "pending") {
            document.getElementById("loginSection").classList.add("hidden");
            document.getElementById("pendingSection").classList.remove("hidden");
        }
    } else if (document.getElementById("requestsBody")) { // Si estamos en admin.html
        loadPendingRequests();
    }
};

// Enviar solicitud de login (index.html)
function submitLogin() {
    const userData = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        telefono: document.getElementById("telefono").value,
        dni: document.getElementById("dni").value,
        correo: document.getElementById("correo").value,
        timestamp: new Date().toLocaleString(),
        status: "pending"
    };
    if (Object.values(userData).every(val => val)) {
        localStorage.setItem("userData", JSON.stringify(userData));
        users = users.filter(u => u.dni !== userData.dni); // Evitar duplicados
        users.push(userData);
        localStorage.setItem("users", JSON.stringify(users));
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("pendingSection").classList.remove("hidden");
        addToHistory("Solicitud enviada");
    } else {
        alert("Completa todos los campos.");
    }
}

// Mostrar menú (index.html)
function showMenu() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("pendingSection").classList.add("hidden");
    document.getElementById("menuSection").classList.remove("hidden");
    document.getElementById("historySection").classList.remove("hidden");
    updateHistory();
}

// Gestionar historial (index.html)
function addToHistory(action) {
    history.push(`${action} - ${new Date().toLocaleString()}`);
    localStorage.setItem("userHistory", JSON.stringify(history));
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById("historyList");
    if (historyList) {
        historyList.innerHTML = "";
        history.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            historyList.appendChild(li);
        });
    }
}

// Mostrar calculadora (index.html)
function showCalculator(type) {
    document.getElementById("calculatorDisplay").classList.remove("hidden");
    const title = document.getElementById("calculatorTitle");
    const content = document.getElementById("calculatorContent");
    title.textContent = type;
    content.innerHTML = `
        <input type="number" id="peso" placeholder="Peso (kg)"><br>
        <input type="number" id="altura" placeholder="Altura (m)"><br>
        <button onclick="calcularIMC()">Calcular</button>
        <p id="resultado"></p>
    `;
    addToHistory(`Abrió calculadora: ${type}`);
}

// Calcular IMC (index.html)
function calcularIMC() {
    let peso = document.getElementById("peso").value;
    let altura = document.getElementById("altura").value;
    if (peso && altura) {
        let imc = peso / (altura * altura);
        document.getElementById("resultado").innerHTML = "IMC: " + imc.toFixed(2);
        addToHistory("Calculó IMC");
    } else {
        alert("Ingresa peso y altura.");
    }
}

// Cargar solicitudes pendientes (admin.html)
function loadPendingRequests() {
    const tbody = document.getElementById("requestsBody");
    tbody.innerHTML = "";
    const pendingUsers = users.filter(u => u.status === "pending");
    pendingUsers.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.nombre}</td>
            <td>${user.apellido}</td>
            <td>${user.telefono}</td>
            <td>${user.dni}</td>
            <td>${user.correo}</td>
            <td>${user.timestamp}</td>
            <td>
                <button onclick="approveRequest('${user.dni}')">Aprobar</button>
                <button onclick="rejectRequest('${user.dni}')">Rechazar</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Aprobar solicitud (admin.html)
function approveRequest(dni) {
    users = users.map(u => u.dni === dni ? { ...u, status: "approved" } : u);
    localStorage.setItem("users", JSON.stringify(users));
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.dni === dni) {
        localStorage.setItem("userData", JSON.stringify({ ...userData, status: "approved" }));
    }
    loadPendingRequests();
    alert("Solicitud aprobada.");
}

// Rechazar solicitud (admin.html)
function rejectRequest(dni) {
    users = users.filter(u => u.dni !== dni);
    localStorage.setItem("users", JSON.stringify(users));
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.dni === dni) {
        localStorage.removeItem("userData");
    }
    loadPendingRequests();
    alert("Solicitud rechazada.");
}