let myChart;
let multiChart;

// #region SEZIONE 1. FUNZIONI DI UTILITÀ E SALVATAGGIO
function saveToLocal() {
    const data = {
        fixedCosts: document.getElementById('fixedCosts').value,
        variableCost: document.getElementById('variableCost').value,
        price: document.getElementById('price').value,
        priceB: document.getElementById('priceB').value,
        fixedCostsMulti: document.getElementById('fixedCostsMulti').value,
        products: []
    };

    const rows = document.querySelectorAll('#multiProductBody tr');
    rows.forEach(row => {
        data.products.push({
            name: row.querySelector('.p-name').value,
            price: row.querySelector('.m-price').value,
            cost: row.querySelector('.m-var').value,
            mix: row.querySelector('.m-mix').value
        });
    });
    localStorage.setItem('vibeAppData', JSON.stringify(data));
}

function loadFromLocal() {
    const saved = localStorage.getItem('vibeAppData');
    if (!saved) return;
    const data = JSON.parse(saved);

    if(data.fixedCosts) document.getElementById('fixedCosts').value = data.fixedCosts;
    if(data.variableCost) document.getElementById('variableCost').value = data.variableCost;
    if(data.price) document.getElementById('price').value = data.price;
    if(data.priceB) document.getElementById('priceB').value = data.priceB;
    if(data.fixedCostsMulti) document.getElementById('fixedCostsMulti').value = data.fixedCostsMulti;
    
    if (data.products && data.products.length > 0) {
        const tbody = document.getElementById('multiProductBody');
        tbody.innerHTML = ""; 
        data.products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" class="input-financial p-name" value="${p.name}" onblur="saveToLocal()"></td>
                <td><input type="text" class="input-financial m-price" value="${p.price}" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
                <td><input type="text" class="input-financial m-var" value="${p.cost}" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
                <td><input type="number" class="input-financial m-mix" value="${p.mix}" onchange="saveToLocal(); calculateMultiBEP();"></td>
                <td><button onclick="this.parentElement.parentElement.remove(); saveToLocal(); calculateMultiBEP();" style="background:none; border:none; color:red; cursor:pointer;">✖</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

// Formattazione
const formatEuro = (valore) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(valore);
const formatNumero = (valore) => new Intl.NumberFormat('it-IT').format(valore);
function parseItalianNumber(stringa) {
    if (!stringa) return 0;
    const pulito = stringa.toString().replace(/\./g, '').replace(',', '.');
    return parseFloat(pulito) || 0;
}

function formatThis(input) {
    let val = parseItalianNumber(input.value);
    input.value = val.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function resetData() {
    // Chiede conferma all'utente per evitare cancellazioni accidentali
    if (confirm("Vuoi cancellare tutti i dati inseriti? Questa azione non può essere annullata.")) {
        localStorage.removeItem('vibeAppData');
        location.reload(); // Ricarica la pagina per far tornare i dati di esempio
    }
}
// #endregion

// #region SEZIONE 2. GESTIONE INPUT E FOCUS
document.addEventListener('focus', function(e) {
    if (e.target.tagName === 'INPUT') {
        setTimeout(() => e.target.select(), 0);
    }
}, true);

// Permette di calcolare premendo "Invio" su qualsiasi input
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
        e.target.blur(); // Toglie il focus, attivando automaticamente la formattazione e il calcolo
        updateChart();
        calculateMultiBEP();
        saveToLocal();
    }
});
// #endregion

