# Focus Suite - Tasarım Dokümantasyonu

## 1. Tasarım Vizyonu

Focus Suite, masabaşında çalışan kullanıcıların üretkenliğini artırmak için tasarlanmış, minimalist ve kullanıcı odaklı bir üretkenlik platformudur. Tasarımımız, Apple'ın Human Interface Guidelines prensiplerini takip ederek, içeriğe odaklı, sezgisel ve erişilebilir bir deneyim sunmayı hedefler.

### Temel Tasarım Prensipleri

- **İçerik Öncelikli**: Kullanıcı arayüzü minimal tutularak, kullanıcının asıl odaklanması gereken görev ve içerikler ön plana çıkarılacaktır
- **Tutarlılık**: Tüm modüller arasında tutarlı bir tasarım dili kullanılacaktır
- **Erişilebilirlik**: Dynamic Type, VoiceOver ve diğer erişilebilirlik özellikleri desteklenecektir
- **Platform Uyumu**: iOS, macOS ve diğer platformların doğal deneyimlerine uyum sağlanacaktır

## 2. Görsel Kimlik

### Renk Paleti

#### Ana Renkler
- **Birincil Renk (Accent Color)**: #007AFF (iOS System Blue)
  - Odaklanma ve üretkenliği temsil eden sakin mavi tonu
  - CTA butonları, aktif durumlar ve vurgularda kullanılacak

- **İkincil Renk**: #34C759 (iOS System Green)
  - Başarı, tamamlama ve pozitif geri bildirimler için

- **Uyarı Rengi**: #FF9500 (iOS System Orange)
  - Dikkat gerektiren durumlar ve bildirimler için

#### Nötr Renkler
- **Arka Plan**:
  - Light Mode: #FFFFFF (Primary), #F2F2F7 (Secondary)
  - Dark Mode: #000000 (Primary), #1C1C1E (Secondary)

- **Metin Renkleri**:
  - Light Mode: #000000 (Primary), #3C3C43 (Secondary), #C7C7CC (Tertiary)
  - Dark Mode: #FFFFFF (Primary), #EBEBF5 (Secondary), #48484A (Tertiary)

### Tipografi

#### Font Ailesi
- **Sistem Fontu**: SF Pro (iOS/macOS)
  - Başlıklar: SF Pro Display
  - Gövde Metni: SF Pro Text
  - Monospace (Zamanlayıcı): SF Mono

#### Font Hiyerarşisi
- **Büyük Başlık**: 34pt, Bold (Modül başlıkları)
- **Başlık 1**: 28pt, Bold (Sayfa başlıkları)
- **Başlık 2**: 22pt, Semibold (Bölüm başlıkları)
- **Başlık 3**: 20pt, Semibold (Alt başlıklar)
- **Gövde**: 17pt, Regular (Ana içerik)
- **Alt Metin**: 15pt, Regular (İkincil bilgiler)
- **Bilgi Notu**: 13pt, Regular (Yardımcı metinler)
- **Etiket**: 11pt, Regular (Küçük etiketler)

#### Dynamic Type Desteği
Tüm metin öğeleri Dynamic Type'ı destekleyecek ve kullanıcının sistem ayarlarına göre ölçeklenecektir.

## 3. Layout ve Grid Sistemi

### Temel Layout Prensipleri

#### Güvenli Alanlar
- Tüm içerik sistem tanımlı güvenli alanlar içinde konumlandırılacak
- iPhone'da notch ve home indicator alanlarına dikkat edilecek
- iPad'de multi-tasking modları göz önünde bulundurulacak

#### Margin ve Padding
- **Standart Margin**: 16pt (kompakt), 20pt (regular)
- **Bölümler Arası**: 32pt
- **Liste Öğeleri Arası**: 8pt
- **Kart İçi Padding**: 16pt

#### Grid Yapısı
- **Mobil (iPhone)**: 1 kolon
- **Tablet (iPad Portrait)**: 2 kolon
- **Tablet (iPad Landscape)**: 3 kolon
- **Desktop**: Responsive 12 kolon grid

