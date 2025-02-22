# Сборка проекта Redmine
Оригинальный проект: https://www.redmine.org/
Образ: https://hub.docker.com/_/redmine

В redmine установлены плагины:
- https://github.com/jgraichen/redmine_dashboard - канбан доска.

Установленные темы см. в  первом комите затем удалил:
- https://www.redmineup.com/pages/themes/circle
- https://www.redmineup.com/pages/themes/a1
- https://github.com/farend/redmine_theme_farend_bleuclair
- https://github.com/adhi-software/sidebar-white

Темы дерьмо кроме стадартной как по мне

------------

## Старт проекта

Для запуска проекта выполните следующие команды:

```bash
cp .env.example .env &&
docker-compose up -d
```

По умолчанию переходим на  http://127.0.0.1:3000/

```
Логин: admin
Пароль: admin
```
## Пример переменных .env
```
REDMINE_PORT=3000
REDMINE_SECRET=secret

#PostgreSQL
DB_DATABASE=redmine
DB_PASSWORD=redmine
DB_USERNAME=redmine

#SMTP Mail
MAIL_DOMAIN=smtp.gmail.com
SMTP_ADDRESS=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=simple@gmail.com
SMTP_PASSWORD=simple-pass
```