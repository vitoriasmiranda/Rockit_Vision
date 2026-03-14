import json
import time
from fasthtml.common import ( # type: ignore
    fast_app, serve, Title, Main, Header, H1, P, Div, Video, Canvas,
    Link, Script, Input, Span, Label, H3, Img, H2, Ul, Li, Strong, Section, Footer, Button, A
)
from core.processor import GestureProcessor # type: ignore
from core.utils import decode_image, encode_image # type: ignore

app, rt = fast_app(hdrs=(
    Link(rel='stylesheet', href='/assets/style.css'),
    Script(src='/assets/script.js'),
))
processor = GestureProcessor()

# To track FPS per connection, we'd normally use a session or context, 
# but for simplicity in this single-user-focused app, let's use a class to track it.
class FPSTracker:
    def __init__(self):
        self.prev_time = time.time()
    def update(self):
        curr = time.time()
        fps = 1 / (curr - self.prev_time) if curr > self.prev_time else 0
        self.prev_time = curr
        return int(fps)

fps_tracker = FPSTracker()

@rt("/")
def get():
    return Title("Rockit Vision — AI Hand Gesture Recognition"), Main(
        Header(
            H1("Rockit Vision"),
            P("Sistema Inteligente de Reconhecimento de Gestos", cls="subtitle"),
            Button("🌙", id="theme-toggle", cls="theme-toggle", title="Modo Noturno / Claro"),
            cls="app-header"
        ),
        Div(
            Div(
                Div(
                    Video(id="video", autoplay=True, playsinline=True, style="display:none"),
                    Canvas(id="canvas", style="display:none"),
                    Div("FPS: 0", id="fps-counter", cls="fps-badge", style="display:none"),
                    id="camera-container", cls="camera-container"
                ),
                Button("📷 Ligar Câmera", id="start-camera-btn", cls="camera-cta"),
                cls="vision-card"
            ),
            Div(
                Div(
                    H3("📸 Image Quality Control"),
                    Div(
                        Input(type="range", id="quality-slider", min="0.1", max="1.0", step="0.05", value="0.6"),
                        Span("60%", id="quality-value"),
                        cls="quality-control"
                    ),
                    cls="setting-section"
                ),
                Div(
                    H3("⚙️ Settings"),
                    Div(
                        Label(Input(type="checkbox", id="draw-landmarks-cb", checked=True), " Draw Hand Landmarks"),
                        cls="settings-control"
                    ),
                    cls="setting-section"
                ),
                Div(
                    H3("📊 Live Feed Data"),
                    Div(id="gesture-container"),
                    cls="setting-section"
                ),
                Div(
                    H3("🖐️ Detected Gesture"),
                    Div(Img(id="gesture-image"), cls="gesture-preview-box"),
                    cls="setting-section gesture-section"
                ),
                cls="sidebar-info"
            ),
            cls="main-content"
        ),
        Section(
            H2("Como funciona o Rockit Vision?"),
            P("Este app utiliza Inteligência Artificial para reconhecer os movimentos das suas mãos em tempo real. Veja o passo a passo:"),
            Ul(
                Li(Strong("1. Captura de Vídeo:"), " A sua webcam envia os frames do vídeo em tempo real para o nosso servidor web (via conexão WebSocket)."),
                Li(Strong("2. Mapeamento Articular (MediaPipe):"), " Uma primeira Inteligência Artificial da Google (MediaPipe) encontra as suas mãos e cria uma \"trilha\" com pontos nas suas articulações (landmarks)."),
                Li(Strong("3. Predição Inteligente:"), " Pegamos as coordenadas desses pontos e os jogamos no nosso Modelo Neural Customizado (scikit-learn). Esse modelo já estudou casos parecidos e adivinha qual gesto você está fazendo!"),
                Li(Strong("4. Feedback Automático:"), " Todos os dados, como probabilidade, FPS e labels de retorno voltam processados e desenhados para a sua tela no mesmo milissegundo.")
            ),
            cls="explanation-card"
        ),
        Footer(
            P("Desenvolvido por Vitória Miranda (NLW Operator) com Inteligência Artificial & FastHTML • 2026"),
            Div(
                A("LinkedIn", href="https://www.linkedin.com/in/vitoriasmiranda/", target="_blank", cls="social-link"),
                Span(" • "),
                A("GitHub", href="https://github.com/vitoriasmiranda", target="_blank", cls="social-link"),
                cls="footer-links"
            ),
            cls="app-footer"
        ),
        cls="app-container"
    )

@app.ws("/ws")
async def ws(image: str, draw_landmarks: bool, send):
    img = decode_image(image)
    if img is not None:
        processed_img, labels, gesture_image = processor.process_frame(img, draw_landmarks)
        fps = fps_tracker.update()
        await send(json.dumps({
            "image": encode_image(processed_img),
            "labels": labels,
            "gesture_image": gesture_image,
            "fps": fps
        }))

serve()