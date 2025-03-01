(function() {
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
        clickButton('button[value="10000"]');
        clickButton('button[value="Price to Earning-Median PE-EPS"]');
    });
})();