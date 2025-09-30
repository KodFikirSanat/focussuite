# Focus Suite - Android Tasarım Dokümantasyonu

## 1. Tasarım Vizyonu

Focus Suite, yoğun iş temposundaki kullanıcıların üretkenliklerini artıran modüler bir odak yönetimi platformudur. Android deneyimi, Material Design 3 (Material You) prensiplerine dayanır ve kullanıcıların cihazlarına, tercihlerine ve bağlamlarına göre kendini uyarlayan, sıcak ve erişilebilir bir arayüz sunar.

### Temel Tasarım Prensipleri

- **Dinamik Uyum**: Material You dinamik renk sistemi ile kullanıcı duvar kağıdına uyum sağlayan temalar desteklenecektir
- **Platform Doğallığı**: Android navigasyon desenleri, etkileşimleri ve sistem komponentleri benimsenecektir
- **Erişilebilirlik**: TalkBack, yüksek kontrast ve büyük metin gibi erişilebilirlik özellikleri birinci sınıf vatandaş olacak
- **Performanslı Mikro Etkileşimler**: Sıvı animasyonlar, dokunsal geri bildirimler ve duruma göre değişen UI durumları ile kullanıcıyı bilgi sahibi tutmak

## 2. Görsel Kimlik

### Renk Paleti

#### Dinamik Renk Desteği
- **Seed Color**: Varsayılan olarak #6750A4 (Material baseline primary). Dinamik renk desteklemeyen cihazlarda bu tohum rengi kullanılacak
- **Material Ton Setleri**: Primary, Secondary, Tertiary, Error ve Neutral tonlar `MaterialTheme` ton eşlemesine göre oluşturulacak
- **Android 12+**: System UI'den gelen `dynamicColor` ton setleri otomatik uygulanacak, kullanıcı kapatabilirse varsayılan palet tercih edilecek

#### Statik Geri Dönüş Paleti (Android 11 ve Altı)
- **Primary**: #6750A4 (Focus Moru)
- **On Primary**: #FFFFFF
- **Secondary**: #625B71
- **On Secondary**: #FFFFFF
- **Tertiary**: #7D5260
- **On Tertiary**: #FFFFFF
- **Error**: #B3261E
- **On Error**: #FFFFFF
- **Background**: #FEF7FF (Light) / #1C1B1F (Dark)
- **Surface**: #FFFBFE (Light) / #1C1B1F (Dark)
- **Surface Variant**: #E7E0EC (Light) / #49454F (Dark)
- **Outline**: #7A757F (Light) / #938F99 (Dark)

### Tipografi

#### Font Ailesi
- **Sistem Fontu**: Roboto varsayılan; Android 12+ için Google Sans Text seçeneği değerlendirilir
- **Monospace**: Roboto Mono (zamanlayıcı ve sayısal göstergeler)

#### Material 3 Tipografi Hiyerarşisi
- **Display Large**: 57sp, Weight 400 (Kampanya, onboarding)
- **Headline Medium**: 28sp, Weight 400 (Ana modül başlıkları)
- **Title Large**: 22sp, Weight 400 (Ekran başlıkları)
- **Title Medium**: 16sp, Weight 500 (Kart başlıkları, listeler)
- **Body Large**: 16sp, Weight 400 (Ana içerik)
- **Body Medium**: 14sp, Weight 400 (İkincil içerik)
- **Label Large**: 14sp, Weight 500 (Buton metinleri)
- **Label Small**: 11sp, Weight 500 (Yardımcı etiketler)

#### Tipografik Duyarlılık
- **Scaled Density**: `sp` birimi kullanılacak, sistem boyutlandırmasıyla ölçeklenecek
- **Line Height**: Material 3 önerilerine göre otomatik; özel içerikte minimum 1.2 satır yüksekliği

## 3. Layout ve Grid Sistemi

### Temel Layout Prensipleri

#### Safe Area & Sistem Çerçevesi
- Sistem durum çubuğu, gezinme çubuğu ve kesik ekran alanlarına uyum
- Edge-to-edge layout; `WindowInsets` yönetimi ile içerik kaydırılabilirlik sağlanır

#### Spacing Kuralları
- **Horizontal Padding**: Telefon 16dp, tablet 24dp
- **Vertical Padding**: Ekran başlıkları 24dp, içerik blokları 16dp
- **Kart İç Padding**: 16dp
- **Liste Öğeleri Arası**: 8dp (dense list) / 12dp (rahat list)

