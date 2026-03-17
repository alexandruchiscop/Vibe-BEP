# Vibe-BEP# 📈 Business Break-Even Analysis
### Strumento Strategico per l'Analisi dei Punti di Pareggio

Questa piccola Web-App nasce per rispondere a una domanda fondamentale per ogni business: *"Quante unità devo vendere per iniziare a produrre profitto?"* A differenza dei semplici calcolatori online, questo strumento permette una simulazione dinamica basata su scenari comparativi e mix di vendita complessi.

---

## 🎯 Obiettivi dello Strumento

La Web-App è stata progettata per supportare il processo decisionale in tre aree chiave:

### 1. Simulazione di Scenario (Analisi "What-If")
Consente di confrontare istantaneamente due strategie di prezzo differenti. Aiuta a visualizzare come una variazione del prezzo di vendita influenzi il volume di pareggio, permettendo di scegliere il posizionamento di mercato più sostenibile.

### 2. Gestione del Mix di Vendita (Multi-Prodotto)
Nelle realtà aziendali moderne, raramente si vende un solo prodotto. Questo modulo calcola il **Punto di Pareggio Ponderato**, distribuendo i costi fissi su un intero catalogo prodotti in base alla loro incidenza percentuale sulle vendite totali.

### 3. Reporting per Stakeholder
La funzione di esportazione integrata permette di trasformare i calcoli in report PDF immediati, ideali per essere condivisi durante riunioni di budget o presentazioni di business plan.

---

## 📋 Caratteristiche Tecniche e Logica Finanziaria

* **Pianificazione Dinamica:** Calcolo in tempo reale del margine di contribuzione unitario e totale.
* **Analisi della Sensibilità:** Una tabella dedicata mostra l'utile o la perdita prevista al variare dei volumi (dal 50% al 150% del target di pareggio).
* **Integrità del Dato:** Implementazione di un sistema di persistenza locale che garantisce la disponibilità dei dati inseriti anche dopo la chiusura del browser.
* **Precisione Finanziaria:** Algoritmi basati sulla formula del Break-Even Point: $Q = \frac{FC}{P - VC}$, con arrotondamento cautelativo all'unità superiore.

---

## 🛠️ Note di Sviluppo

Il progetto è stato sviluppato con un approccio **User-Centric**, privilegiando la pulizia dell'interfaccia e la velocità di inserimento dati. 

* **Design Professionale:** Interfaccia pulita per mantenere il focus sui dati numerici.
* **Formattazione Automatica:** Gestione intelligente dei decimali e delle valute per evitare errori di input.
* **Architettura Modulare:** Il codice è strutturato in blocchi logici (Utility, Motore Standard, Motore Multi-Mix, Export) per consentire future integrazioni con sistemi gestionali (API).

---

## 🚀 Come Utilizzarlo

1.  **Analisi Standard:** Utile per lanci o analisi di singoli prodotti o servizi.
2.  **Analisi Multi-Mix:** Indispensabile per attività con inventario diversificato (Retail, E-commerce, Ristorazione).
3.  **Output:** Utilizza il tasto "Scarica Report" per generare la documentazione a supporto delle tue analisi finanziarie.

---
*Realizzato per trasformare dati complessi in decisioni aziendali chiare.*
