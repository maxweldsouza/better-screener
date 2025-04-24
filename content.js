(function () {
    const MoreSelector = `#metrics-dropdown > button`
    const salesAndMarginSelector = `button[value="GPM-OPM-NPM-Quarter Sales"]`
    const PESelector = `button[value="Price to Earning-Median PE-EPS"]`
    const MaxPeriodSelector = `button[value="10000"]`

    let selectedLabel = 'Net Profit'
    let logScale = false
    let chart

    const tableSelectors = {
        'Net Profit': '#profit-loss',
        'Operating Profit': '#profit-loss',
        'Sales': '#profit-loss',
        'Borrowings': '#balance-sheet',
        'Working Capital Days': '#ratios',
    }
    const alternateLabels = {
        'Sales': 'Revenue',
        'Operating Profit': 'Financing Profit',
    }

    function clickButton(selector, delay = 0) {
        setTimeout(() => {
            var btn = document.querySelector(selector);
            if (btn) {
                btn.click();
                console.log("Clicked:", selector);
            } else {
                console.log("Button not found:", selector);
            }
        }, delay);
    }

    function getTableRowData(table, label) {
        const rows = table.querySelectorAll("tbody tr");
        let rowData = [];
        rows.forEach(row => {
            const firstCell = row.querySelector("td.text");
            if (firstCell && firstCell.innerText.includes(label)) {
                rowData = Array.from(row.querySelectorAll("td:not(.text)"))
                    .map(td => td.innerText.replace(/,/g, "").trim())
                    .map(value => value ? parseFloat(value) : null);
            }
        });
        return rowData
    }

    function getLabels(table) {
        let labels;
        const headerCells = table.querySelectorAll("thead tr th");
        labels = Array.from(headerCells).slice(1).map(th => th.innerText.trim());
        return labels
    }

    function renderToolbar(container) {
        // Create a new element using template string
        const toolbar = `
            <div class="flex flex-row " style="width:100% ;justify-content: space-between; align-items: center;">
            <div class="options flex">
                <button type="button" class="better-screener-button active">Net Profit</button>
                <button type="button" class="better-screener-button">Operating Profit</button>
                <button type="button" class="better-screener-button">Sales</button>
                <button type="button" class="better-screener-button">NPM</button>
                <button type="button" class="better-screener-button">Borrowings</button>
                <button type="button" class="better-screener-button">Working Capital Days</button>
            </div>
            <label><input class="chart-checkbox" type="checkbox" id="better-screener-log-scale" style="background: rgb(163, 157, 251);"/>Log Scale</label>
            </div>
    `;

        container.insertAdjacentHTML("beforeend", toolbar);
    }

    function createChart(topElement) {
        const canvas = document.createElement('canvas');

        const container = document.createElement('div')
        container.setAttribute('class', 'card card-large')
        container.setAttribute('style', 'height:480px')

        renderToolbar(container)
        container.appendChild(canvas)


        topElement.insertAdjacentElement("afterend", container)

        const ctx = canvas.getContext('2d');

        chart = new Chart(ctx, {
            type: 'bar',
            options: {
                plugins: {
                    legend: {
                        display: false
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            display: false // Remove vertical gridlines
                        }
                    },
                    y: {
                        grid: {
                            display: true // Keep horizontal gridlines
                        },
                        beginAtZero: true
                    }
                },
                layout: {
                    padding: {
                        left: 30,
                        right: 30,
                        top: 0,
                        bottom: 90
                    }
                },
            }
        });

    }

    function plotData(label) {
        if (label === 'NPM') {
            plotNpm()
            return
        }
        const [data, labels] = getData(label)
        renderPlot(label, data, labels)
    }

    function plotNpm() {
        const [netProfit, labels] = getData('Net Profit')
        const [sales, _] = getData('Sales')
        const npm = sales.map((s, i) => netProfit[i] / s * 100)

        renderPlot('NPM %', npm, labels)
    }

    function getData(label) {
        const tableSelector = tableSelectors[label]
        const tableElement = document.querySelector(tableSelector);
        if (!tableElement) {
            console.error("Table not found.");
            return;
        }
        let data = getTableRowData(tableElement, label)
        if (!data.length) {
            label = alternateLabels[label]
            data = getTableRowData(tableElement, label)
        }
        const labels = getLabels(tableElement)

        return [data, labels]
    }

    function renderPlot(label, data, labels) {
        if (!data.length) return console.error('Empty data');
        chart.data = {
            labels: labels,
            datasets: [{
                label: label,
                data: data,
                fill: true,
                backgroundColor: '#a39dfb'
            }]
        }
        chart.options.scales.y.type = logScale ? 'logarithmic' : 'linear';
        chart.update()
    }

    function setEventHandlers() {
        document.querySelectorAll('.better-screener-button').forEach(button => {
            button.addEventListener('click', (e) => {
                selectedLabel = e.target.innerText
                document.querySelectorAll('.better-screener-button').forEach(b => b.classList.remove('active'))
                button.classList.add('active')
                plotData(selectedLabel)
            })

        })
        document.querySelector('#better-screener-log-scale').addEventListener('click', e => {
            logScale = e.target.checked
            chart.options.scales.y.type = logScale ? 'logarithmic' : 'linear';
            chart.update()
        })
    }

    function highlightSectors() {
        // Select all links that match multiple conditions
        const links = document.querySelectorAll('a.bordered');

        const sectors = [
            "Aerospace & Defence",
            // "Agro Chemicals",
            // "Air Transport Service",
            // "Alcoholic Beverages",
            "Auto Ancillaries",
            "Automobile",
            "Banks",
            "Bearings",
            "Cables",
            "Capital Goods - Electrical Equipment",
            "Capital Goods-Non Electrical Equipment",
            // "Castings, Forgings & Fastners",
            // "Cement",
            // "Cement - Products",
            "Ceramic Products",
            // "Chemicals",
            // "Computer Education",
            "Construction",
            "Consumer Durables",
            // "Credit Rating Agencies",
            // "Crude Oil & Natural Gas",
            // "Diamond, Gems and Jewellery",
            "Diversified",
            // "Dry cells",
            // "E-Commerce/App based Aggregator",
            // "Edible Oil",
            // "Education",
            "Electronics",
            "Engineering",
            // "Entertainment",
            // "ETF",
            // "Ferro Alloys",
            // "Fertilizers",
            "Finance",
            "Financial Services",
            "FMCG",
            // "Gas Distribution",
            // "Glass & Glass Products",
            "Healthcare",
            // "Hotels & Restaurants",
            "Infrastructure Developers & Operators",
            // "Infrastructure Investment Trusts",
            "Insurance",
            "IT - Hardware",
            "IT - Software",
            // "Leather",
            "Logistics",
            "Marine Port & Services",
            // "Media - Print/Television/Radio",
            // "Mining & Mineral products",
            "Miscellaneous",
            // "Non Ferrous Metals",
            // "Oil Drill/Allied",
            // "Online Media",
            // "Packaging",
            // "Paints/Varnish",
            // "Paper",
            // "Petrochemicals",
            "Pharmaceuticals",
            // "Plantation & Plantation Products",
            // "Plastic products",
            // "Plywood Boards/Laminates",
            "Power Generation & Distribution",
            "Power Infrastructure",
            // "Printing & Stationery",
            // "Quick Service Restaurant",
            "Railways",
            // "Readymade Garments/ Apparells",
            "Real Estate Investment Trusts",
            "Realty",
            // "Refineries",
            // "Refractories",
            // "Retail",
            "Sanitaryware",
            "Ship Building",
            // "Shipping",
            // "Steel",
            // "Stock/ Commodity Brokers",
            // "Sugar",
            // "Telecom-Handsets/Mobile",
            "Telecomm Equipment & Infra Services",
            "Telecomm-Service",
            // "Textiles",
            // "Tobacco Products",
            // "Trading",
            // "Tyres",
        ]
        links.forEach(link => {
            if (sectors.includes(link.textContent.trim())) {
                link.style.backgroundColor = "#fae694";
                link.style.color = "#000";
            }
        });
    }
    function plotCharts() {
        clickButton(MoreSelector);
        clickButton(salesAndMarginSelector, 100);
        const topElement = document.getElementById("chart");
        createChart(topElement)
        plotData(selectedLabel);
        chart.update()
        setEventHandlers()
    }

    // Wait for the page to fully load
    window.addEventListener("load", function () {
        if (window.location.pathname.startsWith('/company')) {
            plotCharts()
        }

        if (window.location.pathname.startsWith('/explore/')) {
            highlightSectors()

        }
    });
})();