#### Responsive Grid
- **Telefon**: 1 kolon + `FAB`
- **Katlanabilir Cihaz**: Hinge farkındalığı, 2 kolonlu master-detail
- **Tablet (Portrait)**: 2 kolon, navigation rail
- **Tablet (Landscape)**: 3 kolon, persistent navigation rail + destek modülleri
- **Chromebook/Desktop**: 12 kolon responsive grid, pointer etkileşimleri

### Adaptif Tasarım
- **Window Size Classes**: `compact`, `medium`, `expanded` kırılımları
- **Navigation Pattern**: Compact için bottom navigation, medium için navigation rail, expanded için navigation drawer

## 4. Bileşenler ve UI Öğeleri

### Navigasyon

#### Bottom Navigation Bar (Compact Cihazlar)
- 5 ana modül, Material 3 `NavigationBar`
- Aktif tab: Filled indicator + Primary renk
- Badge: `BADGE` API ile sayısal veya nokta göstergesi

#### Navigation Rail (Tablet & Katlanabilir)
- Landscape ve geniş ekranlarda sol tarafta kalıcı
- Secondary actions üst ve alt slotlarda

#### Top App Bar
- `Center-aligned TopAppBar` varsayılan
- Scroll davranışı ile `LargeTopAppBar` -> `CenterAligned` dönüşümü
- Sağ aksiyon menüsü: Ayarlar, profil, arama

### Butonlar

#### Filled Button (Primary CTA)
- Min height: 48dp
- Corner radius: 12dp (Shape Large)
- Icon left opsiyonlu
- State katmanları + elevate animation

#### Filled Tonal Button (Secondary)
- Secondary renk tonlarında, önemli ama ikincil aksiyon

#### Outlined Button
- Outline: 1dp, outline rengi `Outline`
- Boş durumlar için

#### Icon Button & FAB
- **FAB**: Soundscape preset kaydı ve hızlı görev ekleme için `Extended FAB`
- **Icon Button**: `IconButton` + ripple + haptic feedback

### Kartlar ve Containerlar

#### Elevated Card
- Surface renginin bir tonu, `Elevation 1-3`
- Drag & drop işlemlerinde state layer ile vurgulanır

#### Filled Card
- Focus modu, Pomodoro timer gibi vurgulanması gereken bloklar için

### Form Öğeleri

#### Text Field
- `OutlinedTextField` (varsayılan)
- Leading/Trailing ikon desteği
- Error state: Outline kırmızı, yardımcı metin

#### Slider
- Material 3 `Slider`, dokunsal feedback + tick mark

