# Backlog — ecom-notification-service

> Registro vivo do progresso do projeto. Atualizado a cada mudança de estado de uma funcionalidade.
> **Ultima atualizacao:** 2025-03-15

---

## Sobre o Projeto

API REST para envio de notificacoes transacionais (e-mail, SMS e push) em plataforma de e-commerce. Oferece endpoints sincronos e estrutura para consumo assincrono via RabbitMQ.

**Versao atual:** `1.0.0`
**Repositorio:** [github.com/odevpedro/ecom-notification-service](https://github.com/odevpedro/ecom-notification-service)
**Stack principal:** Node.js 22 / Express 4.21 / Joi 17 / amqplib / nodemailer

---

## Legenda

| Simbolo | Significado |
|---------|-------------|
| `[ ]`   | Pendente |
| `[~]`   | Em andamento |
| `[x]`   | Concluido |
| `P0`    | Critico — bloqueia outras features |
| `P1`    | Alta prioridade |
| `P2`    | Media prioridade |
| `P3`    | Melhoria / nice-to-have |
| `XS` `S` `M` `L` `XL` | Estimativa de complexidade |

---

## Em Andamento

> Features atualmente sendo desenvolvidas. Idealmente, maximo de 2-3 itens simultaneos.

Nenhum item em andamento no momento.

---

## Pendentes

> Ordenadas por prioridade. Itens de P0 e P1 devem entrar em "Em Andamento" primeiro.

| Prioridade | Feature | Estimativa | Descricao |
|------------|---------|------------|-----------|
| `P1` | Integracao com provedor SMTP real | `M` | Substituir stub do nodemailer por envio real (Mailtrap / SendGrid / SES) |
| `P1` | Implementacao de envio de SMS | `M` | Integrar com provedor real (Twilio / Vonage) |
| `P1` | Implementacao de envio de Push | `M` | Integrar com provedor real (Firebase / OneSignal) |

| `P2` | Retry e fallback por canal | `M` | Logica de retentativa em falha de envio e fallback entre canais |
| `P2` | Templates de e-mail | `S` | Renderizacao de templates HTML para e-mails transacionais |
| `P3` | Rate limiting por destinatario | `S` | Evitar sobrecarga de notificacoes para o mesmo usuario |
| `P3` | Dashboard de metricas | `L` | Expor metricas de envio (sucesso, falha, latencia) |

---

## Concluidas

> Features finalizadas com suas respectivas datas de conclusao e links de referencia.

| Feature | Data | Descricao | Referencia |
|---------|------|-----------|------------|
| Consumo assincrono RabbitMQ | 2026-06-17 | NotificationConsumer com conexao real, exchange `ecom.order` (topic), fila `ecom.notification.order` vinculada com `order.#`, trata eventos `order.created` e `order.confirmed` disparando EmailService | [notification.consumer.js](../src/consumers/notification.consumer.js) |
| Envio de e-mail (stub) | 2025-03-01 | Implementacao do EmailService com console.log como stub | [email.service.js](../src/services/email.service.js) |
| Validacao Joi | 2025-03-01 | Schema de validacao com mensagens de erro para o payload | [notification.controller.js](../src/controllers/notification.controller.js) |
| Estrutura RabbitMQ | 2025-03-01 | Classe NotificationConsumer com conexao stub e log condicional | [notification.consumer.js](../src/consumers/notification.consumer.js) |
| Health checks | 2025-03-01 | Endpoints /health, /live, /ready | [app.js](../src/app.js) |
| Request ID | 2025-03-01 | Middleware X-Request-ID com fallback para randomUUID | [response.js](../src/middleware/response.js) |
| Error handler padronizado | 2025-03-01 | Middleware de erro com envelope JSON unificado | [error-handler.js](../src/middleware/error-handler.js) |
| Testes unitarios | 2025-03-01 | 5 cenarios (4 controller + 1 email service) | [notification.controller.test.js](../src/controllers/notification.controller.test.js), [email.service.test.js](../src/services/email.service.test.js) |

---

## Bugs Conhecidos

> Problemas identificados que ainda nao foram corrigidos.

| ID | Descricao | Severidade | Reportado em |
|----|-----------|------------|--------------|

Nenhum bug conhecido no momento.

---

## Notas & Decisoes Pendentes

> Pontos em aberto que precisam de decisao antes de serem desenvolvidos.

- Escolha do provedor SMTP para ambiente de producao (Mailtrap para staging, SendGrid vs SES para producao)
- Escolha do provedor de SMS (Twilio vs Vonage vs Zenvio)
- Estrategia de consumo RabbitMQ: um consumer por tipo de notificacao vs consumer unico com roteamento interno
- Formato da mensagem na fila: padronizar schema JSON para fila de notificacoes

---

## Historico de Versoes

| Versao | Data | Principais entregas |
|--------|------|---------------------|
| `1.0.0` | 2025-03-01 | Email stub, validacao Joi, estrutura RabbitMQ, health checks, testes |