// #region SEZIONE 3. FUNZIONE STANDARD BEP
function updateChart() {
    const elFixed = document.getElementById('fixedCosts');
    const elVar = document.getElementById('variableCost');
    const elPriceA = document.getElementById('price');
    const elPriceB = document.getElementById('priceB');
    if (!elFixed || !elVar || !elPriceA || !elPriceB) return;

    const F = parseItalianNumber(elFixed.value);
    const V = parseItalianNumber(elVar.value);
    const P = parseItalianNumber(elPriceA.value);
    const PB = parseItalianNumber(elPriceB.value);

    const bepA = (P - V) > 0 ? F / (P - V) : 0;
    const bepB = (PB - V) > 0 ? F / (PB - V) : 0;
    
    document.getElementById('bepA').innerText = formatNumero(Math.ceil(bepA));
    document.getElementById('bepB').innerText = formatNumero(Math.ceil(bepB));

    const labels = [];
    const revenueA = [];
    const revenueB = [];
    const totalCosts = [];
    const maxUnits = Math.max(bepA, bepB, 10) * 1.5;
    const step = Math.ceil(maxUnits / 10) || 1;

    for (let i = 0; i <= maxUnits; i += step) {
        labels.push(formatNumero(i)); 
        revenueA.push(i * P);
        revenueB.push(i * PB);
        totalCosts.push(F + (i * V));
    }

    const ctx = document.getElementById('bepChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Ricavi Scenario A', data: revenueA, borderColor: '#10b981', backgroundColor: '#10b981', borderWidth: 3, tension: 0.3, pointRadius: 2 },
                { label: 'Ricavi Scenario B', data: revenueB, borderColor: '#2563eb', backgroundColor: 'transparent', borderDash: [6, 4], borderWidth: 3, tension: 0.3, pointRadius: 2 },
                { label: 'Costi Totali', data: totalCosts, borderColor: '#ef4444', fill: true, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderWidth: 2, pointRadius: 0 }
            ]
        },
        options: { 
            responsive: true, maintainAspectRatio: false,
            plugins: { 
                legend: { position: 'top' },
                tooltip: {
                    mode: 'index', intersect: false,
                    callbacks: { label: (context) => ` ${context.dataset.label}: ${formatEuro(context.raw)}` }
                }
            },
            scales: { y: { beginAtZero: true, ticks: { callback: (value) => formatEuro(value) } } }
        }
    });

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ""; 
    const base = Math.max(bepA, bepB, 10);
    [0.5, 0.8, 1, 1.2, 1.5].forEach(perc => {
        const units = Math.round(base * perc);
        const utileA = (units * P) - (F + (units * V));
        const utileB = (units * PB) - (F + (units * V));
        const row = document.createElement('tr');
        row.innerHTML = `<td>${formatNumero(units)}</td><td style="color: ${utileA >= 0 ? '#10b981' : '#ef4444'}; font-weight: 600;">${formatEuro(utileA)}</td><td style="color: ${utileB >= 0 ? '#2563eb' : '#ef4444'}; font-weight: 700;">${formatEuro(utileB)}</td>`;
        tableBody.appendChild(row);
    });
}
// #endregion

// #region SEZIONE 4. LOGICA MULTIPRODOTTO
function addProductRow() {
    const tbody = document.getElementById('multiProductBody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="text" class="input-financial p-name" placeholder="Es. Scarpe" onblur="saveToLocal()"></td>
        <td><input type="text" class="input-financial m-price" value="0,00" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
        <td><input type="text" class="input-financial m-var" value="0,00" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
        <td><input type="number" class="input-financial m-mix" value="0" onchange="saveToLocal(); calculateMultiBEP();"></td>
        <td><button onclick="this.parentElement.parentElement.remove(); saveToLocal(); calculateMultiBEP();" style="background:none; border:none; color:red; cursor:pointer;">✖</button></td>
    `;
    tbody.appendChild(row);
    saveToLocal();
}

function calculateMultiBEP() {
    const F = parseItalianNumber(document.getElementById('fixedCostsMulti').value);
    const rows = document.querySelectorAll('#multiProductBody tr');
    const resultBox = document.getElementById('multiResultBox');
    const resultContent = document.getElementById('multiResultContent');

    let marginePonderatoTotale = 0;
    let prezzoMedioPonderato = 0;
    let mixTotale = 0;

    rows.forEach(row => {
        const p = parseItalianNumber(row.querySelector('.m-price').value);
        const v = parseItalianNumber(row.querySelector('.m-var').value);
        const mix = parseFloat(row.querySelector('.m-mix').value) || 0;
        prezzoMedioPonderato += p * (mix / 100);
        marginePonderatoTotale += (p - v) * (mix / 100);
        mixTotale += mix;
    });

    if (mixTotale === 0) return;

    const bepTotale = marginePonderatoTotale > 0 ? Math.ceil(F / marginePonderatoTotale) : 0;

    let ripartizioneHTML = `<div style="margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: left;"><p style="font-weight: bold; font-size: 0.9rem; margin-bottom: 10px;">RIPARTIZIONE UNITÀ:</p>`;
    rows.forEach(row => {
        const nome = row.querySelector('.p-name').value || "Prodotto";
        const mix = parseFloat(row.querySelector('.m-mix').value) || 0;
        const unita = Math.ceil(bepTotale * (mix / 100));
        ripartizioneHTML += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;"><span>${nome} (${mix}%)</span><strong>${formatNumero(unita)} Unità</strong></div>`;
    });
    ripartizioneHTML += `</div>`;

    resultBox.style.display = 'flex';
    resultContent.innerHTML = `<span style="font-size: 0.8rem; font-weight: bold; color: var(--secondary);">PAREGGIO MIX TOTALE</span><strong style="font-size: 3rem; color: var(--primary); display: block;">${formatNumero(bepTotale)}</strong>${ripartizioneHTML}`;

    const chartCont = document.getElementById('multiChartContainer');
    if (chartCont) chartCont.style.display = 'block';
    const ctxMulti = document.getElementById('multiBepChart').getContext('2d');
    if (multiChart) multiChart.destroy();

    const labels = [];
    const dataRicavi = [];
    const dataCosti = [];
    const step = Math.ceil(bepTotale / 10) || 1;
    for (let i = 0; i <= bepTotale * 1.5; i += step) {
        labels.push(formatNumero(i));
        dataRicavi.push(i * prezzoMedioPonderato);
        dataCosti.push(F + (i * (prezzoMedioPonderato - marginePonderatoTotale)));
    }

    multiChart = new Chart(ctxMulti, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Ricavi Mix', data: dataRicavi, borderColor: '#2563eb', borderWidth: 3, pointRadius: 2 },
                { label: 'Costi Totali', data: dataCosti, borderColor: '#ef4444', fill: true, backgroundColor: 'rgba(239, 68, 68, 0.05)', pointRadius: 0 }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { ticks: { callback: (value) => formatEuro(value) } } } }
    });
}
// #endregion