#### Switch
- Material 3 `Switch` (OS 12+ UI`ya uyumlu)

#### Segmented Button
- Üç veya daha az preset (25/5 gibi) için `SegmentedButtons`

### Özel Bileşenler

#### Pomodoro Progress
- `Circular Progress Indicator` custom 8dp stroke, gradient overlay
- Kompozisyon: Zaman, durum etiketleri, aksiyon butonları

#### Habit Streak Indicator
- Material `Badge` + `Linear Progress Indicator`
- Long press ile detay kartı açılır, vibrations `HapticFeedback.longPress`

#### Soundscape Mixer
- `Vertical Slider` + tonal iconography
- `Chip` tabanlı preset seçimi
- Volume ayarı % ve haptic

## 5. Modül Bazlı Tasarım Detayları

### Pomodoro Zamanlayıcı
- **Ana Ekran**: Hero card + progress ring, CTA butonlar alt nav üzerinde yüzen FAB
- **Presetler**: `SegmentedButtons` (Compact) veya `Assist Chips` (Expanded)
- **Ayarlar**: `ModalBottomSheet` ile zaman aralığı, bildirim tonu, otomatik başlatma

### Alışkanlık Takipçisi
- **Liste Görünümü**: `LazyColumn` içinde `ListItem`
- **Grid**: `Adaptive Grid` -> Tablet ve geniş ekranlarda 2-3 kolon
- **Takvim**: `CalendarView` adaptasyonu veya custom grid + tonal surface

### Soundscapes
- **Ana Panel**: `NavigationBar` üstünde `LargeTopAppBar` + grid kartlar
- **Mixer**: Sliding panel (`BottomSheetScaffold`) ile ayrıntılı kontrol
- **Preset Kayıt**: `Extended FAB` -> `Full-screen dialog`

### Görev & Planlayıcı
- **Üst Seviye**: `Collapsible` bölümler, `Accordion`
- **Drag & Drop**: `Reorderable list` ile custom dokunsal geri bildirim
- **Görev Detayı**: `Full-screen dialog` + `TextField`, `Chip`, `DatePicker`

### Dijital Detoks / Site Engelleyici
- **Kart Listesi**: Toggle + zaman çizelgesi `ListItem`
- **Kural Oluştur**: Stepper formu + `TimePicker`
- **Durum**: `State chips` (aktif/pasif)

## 6. Mikro Etkileşimler ve Animasyonlar

- **Motion**: Material 3 `easing` ve `duration` rehberliği
- **Transition**: Shared axis (X/Y) modüller arası, fade-through modal geçişler
- **Container Transform**: Kart -> detay ekran geçişi
- **Haptic**: Başarıda `HapticFeedback.success`, uyarıda `HapticFeedback.error`
- **Loading**: `Pull to refresh` için stretch overscroll, `LinearProgressIndicator`

## 7. Karanlık Mod ve Temalar

- **Dynamic Color**: Sistem temalarına göre light/dark varyant otomatik
- **Manual Toggle**: Ayarlar içinde tema seçimi (Sistem / Açık / Koyu)
- **Surface Tonları**: Material 3 `surface` + `surfaceVariant` ile yüksek kontrast
- **Elevation Overlay**: Koyu temada 1dp üzeri elevation'larda otomatik overlay

## 8. Erişilebilirlik

- **TalkBack Etiketleri**: Tüm interaktif öğeler `contentDescription`
- **Dokunmatik Hedefler**: Minimum 48x48dp
- **Kontrast**: WCAG AA (4.5:1) hedefi, dinamik renk fallback tonları test edilecek
- **Motion Ayarları**: Animasyonları azalt seçeneği sistem ayarına uyacak, skeleton -> statik placeholder
- **Dil Desteği**: RTL layout, çoklu dil; metin kutuları `imeOptions` ile optimize

## 9. Platform Özellikleri Entegrasyonu

- **Android Widget**: Zamanlayıcı, alışkanlık özetleri için Material widget kartları
- **Quick Settings Tile**: Odak modunu hızlı başlatma
- **App Shortcuts**: Uzun basma menüsü (Pomodoro başlat, Ses manzarası)
- **Notifications**: Material `BigTextStyle` + `MediaStyle` (soundscape), `Foreground Service` ile kalıcı timer
- **Wear OS**: Mini timer ve alışkanlık kontrolü (gelecek)
- **Chromebook**: Klavye kısayolları, pointer hover

## 10. Onboarding ve İlk Kullanım

- **Welcome Carousel**: Material `HorizontalPager` + `Indicator`
- **Permission Flow**: Sistem izin isteme `BottomSheetDialog`
- **Initial Setup**: Varsayılan pomodoro süresi, alışkanlık örnekleri, Soundscape presetleri
- **Empty States**: Material illüstrasyonları + `Filled tonal button`
- **Tips**: `Feature discovery` (Tap target), `Coach mark`

## 11. Performans ve Optimizasyon

- **Vector Assets**: `VectorDrawable` ve `Lottie` (lightweight) kullanımı
- **Image Loading**: `Coil` veya React Native eşdeğeri, caching stratejisi
- **Animation Performance**: 60FPS, `Choreographer` frame drop takibi
- **Battery**: Arkaplan servisleri optimize, gereksiz wakelock yok
- **Test**: Android Espresso, UI Automator ile görsel stabilite, farklı DPI/screen size testleri

## 12. Tasarım Sağlama & Dokümantasyon

- **Design Tokens**: Renk, tipografi, spacing için JSON tabanlı tokenlar
- **Figma Kit**: Material 3 Android komponent kiti baz alınacak, paylaşımlı kitaplık
- **Design QA**: Geliştirici build'leri üzerinden screenshot testi, Material baseline ile karşılaştırma
- **Güncelleme Döngüsü**: iOS ve Android tasarımları eş zamanlı revize, platform farklılıkları notlanacak
