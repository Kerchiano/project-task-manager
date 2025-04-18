# 📋 Коментарі та завдання — фронтенд

Це інтерфейс для роботи з проектами та завданнями, створений за допомогою **Vite + Vue 3**. Проєкт підтримує переміщення завдань зміну статусів(Drag and Drop), редагування; створення(Завдань), створення проектів, фільтрацію; сортировку таблиць, зміну ширини таблиць, динамічну таблицю. Також звичайно реалізований глобальний стан з локальним сховищем.

---

## 🚀 Швидкий старт

### 1. Клонування репозиторію

Створи папку в Visual Studio Code, перейди в неї через термінал і виконай команду:

```bash
git clone https://github.com/Kerchiano/project-task-manager.git
```
### 2. Запуск проєкту.

У корені проекту відкрий два термінали:  
У першому терміналі: запуск бекенду  
Перейди до папки проекту project-task-manager

```bash
cd project-task-manager
```
Потім зроби команду щоб інсталювати залежності:
```bash
yarn install
```
Запусти команду
```bash
yarn server
```
Також відкрий другий терминал аналогічно перейди до папки проекту project-task-manager : запуск фронтенду

```bash
cd project-task-manager
```
Запусти команду
```bash
yarn dev
```
Проекти будуть доступні за адресою:
👉 http://localhost:5173/

Завдання будуть доступні за адресою:
👉 http://localhost:5173/projects/{productId}

Щоб змінити ширину таблиць наведи на границі назв столбців затиснувши тяни у будь-яку сторону. Щоб перейти до завдань проекта натисни один раз на рядок у таблиці проектів. Щоб на сторінці завдань змінити завдання місцями наведи на завдання натиснувши и тримаючи ліву кнопку миші прямуй у напрямку куди хочешь перемістити. Також є drag and drop для зміни статусу з права від фільтрів зверни уваги на 3 кнопки. Аналогічно з попереднім натисни на 1 з 3 кнопок і тримаючи її прямуй до рядка и до статусу який хочеш змінити. Щоб редагувати запис завдання натисни двічі на завдання. Все інше зрозуміло з інтерфейсу
