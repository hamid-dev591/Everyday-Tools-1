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
    textInput.addEventListener("input", countText);
    countText();
}

function countText() {
    const textInput = document.getElementById("textInput");
    const resultElement = document.getElementById("result");
    const text = textInput.value;
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
    qrText.addEventListener("input", makeQR);
}

function makeQR() {
    const text = document.getElementById("qrText").value.trim();
    const qrOutput = document.getElementById("qrOutput");
    
    if (text.length === 0) {
        qrOutput.innerHTML = "";
        return;
    }

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
        document.getElementById("jsonResult").innerText = JSON.stringify(parsed, null, 4);
        document.getElementById("jsonResult").style.color = 'white';
    } catch (err) {
        document.getElementById("jsonResult").innerText = "❌ JSON غير صالح. يرجى التحقق من الأقواس وعلامات الاقتباس.";
        document.getElementById("jsonResult").style.color = '#ff6969';
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
        const color = e.target.value.toUpperCase();
        colorCode.innerText = color;
        colorCode.style.backgroundColor = color;
        colorCode.style.color = (color === "#000000" || color === "#000") ? 'white' : 'black';
    });
}

// 7. حاسبة وقت القراءة والمقاييس (Reading Time Calculator)
function initReadTimeCalculator() {
    toolArea.innerHTML = `
        <h2 id="modal-title">حاسبة وقت القراءة والمقاييس</h2>
        <p>الصق النص أو اكتبه لحساب المقاييس المختلفة ووقت القراءة المقدر.</p>
        <textarea id="readTextInput" placeholder="الصق النص هنا..." rows="10"></textarea>
        
        <div id="readTimeResult" class="result-box">
            <h4>📊 المقاييس الأساسية</h4>
            <div id="counts">
                <p><strong>الكلمات:</strong> <span id="wordCount">0</span></p>
                <p><strong>الأحرف (بما في ذلك المسافات):</strong> <span id="charCount">0</span></p>
                <p><strong>الأسطر:</strong> <span id="lineCount">0</span></p>
            </div>
            
            <h4>⏱️ وقت القراءة المقدر</h4>
            <div id="timeEstimate">
                <p><strong>الوقت المقدر:</strong> <span id="readTime">0 دقيقة</span></p>
            </div>
            
            <h4>📄 تقدير حجم الصفحة (A4)</h4>
            <div id="pageEstimate">
                <p><strong>عدد الصفحات:</strong> <span id="pageCount">0</span> صفحة</p>
            </div>
        </div>
    `;

    const textInput = document.getElementById("readTextInput");
    textInput.addEventListener("input", calculateReadTime);
    calculateReadTime();
}

function calculateReadTime() {
    const textInput = document.getElementById("readTextInput");
    const text = textInput.value;
    
    // 1. حساب المقاييس الأساسية
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const characters = text.length;
    const lines = text.length > 0 ? (text.split('\n').length) : 0; 

    // 2. حساب وقت القراءة
    const WPM = 250;
    const minutesDecimal = words / WPM;
    const minutes = Math.ceil(minutesDecimal); 
    
    let timeOutput;
    if (words === 0) {
        timeOutput = `0 دقيقة`;
    } else if (minutes < 1) {
        timeOutput = `أقل من دقيقة واحدة`;
    } else {
        timeOutput = `${minutes} دقيقة`;
    }

    // 3. تقدير حجم الصفحة (A4)
    const CHARS_PER_PAGE = 2500;
    const pages = characters > 0 ? (characters / CHARS_PER_PAGE) : 0;
    const pagesRounded = pages.toFixed(1);

    // 4. تحديث الواجهة (DOM)
    document.getElementById('wordCount').innerText = words.toLocaleString('ar');
    document.getElementById('charCount').innerText = characters.toLocaleString('ar');
    document.getElementById('lineCount').innerText = lines.toLocaleString('ar');
    document.getElementById('readTime').innerText = timeOutput;
    document.getElementById('pageCount').innerText = pagesRounded.toLocaleString('ar');
}


// *****************************************************************
// 8. قائمة المهام (To-Do List)
// *****************************************************************

const STORAGE_KEY = 'todoTasks';

function initToDoList() {
    toolArea.innerHTML = `
        <h2 id="modal-title">قائمة المهام (To-Do List)</h2>
        <input type="text" id="newTaskInput" placeholder="أضف مهمة جديدة...">
        <button id="addTaskBtn">إضافة مهمة</button>
        <div id="todoListContainer">
            <ul id="taskList"></ul>
        </div>
    `;

    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTaskInput');
    
    addTaskBtn.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    loadTasks();
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const taskList = document.getElementById('taskList');
    
    if (!taskList) return;

    taskList.innerHTML = '';
    
    tasks.forEach(task => {
        renderTaskItem(task);
    });
}

function renderTaskItem(task) {
    const taskList = document.getElementById('taskList');
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';
    if (task.completed) {
        listItem.classList.add('completed');
    }
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

    const taskText = document.createElement('span');
    taskText.innerText = task.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.className = 'delete-task-btn';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    listItem.appendChild(checkbox);
    listItem.appendChild(taskText);
    listItem.appendChild(deleteBtn);
    taskList.appendChild(listItem);
}

function addTask() {
    const input = document.getElementById('newTaskInput');
    const text = input.value.trim();

    if (text === '') return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
    };

    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    tasks.push(newTask);
    saveTasks(tasks);

    renderTaskItem(newTask);
    input.value = '';
}

function toggleTaskCompletion(id) {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        loadTasks();
    }
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY));
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    loadTasks();
}

// --------------------------------------------------
// II. وظيفة إدارة الأدوات الرئيسية
// --------------------------------------------------

// كائن لربط مفتاح الأداة بالدالة المنفذة (تم التحديث هنا)
const toolLoaders = {
    textCounter: initTextCounter,
    passwordGen: initPasswordGen,
    qrGen: initQrGen,
    jsonFormatter: initJsonFormatter,
    notes: initNotes,
    colorPicker: initColorPicker,
    readTime: initReadTimeCalculator, // الأداة السابقة
    todoList: initToDoList, // الأداة الجديدة
};

function openTool(tool) {
    if (toolLoaders[tool]) {
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