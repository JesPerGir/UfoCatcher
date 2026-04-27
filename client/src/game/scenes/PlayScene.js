import Phaser from 'phaser';
import EventBus from '../EventBus';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.input.setDefaultCursor('none');

        const anchoPantalla = this.scale.width;
        const altoPantalla = this.scale.height;

        // EL FONDO (Siempre primero para que quede debajo de todo)
        // tileSprite para poder animarlo luego. setOrigin(0,0) lo ancla a la esquina superior izquierda.
        this.fondo = this.add.tileSprite(0, 0, anchoPantalla, altoPantalla, 'fondo').setOrigin(0, 0);

        // EL JUGADOR
        this.player = this.physics.add.sprite(anchoPantalla / 2, altoPantalla / 2, 'ovni');


        this.score = 0;

        // Grupos Físicos
        this.enemigos = this.physics.add.group();
        this.recompensas = this.physics.add.group();

        // Variables de Control y Dificultad
        this.dificultad = 1;         // Multiplicador inicial
        this.maxDificultad = 3;      // Límite máximo de locura
        this.ultimoEnemigo = 0;      // Control de tiempo para enemigos
        this.ultimaRecompensa = 0;   // Control de tiempo para recompensas

        // Colisiones
        this.physics.add.overlap(this.player, this.recompensas, this.recogerRecompensa, null, this);
        this.physics.add.collider(this.player, this.enemigos, this.chocarEnemigo, null, this);

        EventBus.emit('game-started', { message: 'Puntuación: 0' });

        // ACTUALIZAR FONDO AL REDIMENSIONAR
        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
            this.fondo.setSize(gameSize.width, gameSize.height);
        });
    }

    update(time, delta) {
        if (this.physics.world.isPaused) return;

        // Para que el patrón de la imagen de fondo se desplace hacia abajo en el eje Y
        this.fondo.tilePositionY -= 2;
        // Si el juego está en Game Over (físicas pausadas), no hacemos nada más
        if (this.physics.world.isPaused) return;

        const pointer = this.input.activePointer;
        const ancho = this.scale.width;
        const alto = this.scale.height;

        // MOVIMIENTO DEL JUGADOR
        if (pointer.isDown || (pointer.x > 0 && pointer.x < ancho && pointer.y > 0 && pointer.y < alto)) {
            this.player.x = pointer.x;
            this.player.y = pointer.y;
        }

        // AUMENTO GRADUAL DE LA DIFICULTAD
        // Sube un poquito cada frame (aprox 0.05 por segundo)
        if (this.dificultad < this.maxDificultad) {
            this.dificultad += delta * 0.00005;
        }

        // CONTROL DE APARICIÓN (SPAWNERS)
        // A mayor dificultad, menor tiempo de espera entre enemigos
        const frecuenciaEnemigos = 1000 / this.dificultad;

        if (time > this.ultimoEnemigo + frecuenciaEnemigos) {
            this.generarEnemigo();
            this.ultimoEnemigo = time;
        }

        if (time > this.ultimaRecompensa + 1500) {
            this.generarRecompensa();
            this.ultimaRecompensa = time;
        }

        // LIMPIEZA DE MEMORIA
        this.limpiarObjetos(this.enemigos);
        this.limpiarObjetos(this.recompensas);
    }

    // LÓGICA DE SPAWN DESDE CUALQUIER DIRECCIÓN
    spawnAleatorio(grupo, key, escala, velocidadBase) {
        const ancho = this.scale.width;
        const alto = this.scale.height;
        const borde = Phaser.Math.Between(0, 3); // 0: Arriba, 1: Abajo, 2: Izq, 3: Der
        const margen = 100; // Distancia fuera de la pantalla donde nacen

        let x, y, velX, velY;

        // Multiplica la velocidad base por la dificultad actual
        const vel = velocidadBase * this.dificultad;

        // Calcula posiciones y velocidades para que crucen la pantalla
        if (borde === 0) { // Arriba
            x = Phaser.Math.Between(0, ancho); y = -margen;
            velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(vel * 0.5, vel);
        } else if (borde === 1) { // Abajo
            x = Phaser.Math.Between(0, ancho); y = alto + margen;
            velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(-vel, -vel * 0.5);
        } else if (borde === 2) { // Izquierda
            x = -margen; y = Phaser.Math.Between(0, alto);
            velX = Phaser.Math.Between(vel * 0.5, vel); velY = Phaser.Math.Between(-vel, vel);
        } else { // Derecha
            x = ancho + margen; y = Phaser.Math.Between(0, alto);
            velX = Phaser.Math.Between(-vel, -vel * 0.5); velY = Phaser.Math.Between(-vel, vel);
        }

        const obj = grupo.create(x, y, key);
        obj.setScale(escala); // Para aplicar los cambios de tamaño
        obj.setVelocity(velX, velY);
    }

    generarEnemigo() {
        // Asteroide, escala y velocidad base
        this.spawnAleatorio(this.enemigos, 'asteroide', 3, 150);
    }

    generarRecompensa() {
        // Recompensa, escala y velocidad base
        this.spawnAleatorio(this.recompensas, 'estrella', 2, 100);
    }

    // FUNCIONES DE CHOQUES Y LIMPIEZA
    recogerRecompensa(player, recompensa) {
        recompensa.destroy();
        // Más puntos si la dificultad es más alta!
        this.score += Math.floor(100 * this.dificultad);
        EventBus.emit('game-started', { message: `Puntuación: ${this.score}` });
    }

    chocarEnemigo(player, enemigo) {
        this.physics.pause();
        player.setTint(0xff0000);

        // Evento visual para el cartelito de React
        EventBus.emit('game-started', { message: `¡GAME OVER! Puntuación final: ${this.score}` });

        // Emite la puntuación
        EventBus.emit('game-over', this.score);
    }

    limpiarObjetos(grupo) {
        const ancho = this.scale.width;
        const alto = this.scale.height;
        const limite = 150; // Margen de seguridad para borrar

        grupo.getChildren().forEach(obj => {
            // Si el objeto se sale mucho de la pantalla, lo destruimos
            if (obj.x < -limite || obj.x > ancho + limite || obj.y < -limite || obj.y > alto + limite) {
                obj.destroy();
            }
        });
    }
}