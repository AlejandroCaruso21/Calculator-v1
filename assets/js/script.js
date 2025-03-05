let history = JSON.parse(localStorage.getItem("userHistory")) || [];

// Verificar estado al cargar
window.onload = function() {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData && userData.status === "approved") {
        showMenu();
    } else if (userData && userData.status === "pending") {
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("pendingSection").classList.remove("hidden");
    }
};

// Enviar solicitud de login
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
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("pendingSection").classList.remove("hidden");
        addToHistory("Solicitud enviada");
    } else {
        alert("Completa todos los campos.");
    }
}

// Mostrar menú
function showMenu() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("pendingSection").classList.add("hidden");
    document.getElementById("menuSection").classList.remove("hidden");
    document.getElementById("historySection").classList.remove("hidden");
    updateHistory();
}

// Gestionar historial
function addToHistory(action) {
    history.push(`${action} - ${new Date().toLocaleString()}`);
    localStorage.setItem("userHistory", JSON.stringify(history));
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    history.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// Mostrar calculadora
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

// Calcular IMC
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