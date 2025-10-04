# syntax=docker/dockerfile:1.5
FROM mcr.microsoft.com/devcontainers/universal:2

# Expo ve pnpm için dosya izleyicisini hızlandırmak adına watchman kurulur.
RUN apt-get update \
    && apt-get install -y --no-install-recommends watchman \
    && rm -rf /var/lib/apt/lists/*

# pnpm'nin corepack üzerinden kullanılabilmesi için gerekli ayarlar yapılır.
RUN corepack enable
