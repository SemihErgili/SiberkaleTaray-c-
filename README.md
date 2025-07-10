git push origin main --force-with-lease
# Siber Kale Hack Tarayıcısı

Bu proje, siber güvenlik konuları üzerine yapay zeka destekli, derinlemesine teknik analizler sunan bir Next.js uygulamasıdır. Kullanıcılar bir siber güvenlik aracını, tekniğini veya kavramını aratarak, yapay zeka tarafından oluşturulmuş uygulamalı ve kod örnekleri içeren analizlere ulaşabilirler.

## Özellikler

- **Yapay Zeka Destekli Analiz:** Google Gemini modeli kullanılarak siber güvenlik konuları hakkında detaylı raporlar oluşturulur.
- **Uygulamalı Örnekler:** Analizler, teorik bilgilerin yanı sıra pratik kod örnekleri ve senaryolar içerir.
- **Üç Sütunlu Arayüz:** Konu başlığı, analiz bölümleri ve içerik detayı olmak üzere organize bir sunum sağlar.
- **Modern Teknoloji Stack'i:** Next.js (App Router), React, Tailwind CSS ve shadcn/ui ile geliştirilmiştir.

## Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin.

### 1. Projeyi Klonlama

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Bağımlılıkları Yükleme

```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlama

Projenin çalışabilmesi için bir Google Gemini API anahtarına ihtiyacınız vardır.

1.  Proje kök dizininde `.env` adında bir dosya oluşturun.
2.  Dosyanın içine aşağıdaki gibi API anahtarınızı ekleyin:

    ```
    GEMINI_API_KEY=AIzaSy...
    ```

### 4. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

Uygulama artık `http://localhost:9002` adresinde çalışıyor olacaktır.

## Vercel'e Dağıtım

Bu projeyi Vercel'e dağıtmak için, projenizin Vercel ayarlarından **Environment Variables** (Ortam Değişkenleri) bölümüne gidip `GEMINI_API_KEY` anahtarınızı oraya eklemeniz gerekmektedir. `.env` dosyası güvenlik nedeniyle dağıtıma dahil edilmez.
