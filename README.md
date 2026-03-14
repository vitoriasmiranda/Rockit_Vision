# 🖐️ Rockit Vision – AI Hand Gesture Recognition

![Rockit Vision Preview](./computer_vision_app/assets/images/preview.png) *(Substitua por um screenshot do seu app rodando!)*

**Rockit Vision** é uma aplicação web de inteligência artificial construída com **FastHTML** e **Python**. O projeto tem o objetivo de realizar o reconhecimento e a classificação de gestos feitos com as mãos em tempo real usando a webcam do usuário.

Desenvolvido durante a Trilha Python da **Next Level Week (NLW) 2026** por [Vitória Miranda](https://github.com/vitoriasmiranda).

---

## 🚀 Como Funciona?

O aplicativo combina três frentes de tecnologia para levar Inteligência Artificial para o navegador com resposta em milissegundos:

1. **Captura em Tempo Real (FastHTML + WebSockets):** A interface web solicita acesso à sua webcam. Os frames de vídeo capturados são enviados de forma contínua (via WebSockets) para o servidor Python, sem a necessidade de recarregar a página.
2. **Mapeamento Articular (MediaPipe):** No backend, a biblioteca do Google **MediaPipe** recebe esses frames e identifica os pontos-chave (landmarks) das suas mãos, desenhando as articulações em tempo real.
3. **Predição Inteligente (Scikit-Learn):** A partir das coordenadas geradas, um modelo de *Machine Learning* customizado (treinado com scikit-learn) calcula as distâncias entre esses pontos e "adivinha" qual gesto (Pedra, Papel, Tesoura, Paz, etc.) você está fazendo. Os labels e porcentagens de probabilidade voltam pela conexão WebSocket para a sua tela.

---

## 🛠️ Tecnologias Utilizadas

- **[FastHTML](https://fastht.ml):** Framework em Python para desenvolver aplicações web completas (HTML, CSS e JS do lado do cliente + WebSockets) de forma muito rápida utilizando componentes unificados.
- **[Google MediaPipe](https://developers.google.com/mediapipe):** Solução de visão computacional pré-treinada para detecção e rastreamento de pontos-chave das mãos (Hand Landmarks).
- **[Scikit-Learn (sklearn)](https://scikit-learn.org/):** Biblioteca para machine learning clássico, usada no treinamento e inferência do classificador de gestos.
- **[OpenCV (cv2)](https://opencv.org/):** Biblioteca subjacente de renderização e processamento de imagem em Python.
- **[uv](https://github.com/astral-sh/uv):** Gerenciador e instalador de pacotes e ambientes virtuais ultrarrápido escrito em Rust.

---

## ⚙️ Pré-Requisitos

Para rodar essa aplicação na sua máquina, certifique-se de ter os seguintes itens na sua máquina:

- [Python 3.12](https://www.python.org/downloads/) (ou superior)
- Um navegador web compatível com captura de vídeo
- Uma Webcam funcional 📷

---

## 💻 Instalação & Uso

1. **Clonar o Repositório:**
   ```bash
   git clone https://github.com/vitoriasmiranda/Rockit_Vision.git
   cd Rockit_Vision/computer_vision_app
   ```

2. **Criar um Ambiente Virtual e Ativá-lo:**
   Recomendamos utilizar o `uv`, que é incrivelmente mais rápido que o `pip` nativo.
   ```bash
   uv venv
   # No Windows (PowerShell):
   .\.venv\Scripts\Activate.ps1
   # No Linux/Mac:
   source .venv/bin/activate
   ```

3. **Instalar Dependências:**
   ```bash
   pip install -e .
   # Ou caso haja problemas de dependência:
   pip install python-fasthtml mediapipe opencv-python scikit-learn joblib uvicorn
   ```

4. **Executar a Aplicação:**
   ```bash
   python app.py
   ```
   *O terminal mostrará que o servidor "Uvicorn" foi iniciado. Vá no seu navegador e acesse a porta indicada.*

5. **Interface de Usuário:**
   - Abra o `http://localhost:5001`.
   - Clique em **"📷 Ligar Câmera"**.
   - Aceite as permissões e veja os resultados do painel lateral (`Live Feed Data` e `Detected Gesture`) mudarem conectando as métricas aos seus gestos gravados em tempo real!

---

## 🎨 UI & UX

O front-end utiliza uma forte inspiração em Glassmorphism, mantendo esquemas de cores vivas e com suporte a *Dark Mode*. A renderização do layout na tela dispensa frameworks puramente baseados em JS como React, pois todos os pacotes das dependências de tela são resolvidos e roteados através da própria API da FastHTML com `Link()` e `Script()` na renderização modular de Python.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE) para mais detalhes. Feito com 💜 para estudos.
=======

>>>>>>> 82c14ae2b26591163c6983ebfd4f6b7de608c287
