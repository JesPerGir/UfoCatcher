import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader'); // El ID de esta escena
    }

    preload() {
        // Carga el OVNI original (de momento un placeholder)
        this.load.image('ovni', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        
        // Carga los recursos con las MISMAS keys que usas en PlayScene
        this.load.image('asteroide1', '/sprites/Asteroide1.png'); // Grande
        this.load.image('asteroide2', '/sprites/Asteroide2.png'); // Mediano
        this.load.image('asteroide3', '/sprites/Asteroide3.png'); // Pequeño
        this.load.image('orbe1', '/sprites/Orbe1.png');
        this.load.image('orbe2', '/sprites/Orbe2.png');
        this.load.image('orbe3', '/sprites/Orbe3.png');
        this.load.image('fondo', '/sprites/fondo.png');
    }

    create() {
        // Cuando termina de cargar, pasa automáticamente a la escena del juego
        this.scene.start('PlayScene');
    }
}