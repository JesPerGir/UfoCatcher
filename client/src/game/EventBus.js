import Phaser from 'phaser';

// Crea un emisor de eventos global que podremos importar en React y en Phaser
const EventBus = new Phaser.Events.EventEmitter();

export default EventBus;