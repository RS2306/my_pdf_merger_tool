document.getElementById("mergeBtn").addEventListener("click", async function () {
    let files = document.getElementById("pdfFiles").files;

    if (files.length < 2) {
        alert("Please select at least two PDF files to merge.");
        return;
    }

    document.getElementById("status").textContent = "Merging files...";

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();

        for (let file of files) {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedPdfBytes = await mergedPdf.save();

        // Create a Blob and generate a download link
        const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        let link = document.getElementById("downloadLink");
        link.href = url;
        link.style.display = "block";
        link.textContent = "Download Merged PDF";
        document.getElementById("status").textContent = "Merge successful!";
    } catch (error) {
        document.getElementById("status").textContent = "Error merging files.";
        alert("An error occurred: " + error.message);
    }
});


// ---------------- PWA INSTALL SUPPORT ----------------
let deferredInstallPrompt = null;
const installBtn = document.getElementById("installBtn");

function isRunningStandalone() {
    return window.matchMedia("(display-mode: standalone)").matches ||
           window.navigator.standalone === true ||
           document.referrer.startsWith("android-app://");
}

function showInstallButton() {
    if (installBtn && !isRunningStandalone()) {
        installBtn.style.display = "block";
    }
}

// Android / Windows / supported Chromium browsers
window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    showInstallButton();
});

if (installBtn) {
    installBtn.addEventListener("click", async () => {
        // Native install prompt available (Android/Windows/Chrome/Edge)
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            console.log(`PWA install choice: ${outcome}`);
            deferredInstallPrompt = null;
            installBtn.style.display = "none";
            return;
        }

        // iPhone/iPad does not expose beforeinstallprompt.
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) {
            showIOSInstallHelp();
            return;
        }

        // If already installed or browser does not expose an install prompt.
        if (isRunningStandalone()) {
            installBtn.style.display = "none";
        } else {
            alert("To install this app, use your browser's Install App / Add to Home Screen option from the browser menu.");
        }
    });
}

function showIOSInstallHelp() {
    let help = document.getElementById("installHelp");
    if (!help) {
        help = document.createElement("div");
        help.id = "installHelp";
        help.className = "install-help";
        installBtn.insertAdjacentElement("afterend", help);
    }
    help.innerHTML = "<strong>Install on iPhone/iPad</strong><br>Tap the <strong>Share</strong> button in Safari, then choose <strong>Add to Home Screen</strong> and tap <strong>Add</strong>.";
    help.style.display = "block";
}

// Keep the button visible on iOS when not already installed.
window.addEventListener("load", () => {
    if (!isRunningStandalone()) {
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) showInstallButton();
    }
});

window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    if (installBtn) installBtn.style.display = "none";
    const help = document.getElementById("installHelp");
    if (help) help.remove();
});
