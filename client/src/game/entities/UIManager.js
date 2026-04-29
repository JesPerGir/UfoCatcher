import EventBus from '../EventBus';

export default class UIManager {
    constructor(scene) {
        this.scene = scene; // Guarda la referencia a la escena para poder dibujar en ella
        this.hudContainer = null;
        this.textoHud = null;
    }

    // Dibuja el marcador de puntos y tiempo
    crearHUD() {
        const anchoPantalla = this.scene.scale.width;
        
        this.hudContainer = this.scene.add.container(anchoPantalla - 310, 30).setDepth(100);

        const fondoHud = this.scene.add.graphics();
        fondoHud.fillStyle(0x1D0C2E, 0.85).fillRoundedRect(0, 0, 280, 60, 30);
        fondoHud.lineStyle(3, 0x68299e, 1).strokeRoundedRect(0, 0, 280, 60, 30);

        this.textoHud = this.scene.add.text(140, 30, '00:00 | 0 PTS', { // Centrado en la nueva caja
            fontSize: '26px',
            fill: '#F9A35A',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.hudContainer.add([fondoHud, this.textoHud]);
    }


    // Actualiza el texto en cada frame
    actualizarHUD(segundosTotales, score) {
        const minutos = Math.floor(segundosTotales / 60).toString().padStart(2, '0');
        const segundosRestantes = (segundosTotales % 60).toString().padStart(2, '0');
        this.textoHud.setText(`${minutos}:${segundosRestantes} | ${score} PTS`);
    }

    // Reajusta la posición si el usuario redimensiona la ventana
    reposicionarHUD(anchoPantalla) {
        if (this.hudContainer) {
            this.hudContainer.setPosition(anchoPantalla - 310, 30); // Mantener el mismo margen en resize
        }
    }


    // Dibuja el menú final y gestiona los clicks de los botones
    mostrarMenuGameOver(score, bgm) {
        // Avisa a React de que el juego ha terminado (y envia la puntuación)
        EventBus.emit('game-over', score);

        const ancho = this.scene.scale.width;
        const alto = this.scene.scale.height;
        const centroX = ancho / 2;
        const centroY = alto / 2;

        // Fondo oscuro semitransparente
        this.scene.add.graphics().fillStyle(0x000000, 0.8).fillRect(0, 0, ancho, alto).setDepth(200);

        // Panel principal
        const panel = this.scene.add.graphics().fillStyle(0x1D0C2E, 1).fillRoundedRect(centroX - 250, centroY - 150, 500, 300, 20);
        panel.lineStyle(4, 0x68299e, 1).strokeRoundedRect(centroX - 250, centroY - 150, 500, 300, 20).setDepth(201);

        // Textos
        this.scene.add.text(centroX, centroY - 80, 'MISIÓN FALLIDA', {
            fontSize: '40px', fill: '#ff5555', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(202);

        this.scene.add.text(centroX, centroY - 20, `Hiciste ${score} Puntos`, {
            fontSize: '28px', fill: '#F9A35A', fontFamily: 'monospace'
        }).setOrigin(0.5).setDepth(202);

        // BOTÓN REINTENTAR
        this.scene.add.graphics().fillStyle(0x68299e, 1).fillRoundedRect(centroX - 200, centroY + 50, 180, 50, 10).setDepth(202);
        this.scene.add.text(centroX - 110, centroY + 75, 'REINTENTAR', {
            fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(203);

        this.scene.add.zone(centroX - 110, centroY + 75, 180, 50).setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
                if (bgm) bgm.stop();
                this.scene.scene.restart();
            });

        // BOTÓN RANKING
        this.scene.add.graphics().lineStyle(2, 0x68299e, 1).strokeRoundedRect(centroX + 20, centroY + 50, 180, 50, 10).setDepth(202);
        this.scene.add.text(centroX + 110, centroY + 75, 'VER RANKING', {
            fontSize: '18px', fill: '#68299e', fontFamily: 'monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(203);

        this.scene.add.zone(centroX + 110, centroY + 75, 180, 50).setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => {
                if (bgm) bgm.stop();
                EventBus.emit('go-to-ranking');
            });
    }
}