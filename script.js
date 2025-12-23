const modal = document.getElementById("tool-window");
const closeBtn = document.querySelector(".close");
const toolArea = document.getElementById("tool-area");
const toolCards = document.querySelectorAll('.tool-card');

// --- 1. عداد النصوص ---
function initTextCounter() {
    toolArea.innerHTML = `<h2>عداد النصوص</h2><textarea id="textInput" rows="8"></textarea><div id="result">الكلمات: 0 | الأحرف: 0</div>`;
    const input = document.getElementById("textInput");
    input.addEventListener("input", () => {
        const words = input.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        document.getElementById("result").innerText = `الكلمات: ${words} | الأحرف: ${input.value.length}`;
    });
}

// --- 2. مولد كلمات المرور ---
function initPasswordGen() {
    toolArea.innerHTML = `<h2>مولد كلمات المرور</h2><div id="passResult">********</div><button id="generateBtn">توليد</button>`;
    document.getElementById("generateBtn").onclick = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pass = Array.from({length: 16}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
        document.getElementById("passResult").innerText = pass;
    };
}

// --- 3. مولد QR ---
function initQrGen() {
    toolArea.innerHTML = `<h2>مولد رمز QR</h2><input type="text" id="qrText" placeholder="أدخل نصاً"><div id="qrOutput"></div>`;
    document.getElementById("qrText").oninput = (e) => {
        if(!e.target.value) return document.getElementById("qrOutput").innerHTML = "";
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(e.target.value)}`;
        document.getElementById("qrOutput").innerHTML = `<img src="${url}" style="margin-top:20px">`;
    };
}

// --- 4. منسق JSON ---
function initJsonFormatter() {
    toolArea.innerHTML = `<h2>منسق JSON</h2><textarea id="jsonInput" rows="8"></textarea><button id="formatBtn">تنسيق</button><pre id="jsonResult" style="background:#000; padding:10px; margin-top:15px; border-radius:10px; text-align:left; overflow:auto"></pre>`;
    document.getElementById("formatBtn").onclick = () => {
        try {
            const parsed = JSON.parse(document.getElementById("jsonInput").value);
            document.getElementById("jsonResult").innerText = JSON.stringify(parsed, null, 4);
        } catch { document.getElementById("jsonResult").innerText = "خطأ في JSON!"; }
    };
}

// --- 5. وقت القراءة ---
function initReadTime() {
    toolArea.innerHTML = `<h2>حاسبة وقت القراءة</h2><textarea id="rIn" rows="8"></textarea><div id="result" class="result-box">وقت القراءة المقدر: 0 دقيقة</div>`;
    document.getElementById("rIn").oninput = (e) => {
        const words = e.target.value.trim().split(/\s+/).filter(w => w).length;
        document.getElementById("result").innerText = `وقت القراءة المقدر: ${Math.ceil(words/200)} دقيقة`;
    };
}

// --- 6. قائمة المهام ---
function initTodoList() {
    toolArea.innerHTML = `<h2>قائمة المهام</h2><input type="text" id="todoIn" placeholder="مهمة جديدة"><button id="addBtn">إضافة</button><ul id="taskList"></ul>`;
    const load = () => {
        const tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
        const list = document.getElementById("taskList");
        list.innerHTML = tasks.map((t, i) => `<li class="todo-item ${t.completed?'completed':''}"><span>${t.text}</span> <button onclick="deleteTask(${i})">حذف</button></li>`).join("");
    };
    document.getElementById("addBtn").onclick = () => {
        const text = document.getElementById("todoIn").value;
        if(!text) return;
        const tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
        tasks.push({text, completed: false});
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
        load();
    };
    window.deleteTask = (i) => {
        const tasks = JSON.parse(localStorage.getItem("todoTasks") || "[]");
        tasks.splice(i, 1);
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
        load();
    };
    load();
}

// --- 7. المفكرة ---
function initNotes() {
    const saved = localStorage.getItem("notes") || "";
    toolArea.innerHTML = `<h2>مفكرتي</h2><textarea id="nBox" rows="10">${saved}</textarea><button id="sBtn">حفظ</button>`;
    document.getElementById("sBtn").onclick = () => {
        localStorage.setItem("notes", document.getElementById("nBox").value);
        alert("تم الحفظ!");
    };
}

// --- 8. منتقي الألوان ---
function initColorPicker() {
    toolArea.innerHTML = `<h2>منتقي الألوان</h2><input type="color" id="pCol" value="#ff69ff"><div id="colorCode">#FF69FF</div>`;
    document.getElementById("pCol").oninput = (e) => {
        document.getElementById("colorCode").innerText = e.target.value.toUpperCase();
        document.getElementById("colorCode").style.background = e.target.value;
    };
}

