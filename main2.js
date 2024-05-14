class TableJs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        
        this.pizzas = [
            { name: "Marinara", price: 8.5, ingredients: "Sauce tomate, ail, origan" },
            { name: "Marguerite", price: 9, ingredients: "Sauce tomate, mozzarella fior di latte, basilic" },
            { name: "Napolitaine", price: 11.1, ingredients: "Sauce tomate, mozzarella fior di latte, anchois, câpres, origan" },
            { name: "Reine", price: 11.2, ingredients: "Sauce tomate, mozzarella fior di latte, champignons de Paris, jambon cuit, origan" },
            { name: "4 Fromages", price: 14.5, ingredients: "Sauce tomate, mozzarella fior di latte, chevre, gorgonzola, parmesan" },
            { name: "4 Saisons", price: 14, ingredients: "Sauce tomate, mozzarella fior di latte, jambon cuit, champignons de Paris, olives, artichauts, origan" },
            { name: "Végétarienne", price: 13, ingredients: "Sauce tomate, mozzarella fior di latte, aubergines, poivrons grillés, olives, courgettes" }
        ];

        this.styles = `
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
        `;
        this.render();
    }

    connectedCallback() {
        this.initSearch();
        this.initSort();

        this.shadowRoot.getElementById('addPizzaForm').addEventListener('submit', event => {
            event.preventDefault(); 
            this.addPizza(); 
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            ${this.styles}
            
            <table>
                <thead>
                    <tr>
                        <th><input type="text" placeholder="Search..."></th>
                        <th><input type="text" placeholder="Search..."></th>
                        <th><input type="text" placeholder="Search..."></th>
                    </tr>
                    <tr>
                        <th data-type="string">Nom</th>
                        <th data-type="number">Prix (€)</th>
                        <th data-type="string">Ingredients</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.pizzas.map(pizza => `
                        <tr>
                            <td>${pizza.name}</td>
                            <td>${pizza.price.toFixed(2)}</td>
                            <td>${pizza.ingredients}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div>
                <form id="addPizzaForm">
                    <div class="piu">
                        <label for="pizzaName">Nom</label>
                        <input type="text" id="pizzaName" required>
                    </div>
                    <div class="piu">
                        <label for="pizzaPrice">Prix (€)</label>
                        <input type="number" id="pizzaPrice" step="0.01" min="0" required>
                    </div>
                    <div class="piu">
                        <label for="pizzaIngredients">Ingredients</label>
                        <input type="text" id="pizzaIngredients" required>
                    </div>
                    <div class="piu">
                        <button type="submit" style="padding:8px; background-color: #4CAF50; color: white; border-radius: 8px; border: none;">Ajouter une Pizza</button>
                    </div>
                </form>
            </div>
        `;
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
