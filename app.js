// ===== 初期化 =====
let memos = [];
let currentMemoId = null;

const memoList = document.getElementById("memo-list");
const newMemoBtn = document.getElementById("new-memo-btn");
const editorPlaceholder = document.getElementById("editor-placeholder");
const editorForm = document.getElementById("editor-form");
const memoTitle = document.getElementById("memo-title");
const memoBody = document.getElementById("memo-body");
const memoUpdatedAt = document.getElementById("memo-updated-at");
const saveBtn = document.getElementById("save-btn");
const deleteBtn = document.getElementById("delete-btn");

// ===== localStorage の読み書き =====

function loadMemos() {
  try {
    const data = localStorage.getItem("memos");
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        memos = parsed;
        return;
      }
    }
  } catch (e) {
    // データが壊れている場合は空にする
  }
  memos = [];
}

function saveMemos() {
  localStorage.setItem("memos", JSON.stringify(memos));
}

// ===== 一覧の表示 =====

function renderList() {
  memoList.innerHTML = "";

  if (memos.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "メモがありません";
    empty.style.color = "#999";
    empty.style.cursor = "default";
    memoList.appendChild(empty);
    return;
  }

  memos.forEach(function (memo) {
    const li = document.createElement("li");
    li.textContent = memo.title || "無題のメモ";
    if (memo.id === currentMemoId) {
      li.classList.add("active");
    }
    li.addEventListener("click", function () {
      selectMemo(memo.id);
    });
    memoList.appendChild(li);
  });
}

// ===== エディタの表示切り替え =====

function showEditor(memo) {
  editorPlaceholder.style.display = "none";
  editorForm.style.display = "flex";
  memoTitle.value = memo.title;
  memoBody.value = memo.body;
  memoUpdatedAt.textContent = "更新: " + formatDate(memo.updatedAt);
}

function hideEditor() {
  editorPlaceholder.style.display = "flex";
  editorForm.style.display = "none";
  memoTitle.value = "";
  memoBody.value = "";
  memoUpdatedAt.textContent = "";
  currentMemoId = null;
}

// ===== 日付フォーマット =====

function formatDate(dateString) {
  var d = new Date(dateString);
  var year = d.getFullYear();
  var month = ("0" + (d.getMonth() + 1)).slice(-2);
  var day = ("0" + d.getDate()).slice(-2);
  var hours = ("0" + d.getHours()).slice(-2);
  var minutes = ("0" + d.getMinutes()).slice(-2);
  return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
}

// ===== CRUD操作 =====

// 新規作成
function createMemo() {
  var now = new Date().toISOString();
  var memo = {
    id: Date.now().toString(),
    title: "",
    body: "",
    createdAt: now,
    updatedAt: now
  };
  memos.unshift(memo);
  saveMemos();
  currentMemoId = memo.id;
  renderList();
  showEditor(memo);
  memoTitle.focus();
}

// 選択
function selectMemo(id) {
  currentMemoId = id;
  var memo = memos.find(function (m) { return m.id === id; });
  if (memo) {
    renderList();
    showEditor(memo);
  }
}

// 保存
function saveCurrentMemo() {
  if (currentMemoId === null) return;

  var memo = memos.find(function (m) { return m.id === currentMemoId; });
  if (!memo) return;

  memo.title = memoTitle.value;
  memo.body = memoBody.value;
  memo.updatedAt = new Date().toISOString();

  saveMemos();
  renderList();
  memoUpdatedAt.textContent = "更新: " + formatDate(memo.updatedAt);
}

// 削除
function deleteCurrentMemo() {
  if (currentMemoId === null) return;

  var memo = memos.find(function (m) { return m.id === currentMemoId; });
  if (!memo) return;

  var confirmed = confirm("「" + (memo.title || "無題のメモ") + "」を削除しますか？");
  if (!confirmed) return;

  memos = memos.filter(function (m) { return m.id !== currentMemoId; });
  saveMemos();
  hideEditor();
  renderList();
}

// ===== イベント登録 =====

newMemoBtn.addEventListener("click", createMemo);
saveBtn.addEventListener("click", saveCurrentMemo);
deleteBtn.addEventListener("click", deleteCurrentMemo);

// ===== アプリ起動 =====

loadMemos();
renderList();
