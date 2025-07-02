---
author: tnoer
pubDatetime: 2025-06-28T15:51:36Z
modDatetime: 2025-07-02T14:06:39Z
title: "ESP32 Dev Board Clone"
slug: bedah-esp32-dev-module
featured: true
draft: false
tags:
  - docs
  - esp32
description: Membedah struktur rangkaian dari board ESP32 Dev Module 30 pin berbasis USB Type-C dan CH340C
---

![Bedah ESP32 Dev Module](@/assets/images/bedah-esp32-dev-module.png)

Dalam analisis kali ini, saya menggunakan board **ESP32 Dev Module 30 pin** yang sudah memakai konektor **USB Type-C** dan menggunakan **CH340C** sebagai USB-to-Serial converter.

## Table of contents

## 📐 Struktur Rangkaian

Seperti terlihat pada skema, saya membagi rangkaian menjadi beberapa blok agar lebih mudah dipahami dan dianalisis—mulai dari USB-C, power, uploader, sampai blok tombol dan LED.

![ESP32 Dev Module Schema](@/assets/images/esp32-dev-module-schema.png)

### 🟣 Blok USB-C

Di bagian awal ada konektor **USB Type-C**. Konektor ini berfungsi ganda: sebagai jalur suplai daya dan juga media upload program. Tipe yang digunakan adalah **USB-C 16 pin**, dan ada hal penting: **pin CC (Configuration Channel)** perlu dihubungkan ke **pulldown resistor**. Tujuannya adalah agar perangkat upstream (seperti laptop atau PC) mengenali bahwa board ini berperan sebagai **UFP (Upstream Facing Port)**, alias port penerima daya dan data.

### 🔋 Blok Power

ESP32 membutuhkan tegangan **3.3V** untuk bisa berjalan, sementara USB memberikan tegangan **5V (VBUS)**. Maka dari itu, tegangan ini diturunkan menggunakan **regulator AMS1117-3.3**, dan untuk menjaga kestabilannya, ditambahkan beberapa **kapasitor** sebagai **decoupling** dan **filtering**.

Selain itu, board ini menyediakan **pin external power**, yang memungkinkan kita memberi daya dari sumber lain seperti baterai. Untuk mencegah arus balik dari sumber eksternal ke USB, digunakan **dioda proteksi**, ditambah **kapasitor tambahan** untuk menjaga kualitas tegangan masuk. Output dari AMS juga dilengkapi lagi dengan kapasitor sebelum akhirnya masuk ke sistem daya ESP32 dan menghidupkan **LED power indikator**.

### 🔁 Blok Uploader (CH340C)

Board ini menggunakan **CH340C** untuk menangani komunikasi serial dengan komputer. Chip ini sudah dilengkapi dengan **internal crystal oscillator**, jadi tidak perlu tambahan osilator eksternal.  
Pin data dari USB-C dihubungkan ke CH340C, lalu diteruskan ke **TX/RX** pada ESP32 (secara silang). Selain itu, **pin DTR dan RTS** dari CH340C dihubungkan ke rangkaian auto-reset, sehingga saat proses upload program dari Arduino IDE, kita gak perlu tekan tombol manual—otomatis masuk bootloader.

### 🔘 Blok Tombol & LED

Ada tombol **Reset** yang langsung terhubung ke **pin EN (Enable)** pada ESP32, lengkap dengan **resistor pull-up** dan **kapasitor** untuk mengurangi efek _debouncing_.  
Kemudian, **internal LED** pada board ini terhubung ke **GPIO D2**, melalui **pulldown resistor** dan **resistor pembatas arus** sebelum ke LED-nya.  
Dan terakhir, semua **pin output ESP32** dirutekan ke **header pin** sehingga gampang diakses untuk eksperimen atau integrasi dengan modul eksternal.

## 🔗 Hasil Implementasi

Analisis ini merupakan bagian dari proses perancangan PCB menggunakan KiCad, dan tidak sampai ke tahap produksi fisik. Fokusnya adalah menyusun skematik dan layout berdasarkan hasil tracing board ESP32 Dev Module.

![ESP32 Dev Module PCB](@/assets/images/esp32-dev-module-pcb.png)

File proyek lengkap bisa diunduh di tautan berikut:
[Github](https://github.com/toufiqnuur/esp32-dev-module)

## 📌 Catatan Tambahan:

Analisis ini saya susun berdasarkan riset mandiri melalui penelusuran jalur PCB, pembacaan dokumentasi, dan referensi yang relevan. Meskipun sudah saya usahakan seakurat mungkin, tidak menutup kemungkinan masih terdapat kekurangan atau kekeliruan dalam penyampaian maupun interpretasinya. Jadi, sangat terbuka untuk masukan, koreksi, atau diskusi lebih lanjut dari teman-teman yang punya insight tambahan!
