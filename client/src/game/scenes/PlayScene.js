import Phaser from 'phaser';
import Player from '../entities/Player';
import Spawner from '../entities/Spawner';
import UIManager from '../entities/UIManager';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        this.input.setDefaultCursor('none');
        const anchoPantalla = this.scale.width;
        const altoPantalla = this.scale.height;

        this.fondo = this.add.tileSprite(0, 0, anchoPantalla, altoPantalla, 'fondo').setOrigin(0, 0);

        this.bgm = this.sound.add('musicaFondo', { loop: true, volume: 0.4 });
        this.bgm.play();

        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particula', 8, 8);

        // INICIALIZA ENTIDADES
        this.player = new Player(this, anchoPantalla / 2, altoPantalla / 2);
        this.spawner = new Spawner(this);
        this.ui = new UIManager(this); // INICIALIZA LA UI

        this.explosionOrbes = this.add.particles(0, 0, 'particula', {
            speed: { min: 80, max: 200 },
            scale: { start: 1.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 400,
            blendMode: 'ADD',
            tint: 0xFFD700,
            emitting: false
        });

        this.score = 0;
        this.segundos = 0;
        this.dificultad = 1;
        this.maxDificultad = 8;

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => { if (!this.player.isDead) this.segundos++; },
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.player, this.spawner.recompensas, this.recogerRecompensa, null, this);
        this.colisionEnemigos = this.physics.add.collider(this.player, this.spawner.enemigos, this.chocarEnemigo, null, this);

        // Delega la creación visual del marcador
        this.ui.crearHUD();

        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
            this.fondo.setSize(gameSize.width, gameSize.height);
            this.ui.reposicionarHUD(gameSize.width); // Delega el reposicionamiento
        });
    }

    update(time, delta) {
        if (this.physics.world.isPaused) return;

        // CONTROL DE MUERTE CINEMÁTICA
        if (this.player.isDead) {
            const margen = 150;
            if (this.player.x < -margen || this.player.x > this.scale.width + margen ||
                this.player.y < -margen || this.player.y > this.scale.height + margen) {

                // Para la escena y el audio aquí
                this.physics.pause();
                this.timerEvent.remove();
                if (this.bgm) {
                    this.bgm.setDetune(-800);
                    this.bgm.setVolume(0.15);
                }

                // Llama a la UI para que pinte el menú final
                this.ui.mostrarMenuGameOver(this.score, this.bgm);
            }
            return;
        }

        // Delega la actualización visual de los textos
        this.ui.actualizarHUD(this.segundos, this.score);

        this.fondo.tilePositionY -= 0.22 * delta;

        if (this.dificultad < this.maxDificultad) this.dificultad += delta * 0.000033;

        this.player.actualizarMovimiento();
        this.spawner.update(time, this.dificultad);
    }

    recogerRecompensa(player, recompensa) {
        if (this.player.isDead) return;

        this.sound.play('sonidoOrbe', { volume: 0.5 });

        const puntosBase = recompensa.getData('puntosBase');
        const puntosGanados = Math.floor(puntosBase * this.dificultad);
        this.score += puntosGanados;

        // COLORES DINÁMICOS SEGÚN EL TIPO DE ORBE
        let colorTexto = '#FFFFFF'; // Blanco por si acaso
        if (recompensa.texture.key === 'orbe1') {
            colorTexto = '#FF4444'; // Rojo intenso
        } else if (recompensa.texture.key === 'orbe2') {
            colorTexto = '#00CCFF'; // Azul neón
        } else if (recompensa.texture.key === 'orbe3') {
            colorTexto = '#FFD700'; // Dorado
        }

        // --- EFECTO: TEXTO FLOTANTE DE PUNTOS ---
        const textoPuntos = this.add.text(recompensa.x, recompensa.y, `+${puntosGanados}`, {
            fontSize: '22px',
            fill: colorTexto, // Aplicamos el color que hemos calculado
            fontFamily: 'monospace',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(50);

        // Animamos el texto para que suba y se desvanezca
        this.tweens.add({
            targets: textoPuntos,
            y: textoPuntos.y - 60,
            alpha: 0,
            duration: 1600,
            ease: 'Cubic.easeOut',
            onComplete: () => {
                textoPuntos.destroy();
            }
        });

        // Emitimos las partículas y destruimos el orbe
        this.explosionOrbes.emitParticleAt(recompensa.x, recompensa.y, 30);
        recompensa.destroy();
    }

    chocarEnemigo(player, enemigo) {
        if (this.player.isDead) return;
        this.sound.play('sonidoChocar', { volume: 0.8 });
        this.input.setDefaultCursor('default');
        this.player.morir(enemigo);
        this.colisionEnemigos.active = false;
    }
}