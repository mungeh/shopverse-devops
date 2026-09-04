# STAGE 1 - Build the Go application
# =========================================================
FROM golang:1.25-alpine AS builder

WORKDIR /src

# Install certificates needed during build
RUN apk add --no-cache ca-certificates

# Copy module files first for better caching
COPY go.mod go.sum ./

RUN go mod download

# Copy source code
COPY . .

# Build a static Linux binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build \
    -trimpath \
    -ldflags="-s -w" \
    -o /out/shopverse-backend \
    ./cmd


# =========================================================
# STAGE 2 - Minimal production runtime
# =========================================================
FROM scratch

WORKDIR /app

# TLS certificates
COPY --from=builder /etc/ssl/certs/ca-certificates.crt \
    /etc/ssl/certs/ca-certificates.crt

# Copy ONLY the compiled application
COPY --from=builder /out/shopverse-backend /app/shopverse-backend

# Non-root user
USER 10001:10001

EXPOSE 8080

ENTRYPOINT ["/app/shopverse-backend"]
