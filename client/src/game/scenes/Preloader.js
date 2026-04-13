import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader'); // El ID de esta escena
    }

preload() {
        // Carga el OVNI original (de momento un placeholder)
        this.load.image('ovni', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
        
        // Carga los recursos temporales para enemigos y recompensas
        this.load.image('asteroide', '/sprites/Asteroide1.png');
        this.load.image('estrella', '/sprites/Orbe.png');
        this.load.image('fondo', '/sprites/fondo.png');
    }

    create() {
        // Cuando termina de cargar, pasa automáticamente a la escena del juego
        this.scene.start('PlayScene');
    }
}