import Phaser from 'phaser';
import EventBus from '../EventBus';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        // 1. Oculta el cursor del sistema dentro del recuadro del juego
        this.input.setDefaultCursor('none');

        // Extrae el ancho y alto ACTUAL de la pantalla
        const anchoPantalla = this.scale.width;
        const altoPantalla = this.scale.height;

        // 2. Añade el jugador justo en el centro exacto de cualquier monitor
        this.player = this.physics.add.sprite(anchoPantalla / 2, altoPantalla / 2, 'ovni');

        // 3. Inicializa las variables de puntuación
        this.score = 0;
        this.survivalTimer = 0;

        EventBus.emit('game-started', { message: '¡Sobrevive y recoge premios!' });

        // BONUS: Si el usuario redimensiona la ventana mientras juega, 
        // actualiza los límites del mundo físico para que coincidan.
        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
        });
    }

    update(time, delta) {
        const pointer = this.input.activePointer;

        // Lee el tamaño de la pantalla en este mismo frame
        const ancho = this.scale.width;
        const alto = this.scale.height;

        // 4. Hacer que el OVNI siga al ratón usando los límites DINÁMICOS
        if (pointer.isDown || (pointer.x > 0 && pointer.x < ancho && pointer.y > 0 && pointer.y < alto)) {
            // Asigna directamente las coordenadas X e Y del ratón al jugador
            this.player.x = pointer.x;
            this.player.y = pointer.y;
        }

        // --- Aquí irá la lógica de sumar puntos por segundo ---
        // this.survivalTimer += delta;
        // if (this.survivalTimer > 1000) { ... sumar puntos ... }
    }
}