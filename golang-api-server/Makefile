go-build-amd64:
	GOOS=linux GOARCH=amd64 go build -a -ldflags '-w -s -extldflags "-static"' -o exe -mod vendor -v ./cmd/v1

dev:
	go run ./cmd/v1/main.go 2>&1 | pz

docker-build:
	docker build -f build/api-server/Dockerfile -t asia.gcr.io/marine-dev/api-server .

docker-push:
	docker push asia.gcr.io/marine-dev/api-server:latest
