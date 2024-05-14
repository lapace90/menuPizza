class TableJs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>

                table {
                    display: block;
                    border-collapse: collapse;
                    border: 2px solid #4CAF50;
                    border-radius: 10px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                
                input {
                    width: 100%;
                    box-sizing: border-box;
                    padding: 8px;
                }

                #addPizzaForm {
                    margin: 50px;
                }
                .piu {
                    padding: 10px;
                }
                
            </style>
            
            <table>
                <thead>
                    <tr>
                        <th><input type="text" placeholder="Search..."></th>
                        <th><input type="text" placeholder="Search..."></th>
                        <th><input type="text" placeholder="Search..."></th>
                    </tr>
                    <tr>
                        <th data-type="string">Nom</th>
                        <th data-type="number">Prix en €</th>
                        <th data-type="string">Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Marinara</td>
                        <td>8.50</td>
                        <td>Sauce tomate, ail, origan</td>
                    </tr>
                    <tr>
                        <td>Marguerite</td>
                        <td>9.00</td>
                        <td>Sauce tomate, mozzarella fior di latte, basilic</td>
                    </tr>
                    <tr>
                        <td>Napolitaine</td>
                        <td>11.10</td>
                        <td>Sauce tomate, mozzarella fior di latte, anchois, câpres, origan</td>
                    </tr>
                    <tr>
                        <td>Reine</td>
                        <td>11.20</td>
                        <td>Sauce tomate, mozzarella fior di latte, champignons de Paris, jambon cuit, origan</td>
                    </tr>
                    <tr>
                        <td>4 Fromages</td>
                        <td>14.50</td>
                        <td>Sauce tomate, mozzarella fior di latte, chevre, gorgonzola, parmesan</td>
                    </tr>
                    <tr>
                        <td>4 Saisons</td>
                        <td>14.00</td>
                        <td>Sauce tomate, mozzarella fior di latte, jambon cuit, champignons de Paris, olives, artichauts, origan</td>
                    </tr>
                    <tr>
                        <td>Végétarienne</td>
                        <td>13.00</td>
                        <td>Sauce tomate, mozzarella fior di latte, aubergines, poivrons grillés, olives, courgettes</td>
                    </tr>
                </tbody>
            </table>

            <div>
                <form id="addPizzaForm">
                    <div class="piu">
                    <label for="pizzaName">Nom:</label>
                    <input type="text" id="pizzaName" required>
                    </div>
                    <div class="piu">
                    <label for="pizzaPrice">Prix (€):</label>
                    <input type="number" id="pizzaPrice" step="0.01" min="0" required>
                    </div>
                    <div class="piu">
                    <label for="pizzaIngredients">Ingredients:</label>
                    <input type="text" id="pizzaIngredients" required>
                    </div>
                    <div class="piu">
                    <button type="submit" style="padding:8px; background-color: green; color: white; border-radius: 8px; border: none;">Ajouter une Pizza</button>
                    </div>
                </form>
            </div>
        `;
    }

    connectedCallback() {
        this.initSearch();
        this.initSort();
        this.shadowRoot.getElementById('addPizzaForm').addEventListener('submit', event => {
            event.preventDefault(); 
            this.addPizza(); 
        });
    }

    addPizza() {
        const name = this.shadowRoot.getElementById('pizzaName').value;
        const price = parseFloat(this.shadowRoot.getElementById('pizzaPrice').value);
        const ingredients = this.shadowRoot.getElementById('pizzaIngredients').value;

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${name}</td>
            <td>${price.toFixed(2)}</td>
            <td>${ingredients}</td>
        `;

        this.shadowRoot.querySelector('tbody').appendChild(newRow);
        this.shadowRoot.getElementById('addPizzaForm').reset();
    }

    initSearch() {
        const inputs = this.shadowRoot.querySelectorAll('input[type="text"]');
        inputs.forEach((input, index) => {
            input.addEventListener('input', () => this.filterTable(index, input.value));
        });
    }

    filterTable(colIndex, query) {
        const rows = this.shadowRoot.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cell = row.cells[colIndex];
            if (cell.textContent.toLowerCase().includes(query.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    initSort() {
        const headers = this.shadowRoot.querySelectorAll('th[data-type]');
        headers.forEach(header => {
            header.addEventListener('click', () => this.sortTable(header));
        });
    }

    sortTable(header) {
        const table = this.shadowRoot.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.rows);
        const colIndex = Array.from(header.parentNode.children).indexOf(header);
        const type = header.dataset.type;
        const isAscending = header.classList.toggle('ascending');
        header.classList.toggle('descending', !isAscending);

        rows.sort((a, b) => {
            const aText = a.cells[colIndex].textContent.trim();
            const bText = b.cells[colIndex].textContent.trim();
            if (type === 'number') {
                return isAscending ? aText - bText : bText - aText;
            } else {
                return isAscending ? aText.localeCompare(bText) : bText.localeCompare(aText);
            }
        });

        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        rows.forEach(row => tbody.appendChild(row));
    }
}

customElements.define('table-js', TableJs);
