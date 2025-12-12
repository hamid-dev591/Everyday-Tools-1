// العناصر العامة
const modal = document.getElementById("tool-window");
const closeBtn = document.querySelector(".close");
const toolArea = document.getElementById("tool-area");
const toolCards = document.querySelectorAll('.tool-card');

// --------------------------------------------------
// I. وظائف بناء محتوى الأدوات وإعداد المستمعات
// --------------------------------------------------

// 1. عداد النصوص (Text Counter)
function initTextCounter() {
    toolArea.innerHTML = `
        <h2 id="modal-title">عداد النصوص</h2>
        <textarea id="textInput" placeholder="اكتب هنا لبدء العد..." rows="8"></textarea>
        <div id="result">الكلمات: 0 | الأحرف: 0</div>
    `;

    const textInput = document.getElementById("textInput");
    // استخدام 'input' لعد فوري دون الحاجة لزر
    textInput.addEventListener("input", countText);
    countText(); // العد الأولي إذا كان هناك نص محفوظ
}

function countText() {
    const textInput = document.getElementById("textInput");
    const resultElement = document.getElementById("result");
    const text = textInput.value;
    // تصفية السلاسل الفارغة من المصفوفة
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    resultElement.innerHTML = 
        `الكلمات: **${words}** | الأحرف: **${text.length}**`;
}

// 2. مولد كلمات المرور (Password Generator)
function initPasswordGen() {
    toolArea.innerHTML = `
        <h2 id="modal-title">مولد كلمات المرور</h2>
        <div id="passResult">انقر على توليد</div>
        <button id="generateBtn">توليد كلمة مرور جديدة</button>
    `;
    document.getElementById("generateBtn").addEventListener("click", generatePassword);
}

function generatePassword() {
    // يمكن جعل طول كلمة المرور خياراً، لكن 16 هو معيار جيد
    const length = 16;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    
    let pass = Array.from({ length: length }, () => 
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
    
    document.getElementById("passResult").innerText = pass;
}

// 3. مولد رمز QR (QR Generator)
function initQrGen() {
    toolArea.innerHTML = `
        <h2 id="modal-title">مولد رمز QR</h2>
        <input type="text" id="qrText" placeholder="النص أو الرابط لتحويله">
        <button id="qrGenerateBtn">توليد الرمز</button>
        <div id="qrOutput"></div>
    `;
    
    const qrText = document.getElementById("qrText");
    const qrGenerateBtn = document.getElementById("qrGenerateBtn");
    
    qrGenerateBtn.addEventListener("click", makeQR);
    qrText.addEventListener("input", makeQR); // توليد فوري أثناء الكتابة
}

function makeQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrOutput = document.getElementById("qrOutput");
    
    if (text.length === 0) {
        qrOutput.innerHTML = "";
        return;
    }

    // استخدام حجم أصغر افتراضياً 150x150
    const url = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(text);
    qrOutput.innerHTML = `<img src="${url}" alt="QR Code for ${text}">`;
}

// 4. منسق JSON (JSON Formatter)
function initJsonFormatter() {
    toolArea.innerHTML = `
        <h2 id="modal-title">منسق JSON</h2>
        <textarea id="jsonInput" placeholder="الصق بيانات JSON هنا..." rows="10"></textarea>
        <button id="jsonFormatBtn">تنسيق وتجميل JSON</button>
        <pre id="jsonResult">النتيجة ستظهر هنا...</pre>
    `;
    document.getElementById("jsonFormatBtn").addEventListener("click", formatJSON);
}

function formatJSON() {
    try {
        const input = document.getElementById("jsonInput").value;
        const parsed = JSON.parse(input);
        // تنسيق JSON بمسافة بادئة (Indentation) 4
        document.getElementById("jsonResult").innerText = JSON.stringify(parsed, null, 4);
        document.getElementById("jsonResult").style.color = 'white';
    } catch (err) {
        document.getElementById("jsonResult").innerText = "❌ JSON غير صالح. يرجى التحقق من الأقواس وعلامات الاقتباس.";
        document.getElementById("jsonResult").style.color = '#ff6969'; // لون خطأ
    }
}

// 5. المفكرة (Notes) - استخدام Local Storage
function initNotes() {
    const saved = localStorage.getItem("notes") || "";
    toolArea.innerHTML = `
        <h2 id="modal-title">مفكرتك الخاصة (حفظ محلي)</h2>
        <textarea id="notesBox" rows="15" placeholder="ابدأ بكتابة ملاحظاتك. سيتم حفظها تلقائياً عند النقر على حفظ">${saved}</textarea>
        <button id="saveNotesBtn">حفظ الملاحظات</button>
    `;
    document.getElementById("saveNotesBtn").addEventListener("click", saveNotes);
}

function saveNotes() {
    localStorage.setItem("notes", document.getElementById("notesBox").value);
    // إعطاء ملاحظات للمستخدم
    const saveBtn = document.getElementById("saveNotesBtn");
    saveBtn.innerText = "✓ تم الحفظ!";
    setTimeout(() => {
        saveBtn.innerText = "حفظ الملاحظات";
    }, 1500);
}

// 6. منتقي الألوان (Color Picker)
function initColorPicker() {
    toolArea.innerHTML = `
        <h2 id="modal-title">منتقي الألوان</h2>
        <p>اختر لوناً: </p>
        <input type="color" id="pickColor" value="#ff69ff">
        <div id="colorCode">#FF69FF</div>
    `;

    const colorInput = document.getElementById("pickColor");
    const colorCode = document.getElementById("colorCode");

    colorInput.addEventListener("input", e => {
        // تحديث النص واللون الفوري
        const color = e.target.value.toUpperCase();
        colorCode.innerText = color;
        colorCode.style.backgroundColor = color;
        colorCode.style.color = (color === "#000000" || color === "#000") ? 'white' : 'black';
    });
}

// --------------------------------------------------
// II. وظيفة إدارة الأدوات الرئيسية
// --------------------------------------------------

// كائن لربط مفتاح الأداة بالدالة المنفذة
const toolLoaders = {
    textCounter: initTextCounter,
    passwordGen: initPasswordGen,
    qrGen: initQrGen,
    jsonFormatter: initJsonFormatter,
    notes: initNotes,
    colorPicker: initColorPicker,
};

function openTool(tool) {
    // التحقق أولاً من وجود دالة محملة لهذه الأداة
    if (toolLoaders[tool]) {
        // فتح المودال ثم تحميل المحتوى
        modal.classList.remove("hidden");
        toolLoaders[tool]();
    } else {
        console.error(`Tool loader for "${tool}" not found!`);
        modal.classList.add("hidden");
    }
}

// --------------------------------------------------
// III. إدارة أحداث الصفحة
// --------------------------------------------------

// 1. النقر على بطاقات الأدوات
toolCards.forEach(card => {
    card.addEventListener('click', () => {
        openTool(card.dataset.tool);
    });
});

// 2. إغلاق المودال
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));

// إغلاق المودال عند النقر خارج المحتوى (أو على مفتاح ESC)
modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
    }
});