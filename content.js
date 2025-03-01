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

    // Wait for the page to fully load
    window.addEventListener("load", function() {
        if (!window.location.pathname.startsWith('/company')) return
        clickButton(MoreSelector);
        clickButton(salesAndMarginSelector, 100);
    });
})();