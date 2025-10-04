#!/usr/bin/env bash
set -euo pipefail

ROOT="/workspaces/focussuite"

printf '\n🏗️  FocusSuite ortamı hazırlanıyor...\n'

if [[ ! -d "${ROOT}" ]]; then
  echo "Beklenen çalışma dizini ${ROOT} bulunamadı."
  exit 1
fi

cd "${ROOT}"

# pnpm'i etkinleştir
corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@8 --activate

printf '\n📦  Mobil uygulama bağımlılıkları kuruluyor...\n'
if [[ -d "mobile" ]]; then
  (cd mobile && pnpm install --frozen-lockfile)
else
  echo "mobile klasörü bulunamadı, atlanıyor."
fi

printf '\n🌐  Website bağımlılıkları kuruluyor...\n'
if [[ -d "website" ]]; then
  (cd website && pnpm install --frozen-lockfile)
else
  echo "website klasörü bulunamadı, atlanıyor."
fi

printf '\n🦀  Rust crate önbelleğe alınıyor...\n'
if [[ -d "nexus-core" ]]; then
  (cd nexus-core && cargo fetch)
else
  echo "nexus-core klasörü bulunamadı, atlanıyor."
fi

printf '\n✅  Kurulum tamamlandı!\n'
printf '• Mobil uygulamayı başlatmak için: pnpm --dir mobile start\n'
printf '• Web uygulamasını başlatmak için: pnpm --dir website dev\n'
printf '• Rust backend testleri için: cd nexus-core && cargo test\n\n'
