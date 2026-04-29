import Phaser from 'phaser';

export default class Spawner {
    constructor(scene) {
        this.scene = scene; // Guarda la referencia a la PlayScene

        // El Spawner es el dueño de estos grupos ahora
        this.enemigos = this.scene.physics.add.group();
        this.recompensas = this.scene.physics.add.group();

        this.ultimoEnemigo = 0;
        this.ultimaRecompensa = 0;
    }

    // El Spawner tiene su propio update que se llamará desde la escena principal
    update(time, dificultad) {
        const frecuenciaEnemigos = 1200 / dificultad;
        if (time > this.ultimoEnemigo + frecuenciaEnemigos) {
            this.generarEnemigo(dificultad);
            this.ultimoEnemigo = time;
        }

        if (time > this.ultimaRecompensa + 1500) {
            this.generarRecompensa(dificultad);
            this.ultimaRecompensa = time;
        }

        this.limpiarObjetos(this.enemigos);
        this.limpiarObjetos(this.recompensas);
    }

    generarEnemigo(dificultad) {
        const tipo = Phaser.Math.Between(1, 100);

        // Declara las variables al inicio para tenerlas controladas
        let key;
        let escala;
        let velocidad;
        let factorHitbox;

        // Configura los atributos según la probabilidad
        if (tipo <= 50) {
            key = 'asteroide2';
            escala = Phaser.Math.FloatBetween(2, 3);
            velocidad = Phaser.Math.Between(120, 180);
            factorHitbox = 0.25;
        } else if (tipo <= 85) {
            key = 'asteroide1';
            escala = Phaser.Math.FloatBetween(4, 5.5);
            velocidad = Phaser.Math.Between(70, 100);
            factorHitbox = 0.35;
        } else {
            key = 'asteroide3';
            escala = Phaser.Math.FloatBetween(4, 5);
            velocidad = Phaser.Math.Between(200, 300);
            factorHitbox = 0.15;
        }

        // Crea la entidad
        const asteroide = this.spawnAleatorio(this.enemigos, key, escala, velocidad, dificultad);

        // Ajusta la hitbox
        const radio = asteroide.width * factorHitbox;
        asteroide.setCircle(radio, (asteroide.width / 2) - radio, (asteroide.height / 2) - radio);

        // Aplica rotación inicial aleatoria
        asteroide.setAngle(Phaser.Math.Between(0, 360));

        // Controla la velocidad de rotación evitando sobrescribir variables
        if (tipo > 85) {
            asteroide.setAngularVelocity(Phaser.Math.Between(300, 500));
        } else {
            asteroide.setAngularVelocity(Phaser.Math.Between(-120, 120));
        }
    }

    generarRecompensa(dificultad) {
        const tipo = Phaser.Math.Between(1, 100);

        // Inicializa con los valores por defecto (Orbe común)
        let key = 'orbe1';
        let escala = 2;
        let velocidad = 100;
        let puntosBase = 100;

        // Sobrescribe solo si es necesario según la rareza

        if (tipo > 70 && tipo <= 90) { // Orbe raro
            key = 'orbe2';
            escala = 1.5;
            velocidad = 150;
            puntosBase = 300;
        } else if (tipo > 90) { // Orbe épico
            key = 'orbe3';
            escala = 1.5;
            velocidad = 200;
            puntosBase = 500;
        }

        // Crea la entidad
        const orbe = this.spawnAleatorio(this.recompensas, key, escala, velocidad, dificultad);

        // Ajusta la hitbox
        const radioOrbe = orbe.width * 0.30;
        orbe.setCircle(radioOrbe, (orbe.width / 2) - radioOrbe, (orbe.height / 2) - radioOrbe);

        // Guarda su valor en puntos
        orbe.setData('puntosBase', puntosBase);
    }

    spawnAleatorio(grupo, key, escala, velocidadBase, dificultad) {
        const ancho = this.scene.scale.width;
        const alto = this.scene.scale.height;
        const borde = Phaser.Math.Between(0, 3);
        const margen = 100;

        let x, y, velX, velY;
        const multiplicadorVelocidad = 1 + ((dificultad - 1) * (1.5 / 7));
        const vel = velocidadBase * multiplicadorVelocidad;

        switch (borde) {
            case 0: x = Phaser.Math.Between(0, ancho); y = -margen; velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(vel * 0.5, vel); break;
            case 1: x = Phaser.Math.Between(0, ancho); y = alto + margen; velX = Phaser.Math.Between(-vel, vel); velY = Phaser.Math.Between(-vel, -vel * 0.5); break;
            case 2: x = -margen; y = Phaser.Math.Between(0, alto); velX = Phaser.Math.Between(vel * 0.5, vel); velY = Phaser.Math.Between(-vel, vel); break;
            case 3:
            default: x = ancho + margen; y = Phaser.Math.Between(0, alto); velX = Phaser.Math.Between(-vel, -vel * 0.5); velY = Phaser.Math.Between(-vel, vel); break;
        }

        const objeto = grupo.create(x, y, key);
        objeto.setScale(escala);
        objeto.setVelocity(velX, velY);
        return objeto;
    }

    limpiarObjetos(grupo) {
        const ancho = this.scene.scale.width, alto = this.scene.scale.height, limite = 200;
        grupo.getChildren().forEach(objeto => {
            if (objeto.x < -limite || objeto.x > ancho + limite || objeto.y < -limite || objeto.y > alto + limite) {
                objeto.destroy();
            }
        });
    }
}