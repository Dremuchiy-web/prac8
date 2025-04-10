const noteTextarea = document.getElementById('note-text');
const addNoteButton = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');
const offlineMessage = document.getElementById('offline-message');

let notes = [];
let editingIndex = -1; // Индекс редактируемой заметки

// Функция для проверки онлайн/офлайн статуса
function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineMessage.classList.remove('offline-visible');
        offlineMessage.classList.add('offline-hidden');
    } else {
        offlineMessage.classList.remove('offline-hidden');
        offlineMessage.classList.add('offline-visible');
    }
}

// Слушаем события онлайн/офлайн
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Инициализация при загрузке страницы
updateOnlineStatus();

// Функция для сохранения заметок в localStorage
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Функция для загрузки заметок из localStorage
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
        notes = JSON.parse(storedNotes);
    }
    renderNotes();
}

// Функция для отображения заметок
function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');

        const noteText = document.createElement('div');
        noteText.classList.add('note-text');
        noteText.textContent = note;

        const noteButtons = document.createElement('div');
        noteButtons.classList.add('note-buttons');

        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.addEventListener('click', () => editNote(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => deleteNote(index));

        noteButtons.appendChild(editButton);
        noteButtons.appendChild(deleteButton);
        noteDiv.appendChild(noteText);
        noteDiv.appendChild(noteButtons);

        notesList.appendChild(noteDiv);
    });
}

// Функция для добавления заметки
function addNote() {
    const noteText = noteTextarea.value.trim();
    if (noteText !== '') {
        notes.push(noteText);
        saveNotes();
        renderNotes();
        noteTextarea.value = '';
    }
}

// Функция для удаления заметки
function deleteNote(index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
}

// Функция для редактирования заметки
function editNote(index) {
    editingIndex = index;
    noteTextarea.value = notes[index]; // Заполняем textarea текстом заметки
    addNoteButton.textContent = 'Сохранить';  // Меняем текст кнопки

    // Убираем старый обработчик и добавляем новый
    addNoteButton.removeEventListener('click', addNote);
    addNoteButton.addEventListener('click', saveNote);
}

// Функция для сохранения заметки (используется и для добавления, и для редактирования)
function saveNote() {
    const noteText = noteTextarea.value.trim();
    if (noteText !== '') {
        if (editingIndex !== -1) {
            // Редактирование существующей заметки
            notes[editingIndex] = noteText;
            editingIndex = -1;  // Сбрасываем индекс редактирования
        } else {
            // Добавление новой заметки
            notes.push(noteText);
        }
        saveNotes();
        renderNotes();
        noteTextarea.value = '';
        addNoteButton.textContent = 'Добавить'; // Возвращаем текст кнопки
        addNoteButton.removeEventListener('click', saveNote);
        addNoteButton.addEventListener('click', addNote);

    }
}

// Обработчики событий
addNoteButton.addEventListener('click', addNote);

// Загрузка заметок при загрузке страницы
loadNotes();