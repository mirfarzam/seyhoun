.PHONY: install dev-api dev-web build clean

install:
	cd web && npm install

## Run Go API server (port 8080). Keep running alongside dev-web.
dev-api:
	go run ./cmd

## Run Vite dev server (port 1374). Proxies /api to localhost:1995.
dev-web:
	cd web && npm run dev

## Full production build: frontend → web/dist, then Go binary.
build:
	cd web && npm run build
	go build -o seyhoun ./cmd

## Run the production binary (serves everything on :8080).
run: build
	./seyhoun

clean:
	rm -rf web/dist seyhoun seyhoun.db
