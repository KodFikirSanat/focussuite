# FocusSuite Codespace Kurulum Rehberi

Bu rehber, proje monoreposundaki tüm ekiplerin (mobil, web ve Rust core) GitHub Codespaces üzerinde aynı geliştirme ortamını paylaşmasını sağlar. Aşağıdaki adımlar `.devcontainer` klasöründeki yeni yapılandırmayla uyumludur.

## İlk Açılış

1. GitHub üzerinde **Code → Create codespace on main** adımlarını izleyin.
2. Codespace ilk açıldığında konteyner otomatik olarak inşa edilir. Bu işlem sırasında:
   - Node.js 20 ve pnpm etkinleştirilir.
   - Watchman kurulumu Expo için dosya izleme performansını artırır.
   - `mobile` ve `website` paketleri için `pnpm install --frozen-lockfile` çalıştırılır.
   - `nexus-core` için `cargo fetch` ile bağımlılıklar önbelleğe alınır.
3. Hazırlık tamamlandığında terminalde hangi komutlarla servisleri başlatabileceğiniz listelenir.

## Servisleri Çalıştırma

> Tüm komutlar Codespace terminalinde proje kök dizininden (`/workspaces/focussuite`) çalıştırılmalıdır.

### Expo (Mobil)

- Geliştirme sunucusu: `pnpm --dir mobile start`
- Tarayıcıda web önizlemesi: `pnpm --dir mobile web`
- Expo Go ile test (tünel): `pnpm --dir mobile exec expo start --tunnel`

> Expo CLI, QR kodu terminalde gösterecek; Codespace portu 19000 otomatik olarak yayınlanır.

### Next.js (Website)

- Geliştirme modu: `pnpm --dir website dev`
- Üretim build: `pnpm --dir website build`
- Üretim sunucusu: `pnpm --dir website start`

Port 3000 otomatik olarak yönlendirilir.

### Rust Çekirdek (nexus-core)

- Testler: `cd nexus-core && cargo test`
- Format: `cd nexus-core && cargo fmt`
- Lint (clippy): `cd nexus-core && cargo clippy`

Port 8000 ilerideki servisler için rezerve edildi.

## Faydalı VS Code Eklentileri

Devcontainer otomatik olarak şu uzantıları yükler:

- Prettier
- React Native Tools
- Rust Analyzer
- Docker
- Toml desteği

## Çalışma Alanı İpuçları

- `pnpm` kullanan projeler için `corepack` hazırdır.
- Eğer CLI oturumunda environment değişkenine ihtiyaç duyarsanız `.env` dosyalarını ilgili proje klasörlerinde oluşturabilirsiniz.
- Codespace kapatıldığında servisler durur; tekrar açtığınızda `pnpm --dir ...` komutlarıyla hızlıca devam edebilirsiniz.

## Sorun Giderme

- Expo QR kodu görünmüyorsa `pnpm --dir mobile exec expo start --tunnel` komutunu çalıştırın.
- Portlar otomatik yönlenmiyorsa **Ports** panelinden manuel olarak `Forward` seçeneğini kullanın.
- Bağımlılık problemi yaşarsanız `pnpm --dir <klasör> install --force` veya `cargo clean && cargo fetch` komutlarını deneyin.
