# 🚀 Rockit Vision — AI Hand Gesture Recognition

<p align="center">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastHTML-FF69B4?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastHTML">
  <img src="https://img.shields.io/badge/MediaPipe-00BFFF?style=for-the-badge&logo=google&logoColor=white" alt="MediaPipe">
  <img src="https://img.shields.io/badge/Scikit--Learn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white" alt="Scikit-Learn">
</p>

O **Rockit Vision** é um sistema inteligente de reconhecimento de gestos manuais em tempo real. Este projeto une o poder do **Google MediaPipe** para extração de pontos articulais com um modelo de **Machine Learning customizado** treinado via `scikit-learn`, tudo integrado em uma interface web moderna e reativa construída com **FastHTML**.

---

## ✨ Funcionalidades

- **📡 Processamento via WebSocket:** Comunicação bidirecional de baixa latência entre o navegador e o servidor Python.
- **🧠 Inteligência Híbrida:** Utiliza MediaPipe para detectar os 21 pontos da mão (*landmarks*) e um classificador customizado para interpretar o gesto.
- **🎨 UI "Soft Tech":** Interface responsiva com suporte a **Modo Escuro (🌙) e Claro (☀️)**, efeitos de Glassmorphism e micro-interações.
- **⚙️ Controle em Tempo Real:** Ajuste a qualidade da imagem enviada e ative/desative a visualização dos pontos da mão dinamicamente.
- **📈 Monitoramento de Performance:** FPS Tracker em tempo real para medir a fluidez da detecção.

---

## 🛠️ Arquitetura do Projeto

O projeto está organizado de forma modular seguindo as melhores práticas:

* **`app.py`**: Ponto de entrada do sistema, gerindo rotas e WebSockets.
* **`core/processor.py`**: Processamento de visão computacional e lógica de inferência.
* **`core/models.py`**: Configuração e carregamento dos modelos MediaPipe e Scikit-Learn.
* **`assets/`**: Estilização (CSS) e lógica de câmera no cliente (JavaScript).
* **`models/`**: Arquivos de inteligência serializados (`.task` e `.joblib`).

---

## 🚀 Como Executar

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/vitoriasmiranda/computer_vision_app.git](https://github.com/vitoriasmiranda/computer_vision_app.git)
   cd computer_vision_app
   
2. **Instale as dependências**
   ```bash
 pip install python-fasthtml mediapipe opencv-python scikit-learn joblib uvicorn
   
  3. **Inicie o servidor**
   ```bash
 python app.py

3. **Acesse no seu navegador**
   ```bash
 http://localhost:5001

