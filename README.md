# 📡 RadarTube AI - YouTube Viral Intelligence System

![Version](https://img.shields.io/badge/version-2.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Mistral-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/status-Active-brightgreen?style=for-the-badge)

> **Encontre os 20 melhores vídeos do seu nicho e gere conteúdo viral com Inteligência Artificial.**

## 🚀 Sobre o Projeto
O **RadarTube AI** é uma ferramenta de inteligência para criadores de conteúdo que analisa o algoritmo do YouTube em tempo real. Ele não apenas mostra tendências, mas calcula um **Score Viral** baseado em velocidade de crescimento, engajamento e atualidade, ajudando você a surfar a onda antes dos outros.

## ✨ Funcionalidades Principais

- 🔍 **Radar Viral**: Busca os 50 vídeos mais relevantes de um nicho e apresenta um ranking dos 20 melhores.
- 📊 **Score Viral Exclusivo**: Algoritmo proprietário que analisa:
  - ⚡ **Velocidade**: Views por hora (crescimento explosivo).
  - 💬 **Engajamento**: Interação real do público.
  - 🕐 **Atualidade**: Bônus para conteúdo recente (janela de 48h).
  - 📈 **Proporção**: Qualidade da audiência vs. clicks.
- 🤖 **Gerador de Conteúdo com IA**: Cria ganchos, roteiros, legendas e hashtags usando Mistral AI.
- 🔄 **Monitoramento em Tempo Real**: Auto-atualização dos dados para você nunca perder uma trend.
- 🌗 **Interface Futurista**: Design Dark Mode responsivo para Desktop e Mobile.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3 (Moderno com Variáveis), JavaScript (ES6+).
- **APIs**:
  - 🟥 YouTube Data API v3
  - 🟧 Mistral AI (Modelo Small Latest)
- **Arquitetura**: Single Page Application (SPA) leve, sem necessidade de backend complexo.

## 📦 Como Usar

### 1. Pré-requisitos
Você precisará de duas chaves de API (gratuitas):
1.  **YouTube Data API Key**: [Obter no Google Cloud Console](https://console.cloud.google.com/)
2.  **Mistral API Key**: [Obter na Mistral AI](https://console.mistral.ai/)

### 2. Instalação
Não é necessário instalar nada. Basta fazer o download ou clonar o repositório:

```bash
git clone https://github.com/SEU_USUARIO/radartube.git
cd radartube
```

### 3. Execução
Abra o arquivo `radartube.html` no seu navegador preferido (Chrome, Edge, Firefox).

### 4. Configuração
1.  Clique no botão **"⚙️ APIs"** no topo.
2.  Cole suas chaves nos campos indicados.
3.  Clique em **"ESCANEAR"** e comece a analisar.

## 🧠 Entendendo o Score Viral

O RadarTube usa uma fórmula ponderada para classificar os vídeos:

| Métrica | Peso | Descrição |
| :--- | :---: | :--- |
| **⚡ Velocidade** | 35% | Detecta vídeos que estão ganhando views muito rápido (Viralidade instantânea). |
| **💬 Engajamento** | 30% | Mede a interação (Likes + 2x Comentários) em relação às views. |
| **📈 Proporção** | 20% | Indica se o vídeo é "clickbait" ou se tem qualidade real de retenção. |
| **🕐 Atualidade** | 15% | O algoritmo do YouTube favorece vídeos novos (frescor). |

> 💡 **Dica Pro:** Ordene por **Velocidade** para ver o que está bombando *agora*, ou por **Engajamento** para entender qual *tipo* de conteúdo o público mais gosta.

## 📸 Screenshots
*## 📸 Screenshots

### Home
![Home](screenshots/home.png)

### Guia
![Dashboard](screenshots/guia.png)

### Estratégia
![Resultado](screenshots/estratégia.png)*

### API
![Resultado](screenshots/api.png)*


## 🤝 Contribuindo
Sinta-se livre para abrir Issues e Pull Requests. Toda ajuda para melhorar o algoritmo ou a interface é bem-vinda!

## 📄 Licença
Feito com 💜 por RodrigoXai