// #region SEZIONE 5. PDF ED ESPORTAZIONE
async function exportMultiToPDF() {
    const btn = document.getElementById('pdfBtnMulti');
    const element = document.querySelector('#view-multi .container');
    if (!element) return;
    btn.innerText = "Generazione...";
    try {
        const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL("image/jpeg", 0.8);
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        doc.save(`BEP_MULTIMIX_${new Date().toISOString().split('T')[0]}.pdf`);
    } finally {
        btn.innerText = "Scarica Report Mix PDF";
    }
}
// #endregion

// #region SEZIONE 6. SIDEBAR E NAVIGAZIONE
function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const isOpen = sidebar.style.width === "250px";
    sidebar.style.width = isOpen ? "0" : "250px";
    document.getElementById("main").style.marginLeft = isOpen ? "0" : "250px";
}

function showPage(page) {
    document.getElementById('view-simple').style.display = (page === 'simple') ? 'block' : 'none';
    document.getElementById('view-multi').style.display = (page === 'multi') ? 'block' : 'none';
    toggleNav(); 
}
// #endregion

// #region SEZIONE 7. EVENTI E INIZIALIZZAZIONE
document.querySelectorAll('.input-financial').forEach(input => {
    input.addEventListener('blur', function() {
        if (!this.classList.contains('p-name')) formatThis(this);
        updateChart();
        calculateMultiBEP();
        saveToLocal();
    });
    input.addEventListener('change', () => {
        calculateMultiBEP();
        saveToLocal();
    });
});

window.onload = () => {
    loadFromLocal();
    updateChart();
    const tbody = document.getElementById('multiProductBody');
    if (tbody && tbody.children.length === 0) {
        const examples = [
            { nome: "Scarpe Eleganti", prezzo: "120,00", costo: "50,00", mix: "20" },
            { nome: "Scarpe Sportive", prezzo: "40,00", costo: "10,00", mix: "80" }
        ];
        examples.forEach(ex => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" class="input-financial p-name" value="${ex.nome}" onblur="saveToLocal()"></td>
                <td><input type="text" class="input-financial m-price" value="${ex.prezzo}" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
                <td><input type="text" class="input-financial m-var" value="${ex.costo}" onblur="formatThis(this); saveToLocal(); calculateMultiBEP();"></td>
                <td><input type="number" class="input-financial m-mix" value="${ex.mix}" onchange="saveToLocal(); calculateMultiBEP();"></td>
                <td><button onclick="this.parentElement.parentElement.remove(); saveToLocal(); calculateMultiBEP();" style="background:none; border:none; color:red; cursor:pointer;">✖</button></td>
            `;
            tbody.appendChild(row);
        });
    }
    if (document.getElementById('fixedCostsMulti').value !== "") calculateMultiBEP();
};

// Listener PDF Standard
document.getElementById('pdfBtn').addEventListener('click', async () => {
    const element = document.getElementById('main');
    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const { jsPDF } = window.jspdf;
    const imgData = canvas.toDataURL("image/jpeg", 0.8);
    const pdf = new jsPDF('p', 'mm', [210, (canvas.height * 210) / canvas.width]);
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save(`BEP_${new Date().toISOString().split('T')[0]}.pdf`);
});

document.getElementById('pdfBtnMulti').addEventListener('click', exportMultiToPDF);
// #endregion