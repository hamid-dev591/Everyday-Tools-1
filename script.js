const modal = document.getElementById("tool-window");
const closeBtn = document.querySelector(".close");
const toolArea = document.getElementById("tool-area");

document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
        openTool(card.dataset.tool);
    });
});

closeBtn.onclick = () => modal.classList.add("hidden");

function openTool(tool) {
    modal.classList.remove("hidden");

    if (tool === "textCounter") {
        toolArea.innerHTML = `
            <h2>Text Counter</h2>
            <textarea id="textInput" placeholder="Write here..."></textarea>
            <button onclick="countText()">Count</button>
            <p id="result"></p>
        `;
    }

    if (tool === "passwordGen") {
        toolArea.innerHTML = `
            <h2>Password Generator</h2>
            <button onclick="generatePassword()">Generate</button>
            <p id="passResult"></p>
        `;
    }

    if (tool === "qrGen") {
        toolArea.innerHTML = `
            <h2>QR Code Generator</h2>
            <input id="qrText" placeholder="Text to convert">
            <button onclick="makeQR()">Generate</button>
            <div id="qrOutput"></div>
        `;
    }

    if (tool === "jsonFormatter") {
        toolArea.innerHTML = `
            <h2>JSON Formatter</h2>
            <textarea id="jsonInput" placeholder="Paste JSON..."></textarea>
            <button onclick="formatJSON()">Format</button>
            <pre id="jsonResult"></pre>
        `;
    }

    if (tool === "notes") {
        let saved = localStorage.getItem("notes") || "";
        toolArea.innerHTML = `
            <h2>Your Notes</h2>
            <textarea id="notesBox">${saved}</textarea>
            <button onclick="saveNotes()">Save</button>
        `;
    }

    if (tool === "colorPicker") {
        toolArea.innerHTML = `
            <h2>Color Picker</h2>
            <input type="color" id="pickColor">
            <p id="colorCode"></p>
        `;

        document.getElementById("pickColor").addEventListener("input", e => {
            document.getElementById("colorCode").innerText = e.target.value;
        });
    }
}

// LOGIC

function countText() {
    let text = document.getElementById("textInput").value;
    let words = text.trim().split(/\s+/).filter(x => x).length;
    document.getElementById("result").innerText =
        `Words: ${words} | Characters: ${text.length}`;
}

function generatePassword() {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    document.getElementById("passResult").innerText = pass;
}

function makeQR() {
    let text = document.getElementById("qrText").value;
    let url = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(text);
    document.getElementById("qrOutput").innerHTML = `<img src="${url}">`;
}

function formatJSON() {
    try {
        let input = document.getElementById("jsonInput").value;
        let parsed = JSON.parse(input);
        document.getElementById("jsonResult").innerText =
            JSON.stringify(parsed, null, 4);
    } catch (err) {
        document.getElementById("jsonResult").innerText = "Invalid JSON ❌";
    }
}

function saveNotes() {
    localStorage.setItem("notes", document.getElementById("notesBox").value);
}
