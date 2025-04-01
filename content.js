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

    function getNetProfitDataAndPlot() {
        const table = document.querySelector("#profit-loss table.data-table");
        if (!table) {
            console.error("Profit & Loss table not found.");
            return;
        }

        const rows = table.querySelectorAll("tbody tr");
        let labels = [];
        let netProfitData = [];

        // Extract labels from table header
        const headerCells = table.querySelectorAll("thead tr th");
        labels = Array.from(headerCells).slice(1).map(th => th.innerText.trim());

        // Find Net Profit row
        rows.forEach(row => {
            const firstCell = row.querySelector("td.text");
            if (firstCell && firstCell.innerText.includes("Net Profit")) {
                netProfitData = Array.from(row.querySelectorAll("td:not(.text)"))
                    .map(td => td.innerText.replace(/,/g, "").trim())
                    .map(value => value ? parseFloat(value) : null);
            }
        });

        if (netProfitData.length === 0) {
            console.error("Net Profit row not found.");
            return;
        }

        // Create a canvas element dynamically
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'better-screener-canvas')

        const container = document.createElement('div')
        container.setAttribute('class', 'card card-large')
        container.setAttribute('style', 'height:640px')
        container.appendChild(canvas)



        const topElement = document.getElementById("top");
        topElement.insertAdjacentElement("afterend", container)
        const ctx = canvas.getContext('2d');

        let chart
        // Create the chart using the preloaded Chart.js
            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Net Profit (Rs. Crores)',
                        data: netProfitData,
                        fill: true,
                        fillColor: 'blue'
                    }]
                },
                options: {
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
                        padding: 10
                    },
                }
            });

    }


    // Wait for the page to fully load
    window.addEventListener("load", function() {
        if (!window.location.pathname.startsWith('/company')) return
        clickButton(MoreSelector);
        clickButton(salesAndMarginSelector, 100);
        getNetProfitDataAndPlot();

    });
})();