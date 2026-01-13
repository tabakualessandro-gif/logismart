// 1. Inizializzazione dati
let magazzino = JSON.parse(localStorage.getItem('datiMagazzino')) || [];

function salvaDati() {
    localStorage.setItem('datiMagazzino', JSON.stringify(magazzino));
}

// --- FUNZIONI APERTURA/CHIUSURA ---
function apriInserimento() { document.getElementById('modal-inserimento').style.display = 'flex'; }
function chiudiModal() { document.getElementById('modal-inserimento').style.display = 'none'; }

function chiudiMagazzino() { document.getElementById('full-inventory-view').style.display = 'none'; }
function chiudiRicerca() { document.getElementById('full-search-view').style.display = 'none'; }
function chiudiValore() { document.getElementById('full-value-view').style.display = 'none'; }

// --- 2. SALVA PRODOTTO ---
function salvaProdotto() {
    const nome = document.getElementById('nome-prodotto').value;
    const qta = parseInt(document.getElementById('quantita-prodotto').value);
    const prezzo = parseFloat(document.getElementById('prezzo-prodotto').value);
    const soglia = parseInt(document.getElementById('soglia-prodotto').value) || 0;

    if (nome && !isNaN(qta) && !isNaN(prezzo)) {
        magazzino.push({ nome, qta, prezzo, soglia });
        salvaDati();
        alert("✅ Prodotto aggiunto!");
        chiudiModal();
        // Reset campi
        document.getElementById('nome-prodotto').value = "";
        document.getElementById('quantita-prodotto').value = "";
        document.getElementById('prezzo-prodotto').value = "";
        document.getElementById('soglia-prodotto').value = "";
    } else {
        alert("❌ Inserisci dati validi!");
    }
}

// --- 3. MOSTRA TABELLA (Leggi Magazzino) ---
function mostraTabella() {
    const overlay = document.getElementById('full-inventory-view');
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = "";

    if (magazzino.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Magazzino vuoto</td></tr>";
    } else {
        magazzino.forEach(p => {
            const alertClass = p.qta <= p.soglia ? "style='background-color: #fff1f0; color: #cf1322;'" : "";
            const badge = p.qta <= p.soglia ? "⚠️" : "";
            tbody.innerHTML += `
                <tr ${alertClass}>
                    <td>${badge} <strong>${p.nome.toUpperCase()}</strong></td>
                    <td>${p.qta}</td>
                    <td>€ ${p.prezzo.toFixed(2)}</td>
                    <td>€ ${(p.qta * p.prezzo).toFixed(2)}</td>
                </tr>`;
        });
    }
    overlay.style.display = 'block';
}

// --- 4. RICERCA ---
function apriRicerca() {
    document.getElementById('full-search-view').style.display = 'block';
    document.getElementById('input-cerca-moderno').focus();
}

function eseguiRicerca() {
    const query = document.getElementById('input-cerca-moderno').value.toLowerCase();
    const area = document.getElementById('search-result-area');
    const risultati = magazzino.filter(p => p.nome.toLowerCase().includes(query));

    if (query === "") { area.innerHTML = ""; return; }

    if (risultati.length > 0) {
        let html = `<table class="minimal-table"><thead><tr><th>PRODOTTO</th><th>Q.TÀ</th><th>PREZZO</th></tr></thead><tbody>`;
        risultati.forEach(p => {
            html += `<tr><td>${p.nome}</td><td>${p.qta}</td><td>€ ${p.prezzo.toFixed(2)}</td></tr>`;
        });
        area.innerHTML = html + "</tbody></table>";
    } else {
        area.innerHTML = "<p>Nessun risultato</p>";
    }
}

// --- 5. TOTALE ---
function calcolaTotale() {
    let totale = 0;
    let pezzi = 0;
    magazzino.forEach(p => {
        totale += (p.qta * p.prezzo);
        pezzi += p.qta;
    });
    document.getElementById('valore-numerico').innerText = "€ " + totale.toFixed(2);
    document.getElementById('dettaglio-valore').innerHTML = `Prodotti totali: ${pezzi}`;
    document.getElementById('full-value-view').style.display = 'block';
}

// --- 6. SVUOTA ---
function svuotaMagazzino() {
    if (confirm("Sei sicuro? !Attenzione, questa azione è irreversibile!")) {
        magazzino = [];
        localStorage.removeItem('datiMagazzino');
        location.reload();
    }
}