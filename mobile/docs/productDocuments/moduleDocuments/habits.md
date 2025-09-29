# Focus Suite - Alışkanlık Takipçisi

## Özellik Tanımı

Alışkanlık Takipçisi, kullanıcıların günlük rutinlerini düzenli olarak sürdürmesini destekler. Kullanıcı, yapmak istediği aktiviteyi ve zamanını belirler. Belirlenen saatte bildirim gelir. Aktiviteyi tamamladığında kullanıcı uygulamada basılı tutarak tamamlandığını işaretler, ardından kısa bir sesli geri bildirim verilir. Gamification öğeleri (puan, rozet vb.) kullanılmaz.

## Kullanıcı Senaryosu

* Kullanıcı her gün saat 08:00’de “30 dakika kitap okuma” alışkanlığını ekler.
* Saat 08:00’de bildirim alır.
* Aktiviteyi tamamladıktan sonra uygulamayı açar, ilgili alışkanlık için butona basılı tutar.
* Basılı tutma işlemi tamamlandığında bir onay sesi çalar ve alışkanlık o gün için tamamlanmış sayılır.

## İş Akışı

1. Alışkanlık oluştur (isim + saat).
2. Belirlenen saatte bildirim gönder.
3. Kullanıcı aktiviteyi tamamladıktan sonra uygulamaya girer.
4. Kullanıcı butona basılı tutarak tamamlandığını işaretler.
5. Sistem onay sesi oynatır ve alışkanlık “tamamlandı” durumuna geçer.

## Fonksiyonel Gereksinimler

* Alışkanlık ekleme, düzenleme ve silme.
* Her alışkanlık için saat belirleme.
* Bildirim gönderme (masaüstü + mobil).
* Basılı tutma ile tamamlanma onayı.
* Tamamlama sonrası kısa bir sesli geri bildirim.
* Gamification unsurları yer almayacak.
