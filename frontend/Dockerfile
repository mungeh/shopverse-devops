# =========================================================
# STAGE 1 - Build React/Vite application
# =========================================================
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy dependency files first for Docker cache efficiency
COPY package.json package-lock.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy source code
COPY . .

# Build production application
RUN npm run build


# =========================================================
# STAGE 2 - Build tiny static web server
# =========================================================
FROM golang:1.25-alpine AS server-builder

WORKDIR /src

RUN cat <<'EOF' > main.go
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	dist := "/app"

	fs := http.FileServer(http.Dir(dist))

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(dist, filepath.Clean(r.URL.Path))

		if _, err := os.Stat(path); os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(dist, "index.html"))
			return
		}

		fs.ServeHTTP(w, r)
	})

	log.Println("Frontend running on port 5173")

	if err := http.ListenAndServe(":5173", handler); err != nil {
		log.Fatal(err)
	}
}
EOF

# Compile a completely static server binary
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w" \
    -o /server \
    main.go


# =========================================================
# STAGE 3 - Minimal production runtime
# =========================================================
FROM scratch

WORKDIR /app

# Copy ONLY compiled React application
COPY --from=frontend-builder /app/dist /app

# Copy ONLY static web server runtime
COPY --from=server-builder /server /server

# Run as non-root user
USER 10001:10001

EXPOSE 5173

ENTRYPOINT ["/server"]
