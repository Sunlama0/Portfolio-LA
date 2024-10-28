let accordeon = document.querySelector(".accordeon");

accordeon.addEventListener("click", (e) => {
    const activePanel = e.target.closest(".accordeon__panel");
    if (!activePanel) return;
    toggleaccordeon(activePanel);
});

const toggleaccordeon = (panelToActivate) => {
    const activeButton = panelToActivate.querySelector("button");
    const activePanel = panelToActivate.querySelector(".accordeon__content");
    const activePanelIsOpened = activeButton.getAttribute("aria-expanded");

    if (activePanelIsOpened === "true") {
        activeButton.setAttribute("aria-expanded", false);
        activePanel.setAttribute("aria-hidden", true);
    } else {
        activeButton.setAttribute("aria-expanded", true);
        activePanel.setAttribute("aria-hidden", false);
    }
};
