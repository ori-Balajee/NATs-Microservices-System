# Event-Driven Microservices Platform (NATS JetStream)

A decoupled, event-driven microservices backend built with **Node.js**, **Express**, **NATS JetStream**, and **MongoDB Atlas**. 
The system utilizes **NATS Request/Reply (RPC)** for synchronous service-to-service querying and **NATS JetStream (Pub/Sub)** for asynchronous, reliable message streaming with persistent consumers.

---

## Architecture Overview

```text
  ┌─────────────────┐
  │  Thunder Client │ (or Client App)
  └────────┬────────┘
           │ HTTP Requests
           ▼
  ┌─────────────────┐
  │   API Gateway   │ (Port 8000)
  └────────┬────────┘
           │ NATS Request/Reply (RPC)
           ▼
  ┌─────────────────┐           Persists User           ┌─────────────────┐
  │  User Service   │ ────────────────────────────────► │  MongoDB Atlas  │
  └────────┬────────┘                                   └─────────────────┘
           │
           │ Asynchronous Event: 'users.event.created'
           ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                        NATS JETSTREAM BROKER                           │
  │  Stream: USER_EVENTS                                                   │
  │  Subject: users.event.created                                          │
  │  Storage: Persistent Stream Storage                                    │
  └──────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     │ Push/Pull Stream Event
                                     ▼
                          ┌─────────────────────┐
                          │ Notification Service│ (Durable Consumer)
                          └──────────┬──────────┘
                                     ├─► Idempotency Guard (event_id)
                                     ├─► Welcome Email / Alert Processing
                                     └─► Explicit msg.ack()
```

---
## Key Features

* **Event-Driven Architecture (NATS JetStream):** Asynchronous Pub/Sub event streaming handles background tasks (like user registration alerts) instantly without blocking client HTTP responses.
* **Synchronous NATS RPC:** Low-latency Request/Reply communication between the API Gateway and microservices for user authentication, registration, and live log querying.
* **Live Desktop Notifications:** Integrated `node-notifier` in the Notification Service to display real-time native OS desktop popups whenever new user events arrive.
* **Stream Persistence & At-Least-Once Delivery:** Uses NATS JetStream stream storage and durable consumers to persist messages to disk, guaranteeing event recovery and redelivery even after service or broker crashes.
* **Pure Microservice Isolation:** Worker services communicate strictly over internal NATS channels without exposing unnecessary, vulnerable HTTP ports.
* **Idempotent Consumer Logic:** Prevents duplicate notification processing by validating unique `event_id` headers before execution.
* **JWT Security & Password Hashing:** Secure authentication flow using `bcryptjs` password hashing and signed JSON Web Tokens for protected API routes.

---

## ⚙️ Prerequisites & Setup

### Requirements
* **Node.js** (v18+)
* **NATS Server** (`nats-server -js`)
* **MongoDB Atlas** connection URI

---

### Environment Setup

Create a `.env` file in the project root:

```env
NATS_URL=nats://localhost:4222
PORT_GATEWAY=8000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/nova_db
JWT_SECRET=super_secret_jwt_key
```
## Installation

Install dependencies across all microservices:

```bash
cd api-gateway
npm install
cd ..

cd user-service
npm install
cd ..

cd notification-service
npm install
cd ..
```

## Running Locally

This project uses **Docker to run the NATS server**.

Make sure Docker is installed and running before starting the services.

### 1. Start NATS Server

Start the NATS server with JetStream using Docker:

```bash
docker run -d --name nats-server -p 4222:4222 -p 8222:8222 nats:latest -js
```

NATS will be available on:

```text
localhost:4222
```

JetStream monitoring will be available on:

```text
localhost:8222
```

### 2. Start User Service

Open a new terminal:

```bash
cd user-service
node server.js
```

### 3. Start Notification Service

Open another terminal:

```bash
cd notification-service
node server.js
```

### 4. Start API Gateway

Open another terminal:

```bash
cd api-gateway
node server.js
```

## Running Architecture

```text
Client
   |
   | HTTP
   v
API Gateway :8000
   |
   | NATS Request/Reply
   v
User Service
   |
   +-----> MongoDB Atlas
   |
   | Async Event
   | users.event.created
   v
NATS JetStream
   |
   v
Notification Service
```

## Testing

The application can be tested using **Thunder Client, Postman, or CLI commands**.

For example, you can send HTTP requests to the API Gateway:

```text
http://localhost:8000
```
