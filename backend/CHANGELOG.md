[0.1.0] - 2025-08-07
Adicionado
Módulo clients:

Endpoint POST /clients com validação usando ZodValidationPipe.

Endpoint GET /clients para listar todos os clientes.

Endpoint GET /clients/:id para buscar cliente por ID.

Endpoint PATCH /clients/:id com validação via Zod para atualização.

Endpoint DELETE /clients/:id para remoção lógica.

Integração com PrismaService para operações no banco.

Schemas de validação (createClientSchema e updateClientSchema) no formato Zod com tipagem gerada automaticamente.

Pipe de validação personalizado (ZodValidationPipe) para garantir dados tipados e validados na entrada.

Corrigido
Erro de injeção de dependência do PrismaService no ClientsService (adicionado import do módulo correto).
## [0.1.0] - 2025-08-07

### Adicionado

**Módulo `clients`**:
  Aplicação do `ZodValidationPipe` para validação de dados no `POST` e `PATCH`.
  Tipagem automática via DTOs gerados a partir dos schemas Zod (`CreateClientDto` e `UpdateClientDto`).
  Endpoints criados:
    `POST /clients` - Criação de cliente
    `GET /clients` - Listagem de clientes
    `GET /clients/:id` - Detalhes de cliente por ID
    `PATCH /clients/:id` - Atualização de cliente
    `DELETE /clients/:id` - Remoção de cliente

**Pipe de validação personalizado (`ZodValidationPipe`)**:
  Conversão automática de strings para objeto JSON no body quando necessário.
  Mensagens de erro humanizadas e agrupadas por campo.

**Integração com `PrismaService`**:
  Persistência real dos dados no banco.
  Retorno tipado usando os modelos do Prisma.

### Corrigido

Ajuste na injeção de dependência do `PrismaService` no `ClientsService` para evitar falhas de inicialização.
