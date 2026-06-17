# System Feature Flows

> Registro historico e incremental dos fluxos internos de cada funcionalidade.
> Este documento cresce a cada nova feature implementada e **nunca tem secoes removidas**.

---

## Indice

- [Visao Geral da Arquitetura](#visao-geral-da-arquitetura)
- [Convencoes deste Documento](#convencoes-deste-documento)
- [Feature: Envio de Notificacao](#feature-envio-de-notificacao)
- [Feature: Consumo RabbitMQ](#feature-consumo-rabbitmq)

---

## Visao Geral da Arquitetura

**Padrao arquitetural:** Layered Architecture (routes -> controllers -> services)

**Fluxo global de uma requisicao:**

```
HTTP Request
    └── Middleware (Request ID, JSON parse)
            └── Controller (validacao Joi + dispatch)
                    └── Service (stub — console.log / retorno placeholder)
```

**Camadas e responsabilidades:**

| Camada | Responsabilidade |
|--------|------------------|
| `middleware` | X-Request-ID, error handler padronizado |
| `routes` | Mapeamento HTTP para controllers |
| `controllers` | Validacao Joi do payload, dispatch por tipo de notificacao |
| `services` | Logica de envio (stub) |
| `consumers` | Consumo de mensagens RabbitMQ (stub) |

---

## Convencoes deste Documento

- **Respostas de erro** seguem envelope unificado: `{ data: null, error: { code, message, details }, meta: { requestId } }`
- **Todas as requisicoes** recebem um `X-Request-ID` unico, seja do header do cliente ou gerado internamente via `crypto.randomUUID()`
- **Stubs** sao implementacoes placeholder que logam no console ou retornam mensagem "not implemented"
- **Validacao** e centralizada no controller com Joi — o schema usa `.when()` para regras condicionais

---

---

# Feature: Envio de Notificacao

> **Versao:** 1.0.0
> **Implementada em:** 2025-03-01
> **Status:** Concluida

---

## Resumo

Permite que servicos internos (checkout, auth, etc.) disparem notificacoes transacionais para usuarios. Atualmente o envio de e-mail e funcional como stub (log no console); SMS e Push retornam resposta de "nao implementado".

**Motivacao:** Servicos do e-commerce precisam notificar usuarios sobre confirmacao de pedido, reset de senha, alertas de pagamento, etc. sem depender de provedores externos durante o desenvolvimento.

**Resultado:** API REST funcional para integracao entre servicos, com contrato estavel mesmo que os canais de envio reais ainda nao estejam implementados.

---

## Fluxo Principal

### 1. Ponto de Entrada

- **Tipo:** HTTP REST
- **Arquivo:** `src/routes/notification.routes.js`
- **Rota/Evento:** `POST /api/notifications/send`
- **Autenticacao:** Publica (ambiente interno)

A requisicao chega no `Router` do Express e e delegada ao metodo `send` do `NotificationController`.

---

### 2. Validacao de Entrada

- **Arquivo:** `src/controllers/notification.controller.js`
- **Biblioteca:** Joi 17

| Campo | Tipo | Obrigatorio | Regra de validacao |
|-------|------|-------------|---------------------|
| `type` | string | Sim | Deve ser `email`, `sms` ou `push` |
| `to` | string | Sim | Qualquer string nao vazia |
| `subject` | string | Condicional | Obrigatorio quando `type = 'email'` (via `Joi.when()`) |
| `body` | string | Sim | Qualquer string nao vazia |

**Falha de validacao:** retorna HTTP 400 com a mensagem de erro do Joi no formato `{ error: "mensagem" }`.

---

### 3. Orquestracao da Aplicacao

- **Arquivo:** `src/controllers/notification.controller.js`

1. Controller recebe `req.body` apos middlewares (JSON parse + Request ID)
2. Executa `sendSchema.validate(req.body)` com Joi
3. Se falhar -> retorna 400 com mensagem de erro
4. Se `type = 'email'`:
   - Instancia `EmailService` e chama `send({ to, subject, body })`
   - EmailService loga os dados no console e retorna `{ status: "sent", provider: "stub", to, subject }`
   - Controller retorna 200 com o resultado
5. Se `type = 'sms'` ou `type = 'push'`:
   - Controller retorna 200 com `{ status: "stub", type, message: "not implemented" }`

---

### 4. Regras de Negocio

| Regra | Descricao | Localizacao no Codigo |
|-------|-----------|----------------------|
| Subject obrigatorio para email | O campo `subject` e exigido apenas para notificacoes do tipo email | `src/controllers/notification.controller.js:7` |
| Canal nao implementado retorna stub | SMS e Push retornam status "stub" com mensagem "not implemented" sem processamento | `src/controllers/notification.controller.js:31` |
| Provider identificado na resposta | O campo `provider` indica qual mecanismo foi usado (`stub`) | `src/services/email.service.js:12` |

---

### 5. Persistencia / Integracoes

**Integracoes externas:**

| Servico | Operacao | Timeout | Retry |
|---------|----------|---------|-------|
| Email (stub) | `console.log` | N/A | N/A |

Nao ha persistencia — o servico e stateless.

---

### 6. Resposta Final

**Sucesso — `200`: email**

```json
{
  "status": "sent",
  "provider": "stub",
  "to": "usuario@exemplo.com",
  "subject": "Confirmacao de Pedido"
}
```

**Sucesso — `200`: sms / push**

```json
{
  "status": "stub",
  "type": "sms",
  "message": "not implemented"
}
```

**Campos retornados:**

| Campo | Tipo | Descricao |
|-------|------|-----------|
| `status` | string | `sent` (email) ou `stub` (sms/push) |
| `provider` | string | Eco do provider utilizado |
| `to` | string | Eco do destinatario (apenas email) |
| `subject` | string | Eco do assunto (apenas email) |
| `type` | string | Tipo original (apenas sms/push) |
| `message` | string | Texto explicativo (apenas sms/push) |

---

## Fluxos Alternativos e Erros

| Cenário | HTTP Status | Codigo de Erro | Mensagem |
|---------|-------------|----------------|----------|
| Campos obrigatorios ausentes | 400 | N/A | `"\"body\" is required"` |
| Tipo invalido | 400 | N/A | `"\"type\" must be one of [email, sms, push]"` |
| Subject ausente para email | 400 | N/A | `"\"subject\" is required"` |

> **Importante:** Atualmente os erros retornam o formato simplificado `{ error: "mensagem" }`. O middleware `error-handler.js` usa o formato padrao `{ data, error, meta }` com requestId, mas nao e acionado para erros de validacao tratados explicitamente no controller.

---

## Diagrama de Sequencia

### Fluxo de envio de e-mail

```mermaid
sequenceDiagram
    actor Client
    participant Express
    participant RequestID
    participant Controller
    participant EmailService
    participant Console

    Client->>Express: POST /api/notifications/send
    Express->>RequestID: middleware
    RequestID-->>Express: X-Request-ID gerado
    Express->>Express: JSON parse
    Express->>Controller: send(req, res)

    rect rgb(240, 240, 240)
        Note over Controller: Validacao Joi
        Controller->>Controller: validate({ type, to, subject, body })
        alt Dados invalidos
            Controller-->>Client: 400 { error: "... validação ..." }
        end
    end

    rect rgb(230, 240, 250)
        Note over Controller: Email stub
        Controller->>EmailService: send({ to, subject, body })
        EmailService->>Console: console.log("--- Email Stub ---")
        EmailService->>Console: console.log(From, To, Subject, Body)
        EmailService-->>Controller: { status: "sent", provider: "stub", to, subject }
    end

    Controller-->>Client: 200 { status, provider, to, subject }
```

### Fluxo de envio de SMS / Push

```mermaid
sequenceDiagram
    actor Client
    participant Express
    participant Controller

    Client->>Express: POST /api/notifications/send
    Express->>Express: Middleware chain
    Express->>Controller: send(req, res)

    rect rgb(240, 240, 240)
        Note over Controller: Validacao Joi
        Controller->>Controller: validate({ type, to, body })
        alt Dados invalidos
            Controller-->>Client: 400
        end
    end

    rect rgb(255, 235, 200)
        Note over Controller: Canal nao implementado
        Controller-->>Client: 200 { status: "stub", type, message: "not implemented" }
    end
```

---

## Decisoes Tecnicas

### ADR-001 — Stub de e-mail com console.log

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceita |
| **Data** | 2025-03-01 |
| **Contexto** | Necessidade de disponibilizar a API para integracao entre servicos antes de contratar provedor SMTP |
| **Decisao** | Implementar envio de e-mail como stub que loga os dados no console e retorna status "sent" |
| **Consequencias** | Permite desenvolvimento paralelo dos servicos consumidores; o contrato da API ja reflete o comportamento final (rota, payload, resposta) |

### ADR-002 — Validacao Joi com Joi.when() para subject condicional

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceita |
| **Data** | 2025-03-01 |
| **Contexto** | O campo `subject` so faz sentido para e-mails, mas o schema precisa rejeitar requisicoes de email sem assunto |
| **Decisao** | Usar `Joi.string().when('type', { is: 'email', then: Joi.required(), otherwise: Joi.optional() })` |
| **Consequencias** | Regra de negocio declarativa dentro do schema, sem if/else no controller |

### ADR-003 — SMS e Push como stub simples no controller

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceita |
| **Data** | 2025-03-01 |
| **Contexto** | SMS e Push ainda nao serao implementados, mas precisam de contrato de API definido |
| **Decisao** | Retornar `{ status: "stub", type, message: "not implemented" }` diretamente do controller, sem instanciar services |
| **Consequencias** | Sem complexidade desnecessaria de services vazios; facil remover o stub quando a implementacao real chegar |

---

## Trechos de Codigo Relevantes

### Schema de validacao com Joi.when()

```javascript
const sendSchema = Joi.object({
  type: Joi.string().valid('email', 'sms', 'push').required(),
  to: Joi.string().required(),
  subject: Joi.string().when('type', {
    is: 'email',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  body: Joi.string().required(),
});
```

### Dispatcher por tipo

```javascript
if (value.type === 'email') {
  const result = await this.emailService.send({ ... });
  return res.json(result);
}
return res.json({ status: 'stub', type: value.type, message: 'not implemented' });
```

---

---

# Feature: Consumo RabbitMQ

> **Versao:** 1.0.0
> **Implementada em:** 2026-06-17
> **Status:** Concluida

---

## Resumo

O Notification Service consome eventos de dominio do RabbitMQ. Conecta-se ao broker na inicializacao, declara a exchange `ecom.order` (topic) e a fila `ecom.notification.order` vinculada com routing key `order.#`. Mensagens sao processadas assincronamente: eventos `order.created` e `order.confirmed` disparam envio de e-mail via `EmailService.send()`.

**Motivacao:** Processar notificacoes de forma assincrona e desacoplada, sem depender de chamadas HTTP sincronas entre servicos.

**Resultado:** Notificacoes de criacao e confirmacao de pedido sao enviadas automaticamente quando o Order Service publica eventos no RabbitMQ.

---

## Fluxo Principal

### 1. Ponto de Entrada

- **Tipo:** Inicializacao do servico
- **Arquivo:** `src/index.js`
- **Disparo:** Ao iniciar o servico Node, apos carregar config

`index.js` instancia `NotificationConsumer` e chama `start()`.

---

### 2. Conexao e Setup

- **Arquivo:** `src/consumers/notification.consumer.js`

1. `process.env.RABBITMQ_URL` e verificado
2. Se nao definido, exibe log "stub mode" e retorna sem conectar
3. Se definido, tenta conectar via `amqplib.connect()`
4. Apos conectar:
   - Cria canal
   - Declara exchange `ecom.order` (topic, durable)
   - Declara fila `ecom.notification.order` (durable)
   - Vincula fila a exchange com routing key `order.#`
   - Inicia consumo

### 3. Processamento de Mensagens

```javascript
this.channel.consume('ecom.notification.order', async (msg) => {
    const event = JSON.parse(msg.content.toString());
    await this.handleEvent(event);
    this.channel.ack(msg);
});
```

### 4. Roteamento de Eventos

| Event Type | Acao | Email enviado |
|------------|------|---------------|
| `confirmed` | `EmailService.send()` | "Order Confirmed" com valor total |
| `created` | `EmailService.send()` | "Order Created" em processamento |

O destinatario e construido como `user-{userId}@ecom.local` (placeholder — em producao, buscatia o email real do servico de usuarios).

---

## Fluxos Alternativos e Erros

| Cenário | Comportamento |
|---------|---------------|
| `RABBITMQ_URL` nao definido | Loga "stub mode" e retorna |
| Conexao falha | Loga warning "stub mode" com mensagem de erro |
| Conexao perdida apos sucesso | Loga warning, tenta reconectar apos 5s |
| Mensagem malformada (JSON invalido) | Rejeita (`nack`) sem reenfileirar |
| Event type desconhecido | Loga "Unknown event type" e faz `ack` |

---

## Decisoes Tecnicas

### ADR-004 — Consumer separado dos controllers

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceita |
| **Data** | 2025-03-01 |
| **Contexto** | O consumo de mensagens e um fluxo de entrada diferente (mensageria vs HTTP) que nao deve compartilhar a mesma logica de request/response |
| **Decisao** | Criar classe `NotificationConsumer` em diretorio `consumers/`, independente do fluxo HTTP, que reutiliza os mesmos services |
| **Consequencias** | Separa clara de responsabilidades; facil testar cada fluxo isoladamente; o consumer pode evoluir para suportar multiplas filas |

### ADR-005 — Email placeholder para desenvolvimento

| Campo | Detalhe |
|-------|---------|
| **Status** | Aceita |
| **Data** | 2026-06-17 |
| **Contexto** | O evento do Order Service contem `userId` mas nao o email do usuario. O Notification Service nao possui acesso ao user-service para fazer a resolucao. |
| **Decisao** | Usar `user-{userId}@ecom.local` como placeholder durante o desenvolvimento. Em producao, o consumer deve buscar o email real via API do user-service ou recebe-lo no payload do evento. |
| **Consequencias** | Permite testar o fluxo completo sem dependencia do user-service, mas o email enviado nao e real. |

---

## Trechos de Codigo Relevantes

```javascript
class NotificationConsumer {
  async start() {
    if (!process.env.RABBITMQ_URL) {
      console.log('RABBITMQ_URL not set — Notification Consumer in stub mode');
      return;
    }
    try {
      this.connection = await amqp.connect(process.env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange('ecom.order', 'topic', { durable: true });
      await this.channel.assertQueue('ecom.notification.order', { durable: true });
      await this.channel.bindQueue('ecom.notification.order', 'ecom.order', 'order.#');
      this.channel.consume('ecom.notification.order', async (msg) => { ... });
    } catch (err) {
      console.warn('RabbitMQ connection failed — stub mode:', err.message);
    }
  }

  async handleEvent(event) {
    switch (event.eventType) {
      case 'confirmed':
        await this.emailService.send({
          to: `user-${event.userId}@ecom.local`,
          subject: 'Order Confirmed',
          body: `Your order ${event.orderId} for ${(event.totalCents / 100).toFixed(2)} has been confirmed.`,
        });
    }
  }
}
```
