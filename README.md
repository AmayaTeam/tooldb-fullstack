# TGT ToolDB Fullstack application

Две конфигурации DEV-development и MAIN-production. Как это организовано, по порядку.
1. Приходит фича, вы её получили, надо развернуться, клоним репо
2. Переключаемся на ветку dev
2. Берем файлик с переменными среды .env.dev у @stepantishhen, кладем в корень проекта
3. Для запуска с помощью docker compose используем команду: 
    ```commandline
    sudo docker compose -f docker-compose.dev.yml up
    ```
4. Поднимается локально пустая БД, фронт, бэк. Надо заполнить БД тестовыми данными:
    ```commandline
    sudo docker compose exec web poetry run python manage.py add_unit_system_data
    ```
   ```commandline
    sudo docker compose exec web poetry run python manage.py add_base_data
    ```
   !!Последовательность важна!!
5. Для фичи создайте отдельную ветку по формату: TGT-number-feature (где number - айдишка таски из Yougile)
6. Вот у вас есть всё необходимое, производите какие-то изменения над проектом, фиксируете их, пушите и обязательно открываете мерж-реквест в ветку **dev**. Как только пулл будет принят, он будет смержен в ветку main, которая затем публикуется в prod

Также, поменялась адресация бэкенда, появился префикс /api
* Например корень бэка теперь по адресу: http://localhost/api/
* GraphQL endpoint: http://localhost:8000/api/graphql

Список необходимых допом, комманд:
1. Запуск проекта
   * Собрать и запустить проект (в фоне)
     ```commandline
     sudo docker compose -f up -d --build
     ```
   * Запустить проект (в фоне)
     ```commandline
     sudo docker compose -f docker-compose.dev.yml up -d
     ```
   * Запустить проект в командной строке
     ```commandline
     sudo docker compose -f docker-compose.dev.yml up
     ```
   * Остановить проект
     ```commandline
     sudo docker compose -f docker-compose.dev.yml stop
     ```
2. Тестовые данные
   * Загрузить базовые тестовые данные(Группы, пользователи, группы модулей, типы, сами модули, их параметры, сенсоры)
     ```commandline
     sudo docker compose exec web poetry run python manage.py add_unit_system_data
     ```
   * Загрузить тестовые данные единиц измерений(ResourceString, Unit, UnitSystem, Measure, ConversionFactor и т.д.)
     ```commandline
     sudo docker compose exec web poetry run python manage.py add_unit_base_data
     ```
   * Удалить ВСЕ тестовые данные
     ```commandline
     sudo docker compose exec web poetry run python manage.py flush
     ```

## Перед коммитом
*  Отформатируй код с помощью команды:
    ```commandline
    black .
    ```
*  Используй линтер для дополнительной проверки:
    ```commandline
    flake8 .
    ```
* Если порт postgresql уже используется:
  * найти процесс которым занят
    ```commandline
    sudo lsof -i :5432
    ```
  * остановить его
    ```commandline
    sudo kill <PID>
    ```
  * если не помогает, перезапусти сервис postgres
    ```commandline
    sudo service postgresql restart 
    ```
* Добавить зависимость в проект:
  ```commandline
  poetry add <python_package>
  ```