# OwnEnergy (Projeto UPX3)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**OwnEnergy** é um sistema de gerenciamento de energia e automação residencial escalável e modular, projetado para controlar, monitorar e automatizar diversos dispositivos dentro de um ambiente de casa inteligente (Smart Home), não se limitando apenas à iluminação. 

Este repositório contém o código completo do projeto, dividido em duas frentes principais:
- **FrontEnd**: Aplicação web moderna para interface com o usuário.
- **BackEnd**: Arquitetura de microsserviços robusta para processamento, controle e persistência de dados.

---

## 🏗️ Arquitetura do Projeto

O sistema **OwnEnergy** utiliza uma arquitetura baseada em microsserviços no backend e uma Single Page Application (SPA) no frontend, garantindo escalabilidade, facilidade de manutenção e modularidade.

### 💻 FrontEnd

O FrontEnd é construído com tecnologias modernas voltadas para performance e tipagem segura:

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite (com Fast Refresh e otimização de build)
- **UI/Estilização:** Material-UI (MUI), Emotion
- **Gráficos e Visualização de Dados:** Chart.js, React-Chartjs-2
- **Roteamento:** React Router DOM
- **Requisições HTTP:** Axios

Para mais detalhes, consulte o [README do FrontEnd](./FrontEnd/README.md).

### ⚙️ BackEnd

O BackEnd adota uma **arquitetura de microsserviços**, desenvolvida em **.NET 8.0**, utilizando o **Ocelot** como API Gateway.

Os microsserviços são divididos por domínio:

- **DeviceService**: Gerenciamento e controle de dispositivos (ligar/desligar). Utiliza banco de dados relacional.
- **UserService**: Autenticação, autorização (JWT) e registro de usuários.
- **AutomationService**: Gerenciamento de rotinas, agendamentos, cômodos e grupos de dispositivos.
- **EnergyService**: Monitoramento de consumo de energia utilizando banco NoSQL (MongoDB) para alta escalabilidade.
- **APIGateway**: Roteamento, agregação de respostas e segurança centralizada utilizando Ocelot.

Para mais detalhes sobre arquitetura, comunicação síncrona/assíncrona e exemplos de banco de dados, consulte o [README do BackEnd](./BackEnd/README.md).

---

## 🚀 Como Executar o Projeto Localmente

Siga as instruções abaixo para rodar o projeto inteiro em seu ambiente local.

### Pré-requisitos

- **Node.js** (versão 18+ recomendada)
- **.NET 8.0 SDK** ou superior
- **PostgreSQL** (para os serviços relacionais)
- **MongoDB** (opcional, para o EnergyService)
- **Docker** (opcional, para rodar via containers)

### 1. Configurando o BackEnd

1. Navegue até a pasta do BackEnd:
   ```bash
   cd BackEnd
   ```
2. Configure as variáveis de ambiente criando um arquivo `.env` na raiz do BackEnd (ou configurando os arquivos `appsettings.json` de cada microsserviço) com as strings de conexão dos bancos de dados:
   ```env
   DEVICE_SERVICE_DB_CONNECTION=Sua_String_Conexao_PostgreSQL
   USER_SERVICE_DB_CONNECTION=Sua_String_Conexao_PostgreSQL
   AUTOMATION_SERVICE_DB_CONNECTION=Sua_String_Conexao_PostgreSQL
   ENERGY_SERVICE_DB_CONNECTION=Sua_String_Conexao_MongoDB
   ```
3. Execute os microsserviços individualmente:
   ```bash
   cd OwnEnergy.UserService
   dotnet run
   
   # Em outro terminal
   cd ../OwnEnergy.DeviceService
   dotnet run
   
   # E assim por diante...
   ```
4. Por fim, inicie o **API Gateway**:
   ```bash
   cd OwnEnergy.APIGateway
   dotnet run
   ```

### 2. Configurando o FrontEnd

1. Abra um novo terminal e navegue até a pasta do FrontEnd:
   ```bash
   cd FrontEnd
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse a aplicação no seu navegador padrão pelo endereço disponibilizado pelo Vite (geralmente `http://localhost:5173`).

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir, siga os passos abaixo:

1. Faça um Fork do repositório
2. Crie uma nova branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Faça o commit de suas mudanças (`git commit -m 'Adicionando uma nova feature'`)
4. Faça o push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é licenciado sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
