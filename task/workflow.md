# Процесс работы над домашним заданием

## Работа над заданием

**Работа над заданием ведётся в пулл-реквестах**. Коммиты напрямую в мастер – нарушение.

## Как сделать первый пулл-реквест

```sh
# Клонируем свой приватный репозиторий
git clone https://github.com/honest-hrundel/<login>-task-2019.git

# Делаем ветку
git checkout -b my-first-branch

# Пишем код и делаем коммит, добавляя в него все изменённые файлы
git add file1 file2 directory1/ directory2/
git commit -m "Первая часть моего решения"

# Пушим ветку
git push -u origin my-first-branch

# Переходим на https://github.com/honest-hrundel/<login>-task-2019
# и делаем пулл-реквест кнопкой «New pull request»

# В качестве base оставляем master, в качестве compare – my-first-branch
```

Если после пулла могут понадобиться исправления:

```sh
# Снова пишем код и делаем коммит, добавляя в него все изменённые файлы
git add file1 file2 directory1/ directory2/
git commit -m "Первая часть моего решения"

# Обновляем пулл
git push origin my-first-branch
```

Когда все готово и пулл устраивает:

```sh
# Мерджим пулл в интерфейсе GitHub

# После мерджа удаляем ветку в интерфейсе GitHub кнопкой «Delete branch»

# Переключаемся на мастер
git co master

# Подтягиваем смердженные изменения
git pull --rebase

# Удаляем старую ветку
git branch -D my-first-branch

# Делаем новую
git checkout -b my-second-branch
```
