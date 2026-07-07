.PHONY: dev build up down logs

dev:
	npm run dev

build:
	npm run build

up:
	docker compose up -d --build

down:
	docker compose down

logs:
	docker compose logs -f
