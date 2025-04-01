(function() {
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
            <div class="flex flex-row " style="width:100% ;justify-content: space-between; align-items: center;">
            <div class="options flex">
                <button type="button" class="better-screener-button active">Net Profit</button>
                <button type="button" class="better-screener-button">Operating Profit</button>
                <button type="button" class="better-screener-button">Sales</button>
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
        const tableSelector = tableSelectors[label]
        const tableElement = document.querySelector(tableSelector);
        if (!tableElement) {
            console.error("Table not found.");
            return;
        }
        const data = getTableRowData(tableElement, label)
        const labels = getLabels(tableElement)
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


    // Wait for the page to fully load
    window.addEventListener("load", function() {
        if (!window.location.pathname.startsWith('/company')) return
        clickButton(MoreSelector);
        clickButton(salesAndMarginSelector, 100);
        const topElement = document.getElementById("top");
        createChart(topElement)
        plotData(selectedLabel);
        chart.update()
        setEventHandlers()

    });
})();