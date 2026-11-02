# Заняття 2 — Знайомство з Express

## Express

- Що таке Express і навіщо він потрібен
- Створення сервера з Express
- Роутинг в Express
- Параметри маршруту `req.params`
- Параметри запиту `req.query`

## Middleware

- Що таке middleware та стек middleware
- Оголошення middleware функції `(req, res, next)`
- Middleware для неіснуючих маршрутів (404)
- Middleware обробки помилок `(err, req, res, next)`
- Middleware із бібліотек:
  - Обробка JSON з `express.json()`
  - [`cors`](https://www.npmjs.com/package/cors)
  - [`helmet`](https://www.npmjs.com/package/helmet)

## Змінні оточення

- [`dotenv`](https://www.npmjs.com/package/dotenv)
- Різні повідомлення про помилки для prod та dev середовищ

## Матеріали

- [`assets/client-server.jpg`](assets/client-server.jpg) — схема клієнт-серверної архітектури
- [`assets/rest-api.jpg`](assets/rest-api.jpg) — схема клієнт-серверної архітектури з REST API
- [`assets/cors.jpg`](assets/cors.jpg) — як працює CORS: заголовки `Origin` та `Access-Control-Allow-Origin`

## Послідовність заняття

1. Встановити Express, створити базовий сервер
2. Додати перший маршрут — показати `req`, `res`, показати схему `client-server.jpg`
3. Розібрати `req.params` та `req.query` на прикладі — показати схему `rest-api.jpg`
4. Пояснити концепцію middleware — показати стек
5. Написати власний middleware — логування запитів
6. Додати middleware для неіснуючих маршрутів (404)
7. Додати middleware обробки помилок
8. Підключити `express.json()`, `cors`, `helmet` — показати схему `cors.jpg`
9. Налаштувати змінні оточення через `dotenv`
10. Показати різні повідомлення про помилки для prod та dev
