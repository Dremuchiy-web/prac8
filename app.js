const noteTextarea = document.getElementById('note-text');
const addNoteButton = document.getElementById('add-note');
const notesList = document.getElementById('notes-list');
const offlineMessage = document.getElementById('offline-message');
const imageUrlInput = document.getElementById('image-url'); // Получаем поле для ввода URL


let notes = [];

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

        // Если есть URL изображения, добавляем его
        let noteImage = null;
        if (note.imageUrl) {
            noteImage = document.createElement('img');
            noteImage.src = note.imageUrl;
            noteImage.alt = 'Изображение';
            noteImage.classList.add('note-image');  // Добавим класс для стилизации
        }

        const noteButtons = document.createElement('div');
        noteButtons.classList.add('note-buttons');

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.addEventListener('click', () => deleteNote(index));

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

// Обработчики событий
addNoteButton.addEventListener('click', addNote);

// Загрузка заметок при загрузке страницы
loadNotes();