# 7. Diagrama de fluxo — cadastro de cliente

```mermaid
flowchart TD
    A[Usuário abre formulário de cliente] --> B[Preenche nome, CPF, telefone e e-mail]
    B --> C[Navegador envia POST /api/clientes]
    C --> D{Existe sessão válida?}
    D -- Não --> E[Responder 401]
    D -- Sim --> F[Validar nome]
    F --> G{Nome preenchido?}
    G -- Não --> H[Responder 400: informe o nome]
    G -- Sim --> I[Remover pontuação do CPF]
    I --> J{CPF possui 11 dígitos?}
    J -- Não --> K[Responder 400: CPF inválido]
    J -- Sim --> L[Validar formato do e-mail, se informado]
    L --> M{E-mail válido?}
    M -- Não --> N[Responder 400: e-mail inválido]
    M -- Sim --> O{CPF já cadastrado?}
    O -- Sim --> P[Responder 400: CPF duplicado]
    O -- Não --> Q[Criptografar CPF com AES-256-GCM]
    Q --> R[Inserir cliente no SQLite]
    R --> S[Responder 201 e atualizar listagem]
```

O diagrama representa a sequência implementada em `server.js`. A validação de CPF existente verifica comprimento e duplicidade, mas não os dígitos verificadores.