### Adaptif Tasarım

#### Oryantasyon Desteği
- Portrait ve Landscape modlarında optimize edilmiş layoutlar
- iPad'de Split View ve Slide Over desteği
- Mac'te pencere boyutu değişimlerine dinamik adaptasyon

#### Cihaz Bazlı Optimizasyon
- **iPhone SE/Mini**: Kompakt layout, azaltılmış padding
- **iPhone Standard**: Standart layout
- **iPhone Pro Max**: Genişletilmiş içerik alanı
- **iPad**: Multi-column layout, master-detail view
- **Mac**: Desktop optimizasyonu, hover state'ler

## 4. Bileşenler ve UI Öğeleri

### Navigasyon

#### Tab Bar (Ana Navigasyon)
- 5 ana modül için tab bar kullanımı
- İkonlar: SF Symbols kullanımı
- Aktif durum: Accent color ile vurgulama
- Badge desteği: Tamamlanmamış görevler için

#### Navigation Bar
- Büyük başlık kullanımı (scrollda küçülür)
- Sağ üst: Ayarlar ve profil erişimi
- Sol üst: Geri navigasyonu veya menü

### Butonlar

#### Primary Button
- Arka plan: Accent color
- Metin: Beyaz, 17pt, Semibold
- Corner radius: 12pt
- Min height: 50pt
- Gölge: Hafif elevation için

#### Secondary Button
- Arka plan: SystemGray5
- Metin: Primary text color
- Border: Yok
- Corner radius: 12pt

#### Text Button
- Arka plan: Transparent
- Metin: Accent color, 17pt, Regular
- Altı çizili değil

### Kartlar ve Containerlar

#### Modül Kartları
- Arka plan: System background secondary
- Corner radius: 16pt
- Padding: 16pt
- Gölge: Subtle (0, 2, 8, 0.1)

#### Liste Öğeleri
- Separator: SystemGray4, 0.5pt
- Padding: 16pt vertical, 20pt horizontal
- Swipe actions: Silme (kırmızı), Düzenleme (mavi)

### Form Öğeleri

#### Text Field
- Border: SystemGray4, 1pt
- Corner radius: 8pt
- Height: 44pt minimum
- Placeholder: Tertiary text color
- Clear button: Sağda

#### Switch/Toggle
- iOS system switch kullanımı
- On state: Accent color
- Label: Sol tarafta

#### Picker/Selector
- Wheel picker (iOS)
- Dropdown menu (macOS)
- Segment control (3 veya daha az seçenek)

### Özel Bileşenler

#### Zamanlayıcı Display
- Font: SF Mono, 48pt, Medium
- Format: 00:00 (MM:SS)
- Progress ring: Circular, 4pt kalınlık
- Animasyon: Smooth countdown

#### Alışkanlık Check-in Button
- Circular progress indicator
- Long press gesture: 2 saniye
- Haptic feedback: Success pattern
- Animasyon: Fill animation

#### Ses Mixer Kontrolü
- Vertical slider
- Icon üstte
- Değer göstergesi: Popup veya inline
- Mute button: Slider yanında

## 5. Modül Bazlı Tasarım Detayları

### Pomodoro Zamanlayıcı

#### Ana Ekran
- Merkezi büyük zamanlayıcı display
- Altında başlat/duraklat butonu
- Üstte preset seçimi (25-5, 90 dk, Özel)
- Progress ring animasyonu

#### Ayarlar
- Çalışma süresi slider
- Mola süresi slider
- Bildirim sesi seçimi
- Otomatik başlatma toggle

### Alışkanlık Takipçisi

#### Liste Görünümü
- Günlük alışkanlıklar grid veya liste
- Her öğede:
  - İkon veya emoji
  - Alışkanlık adı
  - Saat bilgisi
  - Check-in butonu

#### Takvim Görünümü
- Aylık grid
- Tamamlanan günler vurgulu
- Streak göstergesi
- Haftalık/aylık istatistikler

