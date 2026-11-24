# TodoList

React-интерфейс находится в `src/`, API на Express — в `server/src/`. При запуске Express обслуживает API и раздаёт сборку Vite из `dist/`.

## Локальная сборка и запуск

Требуются Node.js 24 и PostgreSQL. Скопируйте `.env.example` в `.env` в корне. Заполните строки подключения к PostgreSQL, `API_TOKEN`, `USER_LOGIN` и `USER_NAME`. Текущая схема таблицы описана в `server/prisma/schema.prisma`. Для работы API таблица `tasks` уже должна существовать.

```bash
npm ci
npm run build
npm start
```

Откройте `http://localhost:3000` или порт из `PORT` и введите значение `API_TOKEN` из `.env`. Команда `npm run lint` проверяет серверный код, а `npm run format` форматирует исходники фронтенда и сервера.

Исходники взяты из [фронтенда DenZhid](https://github.com/DenZhid/node-todolist-frontend/tree/f95c07d4ac0498b3122dc08aeebdfaf75fbeb071) и [бэкенда DenZhid](https://github.com/DenZhid/node-todolist-backend/tree/1376fbf143eabcabf7947d797f2ca3401cf73a29). Сопоставление полей и черновик сравнения площадок ниже взяты из README бэкенда.

## Схема данных и сопоставление полей

Таблица PostgreSQL: **`tasks`**.

| Столбец БД | Тип в БД | Поле API | 
|------------|----------|----------|
| `id` | `uuid` PK, `DEFAULT gen_random_uuid()` | `id` (строка UUID) |
| `owner_login` | `varchar` | `ownerLogin` |
| `title` | `varchar` | `title` |
| `done` | `boolean` | `done` |
| `run_id` | `varchar` | `runId` |
| `created_at` | `date` | `createdAt` (UTC ISO 8601) |

## Сравнение вариантов размещения таблицы
| Критерий | Timeweb Cloud | **Supabase** | Helios |
|----------|---------------|--------------|--------|
| Доступные СУБД | PostgreSQL 14–18, MySQL, MongoDB и другие | PostgreSQL | PostgreSQL |
| Постоянный бесплатный тариф | Не обнаружен | Free Plan - $0 постоянно при соблюдении лимитов | Бесплатный |
| Пробный период | Не обнаружен | Free Plan | Бесплатный |
| Стоимость | Оплата по конфигурации и использованию ресурсов | Free — $0; Pro — от $25/мес.; Team — от $599/мес. | Бесплатный |
| Бесплатное хранилище БД | Не обнаружен | 500 MB на проект | Ограничение не установлено |
| Источник | https://timeweb.cloud/ | https://supabase.com/ | - |
| Дата проверки | 22.11.2026 | 22.11.2026 | 22.11.2026 |

**Вывод:** Наилучшим вариантом оказался Supabase из-за сочетания бесплатных тарифов и большого количества бесплатных фич в сравнении с TimeWeb. Helios хоть и то же является бесплатным, однако из необходимых технологий имеет только установленный PostgreSQL. С имеющимися правами нет возможности установки Docker и Node
