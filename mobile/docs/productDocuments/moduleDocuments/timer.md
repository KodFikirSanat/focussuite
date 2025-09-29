# Focus Suite - Zamanlayıcı

## Özellik Tanımı

Zamanlayıcı, kullanıcıların Pomodoro veya uzun blok çalışma yöntemlerini uygulayarak odaklı kalmasını sağlar. Hazır şablonlar (25-5 Pomodoro ve 90 dakika blok) ile birlikte kişiselleştirilmiş süreler de tanımlanabilir. Çalışma blokları görevlerle ilişkilendirilebilir veya bağımsız olarak başlatılabilir.

## Kullanıcı Senaryosu

* Kullanıcı 25-5 Pomodoro şablonunu seçer ve kısa görevlerini bu blok içine atar.
* Başka bir gün, kendi belirlediği 60 dakikalık bir blok oluşturur ve “Proje A - Tasarım” görevini ekler.
* Blok süresi bittiğinde uygulama sesli uyarı ve bildirim gönderir.
* Kullanıcı mola süresini kendi istediği gibi ayarladığı için kısa bir ara verir ve ardından yeni bir blok başlatır.

## İş Akışı

1. Çalışma türü seç (25-5, 90 dakika veya özel süre).
2. Mola süresini ayarla veya varsayılanı kullan.
3. Çalışma bloğunu başlat.

   * Eğer bloğa görev atanmışsa görevler otomatik görünür.
   * Görev atanmamışsa boş blok başlatılır.
4. Süre bitiminde sesli uyarı ve bildirim gönderilir.

## Fonksiyonel Gereksinimler

* Hazır şablon seçenekleri:

  * 25 dk çalışma + 5 dk mola (Pomodoro)
  * 90 dk çalışma bloğu
* Kullanıcı tarafından tanımlanabilir özel süreler.
* Mola sürelerinin manuel ayarlanabilmesi.
* Görev atandığında otomatik gösterim; görev atanmadığında boş blok seçeneği.
* Çalışma/mola bitiminde bildirim ve sesli uyarı.
* İstatistikler MVP’de olmayacak.