// --- 9. مولد الوسوم (جديد) ---
function initHashtagGen() {
    toolArea.innerHTML = `<h2>مولد الوسوم</h2><input type="text" id="hIn" placeholder="كلمات مفصولة بمسافة"><button id="hGen">توليد</button><div id="hashtagOutput" class="result-box"></div>`;
    document.getElementById("hGen").onclick = () => {
        const tags = document.getElementById("hIn").value.split(' ').filter(w => w).map(w => `#${w}`).join(' ');
        document.getElementById("hashtagOutput").innerText = tags;
    };
}

// --- 10. موقيت الدول (جديد) ---
function initTimezoneChecker() {
    const zones = [{n:"مكة", v:"Asia/Riyadh"}, {n:"القاهرة", v:"Africa/Cairo"}, {n:"لندن", v:"Europe/London"}, {n:"نيويورك", v:"America/New_York"}];
    let opts = zones.map(z => `<option value="${z.v}">${z.n}</option>`).join('');
    toolArea.innerHTML = `<h2>موقيت الدول</h2><select id="tz">${opts}</select><div id="timezoneOutput" style="font-size:2rem">--:--:--</div>`;
    setInterval(() => {
        const tz = document.getElementById("tz")?.value;
        if(tz) document.getElementById("timezoneOutput").innerText = new Intl.DateTimeFormat('ar-SA', {timeZone: tz, hour:'2-digit', minute:'2-digit', second:'2-digit'}).format(new Date());
    }, 1000);
}

// --- 11. مقاسات الصور (جديد) ---
function initImageResizer() {
    toolArea.innerHTML = `<h2>مقاسات الصور</h2><input type="file" id="f"><select id="s"><option value="1080,1080">Instagram</option><option value="1080,1920">TikTok</option></select><button id="d">تحميل</button><canvas id="c" style="display:none"></canvas>`;
    document.getElementById("d").onclick = () => {
        const file = document.getElementById("f").files[0];
        if(!file) return;
        const img = new Image();
        img.onload = () => {
            const [w, h] = document.getElementById("s").value.split(',');
            const canvas = document.getElementById("c");
            canvas.width = w; canvas.height = h;
            canvas.getContext("2d").drawImage(img, 0, 0, w, h);
            const a = document.createElement('a'); a.download = "hamid_tool.png"; a.href = canvas.toDataURL(); a.click();
        };
        img.src = URL.createObjectURL(file);
    };
}

// --- 12. محول العملات (جديد) ---
function initCurrencyConv() {
    toolArea.innerHTML = `<h2>محول العملات</h2><input type="number" id="v" value="1"><select id="r"><option value="3.75">USD to SAR</option><option value="0.27">SAR to USD</option></select><div id="res" class="result-box">النتيجة: 3.75</div>`;
    const calc = () => document.getElementById("res").innerText = "النتيجة: " + (document.getElementById("v").value * document.getElementById("r").value).toFixed(2);
    document.getElementById("v").oninput = calc;
    document.getElementById("r").onchange = calc;
}

// مدير الأدوات
const toolLoaders = {
    textCounter: initTextCounter, passwordGen: initPasswordGen, qrGen: initQrGen,
    jsonFormatter: initJsonFormatter, readTime: initReadTime, todoList: initTodoList,
    notes: initNotes, colorPicker: initColorPicker, hashtagGen: initHashtagGen,
    timezoneChecker: initTimezoneChecker, imageResizer: initImageResizer, currencyConv: initCurrencyConv
};

toolCards.forEach(card => card.onclick = () => {
    modal.classList.remove("hidden");
    toolLoaders[card.dataset.tool]();
});

closeBtn.onclick = () => modal.classList.add("hidden");
window.onclick = (e) => { if(e.target === modal) modal.classList.add("hidden"); };