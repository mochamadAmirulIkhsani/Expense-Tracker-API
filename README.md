# <h1>README — NestJS Simple REST API (JWT + SQL + E2E Test)</h1>

## Deskripsi Project

Project ini adalah REST API sederhana menggunakan NestJS + TypeScript dengan autentikasi JWT dan database SQL (PostgreSQL/MySQL).

Arsitektur Project (Pattern yang digunakan)
Project ini menggunakan Modular Architecture (Feature-based Module Pattern)

### Contoh struktur

src/
 ├── auth/
 ├── users/
 ├── categories/
 ├── transactions/
 ├── prisma/
 └── common/

### Kenapa menggunakan pattern ini?

mudah menambah fitur tanpa merusak struktur lama, tiap fitur punya controller, service, module sendiri, Nest memang berbasis modular, debugging lebih mudah karena fitur terpisah, bisa kerja paralel di module berbeda

API Documentation

Dokumentasi API tersedia menggunakan Postman:
bisa diakses: <https://documenter.getpostman.com/view/39740222/2sBXwvJU6D>

Cara Menjalankan Project

### install dependency

npm install

### setup database

npx prisma migrate dev

### run server

npm run start:dev

### run test

npm run test:e2e
