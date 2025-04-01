(function() {
    const MoreSelector = `#metrics-dropdown > button`
    const salesAndMarginSelector = `button[value="GPM-OPM-NPM-Quarter Sales"]`
    const PESelector = `button[value="Price to Earning-Median PE-EPS"]`
    const MaxPeriodSelector = `button[value="10000"]`
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

    function getTableRowData (table, label) {
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

    function getLabels (table) {
        let labels;
        const headerCells = table.querySelectorAll("thead tr th");
        labels = Array.from(headerCells).slice(1).map(th => th.innerText.trim());
        return labels
    }

    function renderToolbar(container) {
        // Create a new element using template string
        const toolbar = `
        <div class=" flex">
            <div class="options flex">
                <button type="button" class="better-screener-button active">Net Profit</button>
                <button type="button" class="better-screener-button">Sales</button>
            </div>
        </div>
    `;

        container.insertAdjacentHTML("beforeend", toolbar);
    }

    function plotData(label, labels, data, topElement) {
        // Create a canvas element dynamically
        const canvas = document.createElement('canvas');

        const container = document.createElement('div')
        container.setAttribute('class', 'card card-large')
        container.setAttribute('style', 'height:480px')

        const header = document.createElement('h2')
        header.innerText = label
        container.appendChild(header)
        container.appendChild(canvas)


        topElement.insertAdjacentElement("afterend", container)
        const ctx = canvas.getContext('2d');

        let chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: data,
                    fill: true,
                    backgroundColor: '#a39dfb'
                }]
            },
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
    function getNetProfitDataAndPlot() {
        const table = document.querySelector("#profit-loss table.data-table");
        if (!table) {
            console.error("Profit & Loss table not found.");
            return;
        }
        const labels = getLabels(table)
        const netProfitData = getTableRowData(table, "Net Profit")
        const salesData = getTableRowData(table, "Sales")

        if (netProfitData.length === 0) {
            console.error("Net Profit row not found.");
            return;
        }

        const topElement = document.getElementById("top");
        plotData('Sales', labels, salesData, topElement)
        plotData('Net Profit', labels, netProfitData, topElement)
    }


    // Wait for the page to fully load
    window.addEventListener("load", function() {
        if (!window.location.pathname.startsWith('/company')) return
        clickButton(MoreSelector);
        clickButton(salesAndMarginSelector, 100);
        getNetProfitDataAndPlot();

    });
})();