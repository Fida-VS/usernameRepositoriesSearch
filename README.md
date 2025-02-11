Задание
Необходимо создать простое веб-приложение, которое позволяет пользователям искать репозитории на GitHub по имени пользователя и отображать информацию о найденных репозиториях. Используйте GitHub API для получения данных.

Дополнительным плюсом будет: Финальный билд приложения должен запускаться из Docker контейнера (хотябы с минимальной конфигурацией)

Функционал

Должно быть текстовое поле куда можно ввести имя пользователя. Триггером к поиску является ввод пользовательского текста. Запросы к api github не должны быть избыточными

После получения данных, должны появляться карточки с информацией о репозиториях пользователя, информация включает: -- Название репозитория -- Описание (если доступно) -- Ссылку на репозиторий --Количество звёзд (stars) --Дату последнего обновления

В момент ожидания ответа от github api должен быть индикатор загрузки

Необходимо реализовать пагинацию с шагом 20, триггером к выполнению запроса за следующей страницей должна стать прокрутка экрана вниз, то есть необходимо реализовать механизм бесконечной прокрутки

Если пользователь вводит некорректное имя пользователя или если возникают ошибки при запросе к API, приложение должно отображать соответствующее сообщение об ошибке понятное человеку.

Замечания

Обязательно использование React, Redux/MobX.

Желательно Typescript, Redux-toolkit

Верстка может быть самая простая, однако она не должна ломаться при разрешениях от 320px до 1920px. 