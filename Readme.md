# 🚀 Project Management Federation (GraphQL Federation Demo)

This project demonstrates **GraphQL Federation** by breaking a monolithic schema into **3 microservices** (Clients, Projects, Users) and combining them with a **Gateway**.  
It also includes a **web client** to consume the unified supergraph.

> ⚡ This is **not full true federation** — here, microservices communicate with each other. The goal is to **show how federation works** and help you gain a **deeper understanding** of its concepts.

---

## 📂 Project Structure

```
PRJCT_MNGMNT_FDRTN
├── .turbo
├── node_modules
├── packages
├── server
│   ├── gateway
│   └── services
│       ├── clients-service
│       ├── projects-service
│       └── users-service
├── web
│   └── client
│       ├── index.html
│       ├── package.json
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       └── vite.config.ts
├── turbo
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## ▶️ Running the Project

### 🐳 Run all services and client using Docker

All services and the web client are dockerized. To start everything, run (IN ROOT FOLDER):

```bash
docker compose up --build
```

This will start:
- **Gateway**
- **Clients Service**
- **Projects Service**
- **Users Service**
- **Web Client**

> ⚠️ No need to manually install PNPM or run dev scripts. Docker handles everything.

---

### 🛠 Run individual services (Optional)

If you want to run a single service locally (without Docker):

In root folder run:

```bash
pnpm install
```

Navigate to the specific service folder and run:

```bash
pnpm run dev
```

Each service has its own `dev` script which:
- Runs `prisma generate` (for that service’s schema)
- Starts the service with `ts-node-dev`

For example:

```bash
cd server/services/clients-service
pnpm run dev
```

---

## 🌟 Why This Project?

### ✅ Monolithic Approach
Traditionally, you would keep **one database** and **one schema.ts** with all entities (Clients, Projects, Users).

### ✅ Federation Approach
Here, we split into **3 independent services**:
- **Clients Service**
- **Projects Service**
- **Users Service**

And combine them with a **Gateway** using **Apollo Federation**.  
This demonstrates the **power of composition**.

### ⚠️ Note on "True Federation"
- In **true federation**, services are **fully independent** and don’t talk to each other directly.  
- In this project, services **communicate** with each other — so this is a **demo setup** to understand federation concepts better.

---

## 🎯 Key Takeaways

- Learn how **federation stitches schemas** into a single graph.
- Understand how breaking services provides **better modularity** than a single schema.
- See how **microservices + GraphQL Gateway** can scale beyond monolithic setups.

---

## 🔑 Pre-seeded Users for Testing

You can login with the following users to test all functionalities:

```ts
export const users: User[] = [
  {
    email: "admin@system.com",
    password: "supersecret",
    role: "SUPERUSER",
  },
  {
    email: "john.doe@example.com",
    password: "password123",
    role: "USER",
  },
];
```

> If anyone wants to explicitly register a new user, it can be done through the **GraphQL server backend API (port 4001)** because the UI does not have a registration feature. You can login with the pre-seeded users above as the data is already seeded.

---

## 💡 Commands Summary

| Command | Where to run | Description |
|---------|--------------|-------------|
| `docker compose up --build` | root | Runs **all services + client** together using Docker |
| `pnpm run dev` | service folder | Runs a single service locally (with `prisma generate`) |

---

## 🎨 Screenshots & Diagrams (Optional)
_Add diagrams showing federation flow here for better understanding._

---

## 👨‍💻 Author
Built as a **learning project** to showcase **GraphQL Federation** with Docker, PNPM, Turbo, Prisma, and Apollo.

Enjoy exploring 🚀