### Soundscapes

#### Ana Kontrol Paneli
- Frekans seçici (horizontal picker)
- Ses kartları grid layout
- Her kartta:
  - İkon
  - Ses adı
  - Volume slider
  - On/off toggle

#### Preset Kayıt
- Floating action button
- Modal sheet ile kayıt
- İsim ve ikon seçimi

### To-Do List

#### Proje/Parent View
- Collapsible sections
- Drag & drop reorder
- Swipe actions
- Progress indicator

#### Görev Detayı
- Öncelik badge (renk kodlu)
- Kaynak linkleri listesi
- Not alanı (expandable)
- Zaman bloğu ataması

### Uygulama Engelleyici (Desktop)

#### Kural Listesi
- Toggle ile aktif/pasif
- Zaman aralığı göstergesi
- Uygulama/site ikonları
- Quick edit actions

## 6. Mikro İnteraksiyonlar ve Animasyonlar

### Geçişler
- **Sayfa Geçişleri**: iOS standart push/pop
- **Modal Sunumlar**: Sheet presentation
- **Tab Değişimi**: Fade transition

### Feedback Animasyonları
- **Success**: Checkmark animation + haptic
- **Error**: Shake animation + haptic
- **Loading**: Skeleton screens
- **Pull to Refresh**: Elastic bounce

### Gesture'lar
- **Swipe**: Liste öğeleri için aksiyonlar
- **Long Press**: Alışkanlık check-in
- **Pinch**: Takvim zoom (iPad)
- **Pan**: Ses seviyesi kontrolü

## 7. Dark Mode Desteği

### Otomatik Geçiş
- Sistem ayarlarını takip
- Manuel override seçeneği
- Smooth transition animasyonu

### Renk Adaptasyonu
- Semantic colors kullanımı
- Kontrast oranları korunacak
- Gölge ve elevation ayarlamaları

## 8. Erişilebilirlik

### VoiceOver Desteği
- Tüm interaktif öğeler için label
- Hint ve trait tanımlamaları
- Logical navigation order

### Dynamic Type
- Tüm metinler ölçeklenebilir
- Layout adaptasyonu
- Minimum ve maksimum limitler

### Reduce Motion
- Animasyon alternatifleri
- Instant transitions
- Static progress indicators

### Color Accessibility
- Yeterli kontrast oranları (WCAG AA)
- Renk körü dostu paletler
- Renk dışı göstergeler

## 9. Platform Özellikleri Entegrasyonu

### iOS/iPadOS
- Widget desteği (Günlük alışkanlıklar, aktif zamanlayıcı)
- Shortcuts entegrasyonu
- Focus mode entegrasyonu
- Live Activities (zamanlayıcı)

### macOS
- Menu bar app
- Keyboard shortcuts
- Touch Bar desteği (eski modeller)
- Handoff desteği

### watchOS (Gelecek)
- Complication desteği
- Quick actions
- Haptic notifications

## 10. Onboarding ve İlk Deneyim

### Welcome Flow
1. **Hoş Geldin**: App value proposition
2. **Özellik Tanıtımı**: 5 ana modül carousel
3. **İzin İstekleri**: Bildirim, takvim erişimi
4. **İlk Kurulum**: Varsayılan çalışma süreleri
5. **Başlangıç**: Ana ekrana yönlendirme

### Empty States
- İllüstrasyon + açıklayıcı metin
- CTA butonu ile aksiyona yönlendirme
- Helpful tips ve öneriler

### Tooltips ve Hints
- İlk kullanımda feature discovery
- Contextual help bubbles
- Dismissible coach marks

## 11. Performans ve Optimizasyon

### Asset Optimizasyonu
- SF Symbols tercih edilecek
- Vector graphics (SVG)
- @2x ve @3x image setleri
- Lazy loading implementasyonu

### Animasyon Performansı
- 60 FPS hedefi
- GPU accelerated animations
- Efficient redraws
- Battery optimization
