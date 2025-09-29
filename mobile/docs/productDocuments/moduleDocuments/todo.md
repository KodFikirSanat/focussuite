# Focus Suite - To-Do List

## Özellik Tanımı

Görev yönetimi özelliği, kullanıcıların projeler veya kişiler bazında görevler oluşturmasına, öncelik seviyelerini belirlemesine ve kaynaklar eklemesine imkân tanır. Esnek hiyerarşi sayesinde herkes kendi ihtiyaçlarına uygun bir yapı kurabilir. Görevler ayrıca zamanlayıcı ve planlama özellikleriyle entegre çalışır.

## Kullanıcı Senaryosu

* Bir kullanıcı, “Proje A” adında bir parent oluşturur ve altına yapılacak görevler ekler.
* Parent’a kaynak ekler (örneğin bir döküman linki veya kısa bir not).
* Görevlerden birini “Yakın Vade” önceliğine alır.
* Kullanıcı “Yarını Planla” özelliğiyle ertesi gün için sabah ve öğleden sonra iki çalışma bloğu tanımlar.
* İlgili görevleri bu bloklara atar ve ertesi gün blokları başlatarak görevleri tamamlar.

## İş Akışı

1. Parent (Proje/Kişi vb.) oluştur.
2. Parent’a kaynak ekle (link veya not).
3. Parent altına görev ekle.
4. Görev için öncelik belirle (Yakın Vade / Orta Vade / Uzun Vade).
5. Görevleri çalışma bloklarına ata (“Yarını Planla”).
6. Çalışma bloklarını başlat ve ilerlemeyi takip et.

## Fonksiyonel Gereksinimler

* Parent oluşturma ve silme.
* Parent’a kaynak ekleme (link veya not).
* Görev oluşturma, düzenleme, tamamlama, silme.
* Öncelik gruplarının sabit olması:

  * Yakın Vade
  * Orta Vade
  * Uzun Vade
* Çalışma bloklarının serbestçe tanımlanabilmesi.
* Görevlerin manuel olarak bloklara atanması.
* Zamanlayıcı ile entegrasyon: kullanıcı blokları istediği an başlatabilir.
