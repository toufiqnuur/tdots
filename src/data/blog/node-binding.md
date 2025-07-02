---
author: tnoer
pubDatetime: 2025-07-02T14:07:41Z
modDatetime:
title: "Node Binding"
slug: node-binding
featured: true
draft: false
tags:
  - nodejs
description: Masalah klasik edge runtime
---

Sharing sedikit pengalaman—jadi waktu gue ngerjain proyek backend, ada kendala pas coba deploy ke Cloudflare Workers. Mungkin udah bisa nebak ya, arahnya ke mana? Yap, masalahnya muncul gara-gara Node.js native module.

Sebenernya gue udah beberapa kali liat orang mention masalah ini di Twitter. Tapi karena belum ngalamin sendiri, respons gue dulu cuma, "oh gitu ya…" lalu lanjut scroll tanpa kepikiran buat cari tahu lebih jauh. Ya begitualah, sering kejadian 😓.

Nah balik ke cerita. Jadi gue lagi bikin backend yang ada fitur autentikasi. Namanya fitur autentifikasi, pastinya ada fitur register dong. Nah, di sinilah semuanya bermula. Kayak yang kita tahu, password di database gak mungkin disimpan dalam bentuk plain text dong — harus di-hash dulu.

Umumnya untuk urusan hashing password kita pakai `bcrypt`, atau kalau mau yang lebih kekinian dan aman, pakai `argon2`. Gue pilih `argon2`. Tapi begitu gue coba deploy ke Cloudflare Workers, langsung... error. Tebak kenapa? Iya, karena argon2 pakai native module, dan Cloudflare Workers nggak bisa handle itu.

## Apa Itu Native Module?

Singkatnya, itu adalah fungsi yang ditulis dengan bahasa low-level (kayak C atau C++) lalu di-compile ke binary (`.node` file). Jadi library kayak argon2 sebenarnya gak require file .js, tapi langsung nge-load file binary ke Node.js.

Sebenernya ini bukan isu baru—gue aja yang telat dan baru sadar setelah kena sendiri 😂 Tapi karena penasaran, akhirnya gue ngulik lebih dalam dan baru ngeh: **Cloudflare Workers itu bukan Node.js runtime. Mereka pakai V8 engine yang di-_sandbox_, jadi nggak bisa akses file sistem atau load module native.** Makanya, banyak API Node.js yang gak jalan, terutama yang berhubungan dengan sistem file, native binding, atau networking low-level.

## Deploy Node App di Workers

Terus, **apakah berarti gak bisa deploy Node.js app ke Workers?**  
Gak juga. Cloudflare sekarang udah ngasih opsi buat pakai fitur `nodejs_compat` supaya sebagian besar API Node.js bisa diakses — dengan batasan, tentu aja. Ini bisa diaktifkan di `wrangler.jsonc`.

Contoh Setup Wrangler

`wrangler.jsonc`

```json
{
  "name": "app-worker",
  "compatibility_flags": ["nodejs_compat"]
}
```

Dengan flag ini, kita bisa pakai beberapa fitur built-in seperti `crypto`, `buffer`, `stream`, bahkan `process.env` (dengan tambahan flag `nodejs_compat_populate_process_env`).

Buat daftar lengkap API Node.js yang didukung, bisa dicek di sini:
https://developers.cloudflare.com/workers/runtime-apis/nodejs/#supported-nodejs-apis

## Flag Aja Nggak Cukup

Tapi, dengan aktifkan flag `nodejs_compat`, apakah masalah langsung selesai? Jawabannya: tidak juga. Flag ini memang bikin banyak fitur Node.js bisa diakses — tapi dia tidak membuat native module seperti `argon2` atau `bcrypt` versi `.node` bisa jalan. Karena dia butuh akses ke modul bawaan Node.js seperti `fs` (file system), yang saat ini belum disupport di Cloudflare Workers.

Artinya, meskipun flag ini membantu banget, kalian tetap harus pakai alternatif hashing yang memang pure JavaScript — kayak `bcryptjs`, `scrypt-js`, atau `crypto.subtle` (PBKDF2) kalau mau aman dan compatible di lingkungan edge seperti Cloudflare Workers

## Penutup

Solusinya? Ganti ke hashing alternatif seperti `bcryptjs`, `scrypt-js`, atau Web Crypto (`crypto.subtle`) — semua ini pure JavaScript dan udah terbukti bisa jalan mulus di Cloudflare Workers

Gue tulis ini sambil nyimpen pengalaman biar gak lupa sendiri kalau nemu error serupa. Siapa tahu juga bermanfaat buat kalian yang lagi coba-coba main di Edge Computing. Kalau kalian lagi pusing karena error serupa: tenang, kalian gak sendiri 😄
