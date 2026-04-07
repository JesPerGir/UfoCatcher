import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader'); // El ID de esta escena
    }

    preload() {
        // Aquí se puede incluir un texto de "Cargando..."
        // Carga el asset del OVNI (PlaceHolder)
        this.load.image('ovni', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    }

    create() {
        // Cuando termina de cargar, pasa automáticamente a la escena del juego
        this.scene.start('PlayScene');
    }
}