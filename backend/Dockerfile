FROM golang:1.23-alpine AS build

WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/server ./cmd/api

FROM alpine:3.21

RUN apk add --no-cache ca-certificates wget
WORKDIR /app
COPY fonts /app/fonts
COPY --from=build /out/server /app/server
EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=10 \
  CMD wget -qO- http://127.0.0.1:8080/api/health || exit 1

CMD ["/app/server"]
