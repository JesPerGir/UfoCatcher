import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader'); // El ID de esta escena
    }

    preload() {
        // Carga el OVNI original
        this.load.image('ovni', '/sprites/ufo.png');

        // Carga los recursos con las keys que se usan en PlayScene
        this.load.image('asteroide1', '/sprites/asteroide1.png'); // Grande
        this.load.image('asteroide2', '/sprites/asteroide2.png'); // Mediano
        this.load.image('asteroide3', '/sprites/asteroide3.png'); // Pequeño
        this.load.image('orbe1', '/sprites/orbe1.png');
        this.load.image('orbe2', '/sprites/orbe2.png');
        this.load.image('orbe3', '/sprites/orbe3.png');
        this.load.image('fondo', '/sprites/fondo.png');
        
        // Carga de audio
        this.load.audio('musicaFondo', '/audio/musica_juego.ogg');
        this.load.audio('sonidoOrbe', '/audio/sonido_orbe.wav');
        this.load.audio('sonidoChocar', '/audio/sonido_chocar.wav');
    }

    create() {
        // Cuando termina de cargar, pasa automáticamente a la escena del juego
        this.scene.start('PlayScene');
    }
}