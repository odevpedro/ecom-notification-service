# ecom-notification-service

> Envio de notificações transacionais para plataforma de e-commerce — e-mail, SMS e push com suporte a consumo assíncrono via RabbitMQ.

[![License](https://img.shields.io/github/license/odevpedro/ecom-notification-service?style=flat-square)](./LICENSE)
[![Last Commit](https://img.shields.io/github/last-commit/odevpedro/ecom-notification-service?style=flat-square)](https://github.com/odevpedro/ecom-notification-service/commits/master)

---

## Sobre o Projeto

API REST responsável pelo envio de notificações transacionais. Oferece endpoints síncronos para disparo imediato e estrutura para consumo assíncrono via RabbitMQ. O envio de e-mail é implementado como stub (log no console); SMS e push têm retorno stub indicando "não implementado".

Faz parte de um ecossistema **polyglot** de microserviços (Node.js/Express, Python, Go, Java, TypeScript).

---

## Stack & Arquitetura

| Camada        | Tecnologia                          |
|---------------|--------------------------------------|
| Runtime       | Node.js 22                           |
| Framework     | Express 4.21                         |
| Validação     | Joi 17                               |
| Mensageria    | amqplib (RabbitMQ) — consumo real     |
| E-mail        | nodemailer — stub                    |
| Infra         | Docker + Docker Compose              |
| CI/CD         | GitHub Actions                       |
| Testes        | Jest + Supertest                     |

> Padrão arquitetural: **Layered Architecture** com `routes → controllers → services + consumer (messaging)`. Stub para canais não implementados.

---

## Estrutura de Pastas

```
src/
├── index.js                            # Entrypoint — inicia servidor + consumer
├── app.js                              # Configuração do Express
├── config/
│   ├── index.js                        # Carregamento de env vars
│   └── swagger.js                      # Configuração Swagger
├── routes/notification.routes.js       # POST /api/notifications/send
├── controllers/
│   ├── notification.controller.js      # Validação Joi + dispatch
│   └── notification.controller.test.js # 4 testes
├── services/
│   ├── email.service.js                # E-mail stub (log no console)
│   ├── email.service.test.js           # 1 teste
│   ├── email.config.js                 # Configuração SMTP
│   ├── email.provider.js               # Provider nodemailer
│   ├── sms.service.js / .test.js       # SMS (stub)
│   └── push.service.js / .test.js      # Push (stub)
├── consumers/notification.consumer.js  # RabbitMQ consumer (real)
└── middleware/
    ├── error-handler.js                # Error handler padronizado
    └── response.js                     # X-Request-ID middleware
```

---

## Como Rodar Localmente

### Pré-requisitos

- Docker + Docker Compose
- Node.js 22

### Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

A API estará disponível em `http://localhost:3008`.

### Variáveis de Ambiente

| Variável       | Descrição                            | Valor padrão (dev)                  |
|----------------|--------------------------------------|-------------------------------------|
| `PORT`         | Porta do servidor                    | `3008`                              |
| `RABBITMQ_URL` | URL de conexão com RabbitMQ          | `amqp://localhost:5672`             |
| `SMTP_HOST`    | Host do servidor SMTP                | `smtp.mailtrap.io`                  |
| `SMTP_PORT`    | Porta SMTP                           | `587`                               |
| `SMTP_USER`    | Usuário SMTP                         | *(vazio)*                           |
| `SMTP_PASS`    | Senha SMTP                           | *(vazio)*                           |
| `FROM_EMAIL`   | Remetente padrão                     | `noreply@ecom.local`                |
| `NODE_ENV`     | Ambiente de execução                 | `development`                       |

---

## Testes

```bash
npm test
```

**5 cenários:**
| Suite                       | Arquivo                              | Cenários |
|-----------------------------|--------------------------------------|----------|
| Unitários (controller)      | `notification.controller.test.js`    | 4        |
| Unitários (email service)   | `email.service.test.js`              | 1        |

---

## API — Endpoints

| Método | Rota                         | Descrição                    |
|--------|------------------------------|------------------------------|
| GET    | `/health`                    | Health check                 |
| GET    | `/live`                      | Liveness probe               |
| GET    | `/ready`                     | Readiness probe              |
| POST   | `/api/notifications/send`    | Envia notificação            |

> Documentação Swagger: `http://localhost:3008/docs`

---

## Documentação Técnica

| Documento                                        | Descrição                                 |
|--------------------------------------------------|-------------------------------------------|
| [Fluxos de Funcionalidades](./docs/system-feature-flows.md) | Fluxo interno de cada feature |
| [Modelo de Dados](./docs/data-model.md)          | Entidades, relacionamentos e enums        |
| [Backlog](./backlog.md)                          | Status de desenvolvimento                 |

---

## Status do Projeto

```
[x] Envio de e-mail (stub — log no console)
[x] Validação Joi com mensagens de erro
[x] Estrutura para consumo RabbitMQ
[x] Health checks + Request ID + erro padronizado
[x] Consumo assíncrono real via RabbitMQ (ecom.order exchange, eventos order.#)
[ ] Integração com provedor SMTP real
[ ] Implementação de SMS e Push
```

---

## Licença

Distribuído sob a licença MIT. Veja [LICENSE](./LICENSE) para mais informações.

---

<p align="center">
  Feito com foco em qualidade por <a href="https://github.com/odevpedro">@odevpedro</a>
</p>
