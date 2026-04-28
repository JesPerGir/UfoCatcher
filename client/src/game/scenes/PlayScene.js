import Phaser from 'phaser';
import EventBus from '../EventBus';

export default class PlayScene extends Phaser.Scene {
    constructor() {
        super('PlayScene');
    }

    create() {
        // Oculta el cursor del ratón dentro del canvas
        this.input.setDefaultCursor('none');

        const anchoPantalla = this.scale.width;
        const altoPantalla = this.scale.height;

        // Fondo infinito
        this.fondo = this.add.tileSprite(0, 0, anchoPantalla, altoPantalla, 'fondo').setOrigin(0, 0);

        // --- JUGADOR ---
        this.player = this.physics.add.sprite(anchoPantalla / 2, altoPantalla / 2, 'ovni');
        
        // Mantenemos tu escala 3
        this.player.setScale(3); 
        
        // AJUSTE HITBOX JUGADOR: 
        // Bajamos el radio al 35% (antes 40%) para que sea más justo 
        // al ser un sprite tan grande.
        const radioOvni = this.player.width * 0.35;
        this.player.setCircle(radioOvni, (this.player.width / 2) - radioOvni, (this.player.height / 2) - radioOvni);

        this.score = 0;

        // SISTEMA DE TIEMPO
        this.segundos = 0;
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: () => { this.segundos++; },
            callbackScope: this,
            loop: true
        });

        // Grupos
        this.enemigos = this.physics.add.group();
        this.recompensas = this.physics.add.group();

        // Dificultad
        this.dificultad = 1;
        this.maxDificultad = 3;
        this.ultimoEnemigo = 0;
        this.ultimaRecompensa = 0;

        // Colisiones
        this.physics.add.overlap(this.player, this.recompensas, this.recogerRecompensa, null, this);
        this.physics.add.collider(this.player, this.enemigos, this.chocarEnemigo, null, this);

        // HUD: BURBUJA DE INFORMACIÓN
        const posicionX = anchoPantalla - 240;
        const posicionY = 30;
        this.hudContainer = this.add.container(posicionX, posicionY).setDepth(100);
        const fondoHud = this.add.graphics();
        fondoHud.fillStyle(0x1D0C2E, 0.85);
        fondoHud.fillRoundedRect(0, 0, 210, 45, 22);
        fondoHud.lineStyle(2, 0x68299e, 1);
        fondoHud.strokeRoundedRect(0, 0, 210, 45, 22);
        this.textoHud = this.add.text(105, 22, '00:00 | 0 PTS', {
            fontSize: '18px',
            fill: '#F9A35A',
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.hudContainer.add([fondoHud, this.textoHud]);

        this.scale.on('resize', (gameSize) => {
            this.physics.world.setBounds(0, 0, gameSize.width, gameSize.height);
            this.fondo.setSize(gameSize.width, gameSize.height);
            this.hudContainer.setPosition(gameSize.width - 240, 30);
        });
    }

    update(time, delta) {
        if (this.physics.world.isPaused) return;

        const minutos = Math.floor(this.segundos / 60).toString().padStart(2, '0');
        const segundosRestantes = (this.segundos % 60).toString().padStart(2, '0');
        this.textoHud.setText(`${minutos}:${segundosRestantes} | ${this.score} PTS`);

        this.fondo.tilePositionY -= 0.11 * delta * this.dificultad;

        const pointer = this.input.activePointer;
        if (pointer.isDown || (pointer.x > 0 && pointer.y > 0)) {
            const distanciaX = pointer.x - this.player.x;
            const distanciaY = pointer.y - this.player.y;
            const distanciaTotal = Phaser.Math.Distance.Between(this.player.x, this.player.y, pointer.x, pointer.y);

            if (distanciaTotal < 5) {
                // Frena en seco sin romper la forma de la hitbox
                this.player.setVelocity(0, 0); 
            } else {
                this.player.setVelocity(distanciaX * 35, distanciaY * 35);
            }
        }

        if (this.dificultad < this.maxDificultad) {
            this.dificultad += delta * 0.00008;
        }

        const frecuenciaEnemigos = 1200 / this.dificultad;
        if (time > this.ultimoEnemigo + frecuenciaEnemigos) {
            this.generarEnemigo();
            this.ultimoEnemigo = time;
        }

        if (time > this.ultimaRecompensa + 1500) {
            this.generarRecompensa();
            this.ultimaRecompensa = time;
        }

        this.limpiarObjetos(this.enemigos);
        this.limpiarObjetos(this.recompensas);
    }

    generarEnemigo() {
        const tipo = Phaser.Math.Between(1, 100);
        let key, escala, velocidad, factorHitbox;

        if (tipo <= 50) {
            // Asteroide 2 (Mediano)
            key = 'asteroide2'; 
            escala = Phaser.Math.FloatBetween(2, 3); 
            velocidad = Phaser.Math.Between(120, 180);
            factorHitbox = 0.25;
        } else if (tipo <= 85) {
            // Asteroide 1 (Grande y lento)
            key = 'asteroide1'; 
            escala = Phaser.Math.FloatBetween(4, 5.5); 
            velocidad = Phaser.Math.Between(70, 100);
            factorHitbox = 0.35;
        } else {
            // Asteroide 3 (Rápido)
            key = 'asteroide3'; 
            escala = Phaser.Math.FloatBetween(4, 5); 
            velocidad = Phaser.Math.Between(200, 300);
            factorHitbox = 0.15; 
        }

        const asteroide = this.spawnAleatorio(this.enemigos, key, escala, velocidad);
        
        // Hitboxes
        const radio = asteroide.width * factorHitbox;
        asteroide.setCircle(radio, (asteroide.width / 2) - radio, (asteroide.height / 2) - radio);
        
        asteroide.setAngle(Phaser.Math.Between(0, 360));
        asteroide.setAngularVelocity(Phaser.Math.Between(-120, 120));

        if (tipo > 85) {
            asteroide.setAngularVelocity(Phaser.Math.Between(300, 500));
        }
    }

    generarRecompensa() {
        const tipo = Phaser.Math.Between(1, 100);
        let escala = 2, velocidad = 100, puntosBase = 100, key = 'orbe1';

        if (tipo <= 70) {
            puntosBase = 100;
            key = 'orbe1';
        } else if (tipo <= 90) {
            puntosBase = 300; 
            velocidad = 150; 
            escala = 1.5; 
            key = 'orbe2';
        } else {
            puntosBase = 500; 
            velocidad = 200; 
            escala = 1.5; 
            key = 'orbe3';
        }

        const orbe = this.spawnAleatorio(this.recompensas, key, escala, velocidad);
        
        // --- SOLUCIÓN RECOMPENSAS: HITBOX AJUSTADA ---
        // Al añadir setCircle(30%), obligamos a que el ovni toque el orbe
        // y no se recoja por el "cuadrado invisible" del sprite.
        const radioOrbe = orbe.width * 0.30;
        orbe.setCircle(radioOrbe, (orbe.width / 2) - radioOrbe, (orbe.height / 2) - radioOrbe);
        
        orbe.setData('puntosBase', puntosBase);
    }

    recogerRecompensa(player, recompensa) {
        const puntos = recompensa.getData('puntosBase');
        this.score += Math.floor(puntos * this.dificultad);
        recompensa.destroy();
    }

    chocarEnemigo(player, enemigo) {
        this.physics.pause();
        this.timerEvent.remove(); 
        player.setTint(0xff0000);
        this.input.setDefaultCursor('default');
        EventBus.emit('game-over', this.score);

        const ancho = this.scale.width;
        const alto = this.scale.height;
        const centroX = ancho / 2;
        const centroY = alto / 2;

        this.add.graphics().fillStyle(0x000000, 0.8).fillRect(0, 0, ancho, alto).setDepth(200);
        const panel = this.add.graphics();
        panel.fillStyle(0x1D0C2E, 1);
        panel.fillRoundedRect(centroX - 250, centroY - 150, 500, 300, 20);
        panel.lineStyle(4, 0x68299e, 1);
        panel.strokeRoundedRect(centroX - 250, centroY - 150, 500, 300, 20);
        panel.setDepth(201);

        this.add.text(centroX, centroY - 80, 'MISIÓN FALLIDA', { 
            fontSize: '40px', fill: '#ff5555', fontFamily: 'monospace', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(202);

        this.add.text(centroX, centroY - 20, `Hiciste ${this.score} Puntos`, { 
            fontSize: '28px', fill: '#F9A35A', fontFamily: 'monospace' 
        }).setOrigin(0.5).setDepth(202);

        const btnRestart = this.add.graphics().fillStyle(0x68299e, 1).fillRoundedRect(centroX - 200, centroY + 50, 180, 50, 10).setDepth(202);
        this.add.text(centroX - 110, centroY + 75, 'REINTENTAR', { 
            fontSize: '18px', fill: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(203);
        
        this.add.zone(centroX - 110, centroY + 75, 180, 50).setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => this.scene.restart());

        const btnRanking = this.add.graphics().lineStyle(2, 0x68299e, 1).strokeRoundedRect(centroX + 20, centroY + 50, 180, 50, 10).setDepth(202);
        this.add.text(centroX + 110, centroY + 75, 'VER RANKING', { 
            fontSize: '18px', fill: '#68299e', fontFamily: 'monospace', fontStyle: 'bold' 
        }).setOrigin(0.5).setDepth(203);

        this.add.zone(centroX + 110, centroY + 75, 180, 50).setInteractive({ cursor: 'pointer' })
            .on('pointerdown', () => EventBus.emit('go-to-ranking'));
    }

    spawnAleatorio(grupo, key, escala, velocidadBase) {
        const ancho = this.scale.width;
        const alto = this.scale.height;
        const borde = Phaser.Math.Between(0, 3);
        const margen = 100;
        let x, y, velX, velY;
        const vel = velocidadBase * this.dificultad;
        if (borde === 0) { x = Phaser.Math.Between(0, ancho); y = -margen; velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(vel * 0.5, vel); }
        else if (borde === 1) { x = Phaser.Math.Between(0, ancho); y = alto + margen; velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(-vel, -vel * 0.5); }
        else if (borde === 2) { x = -margen; y = Phaser.Math.Between(0, alto); velX = Phaser.Math.Between(vel * 0.5, vel); velY = Phaser.Math.Between(-vel, vel); }
        else { x = ancho + margen; y = Phaser.Math.Between(0, alto); velX = Phaser.Math.Between(-vel, -vel * 0.5); velY = Phaser.Math.Between(-vel, vel); }
        const objeto = grupo.create(x, y, key);
        objeto.setScale(escala);
        objeto.setVelocity(velX, velY);
        return objeto;
    }

    limpiarObjetos(grupo) {
        const ancho = this.scale.width, alto = this.scale.height, limite = 200;
        grupo.getChildren().forEach(objeto => {
            if (objeto.x < -limite || objeto.x > ancho + limite || objeto.y < -limite || objeto.y > alto + limite) {
                objeto.destroy();
            }
        });
    }
}