
const Canvas = require('canvas');

class Snowman {
  constructor(name, attack, defense, bodyParts, attackItem) {
    this.name = name;
    this.attackRate = attack;
    this.defense = defense;
    this.health = 100;
    this.bodyParts = bodyParts;
    this.attackItem = attackItem;
  }

  draw() {

    // Create a canvas element
    const canvas = Canvas.createCanvas(200, 200);

    // Get the context of the canvas element
    const context = canvas.getContext('2d');

    // Set the fill style to white
    context.fillStyle = 'white';

    // Draw the two circles that make up the body of the snowman
    context.beginPath();
    context.arc(100, 125, 50, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    context.beginPath();
    context.arc(100, 75, 40, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();

    // Add the details to the snowman's face
    context.fillStyle = 'orange'; // Set the fill style to orange for the nose
    context.beginPath();
    context.arc(100, 85, 5, 0, Math.PI * 2, true); // Draw the nose
    context.closePath();
    context.fill();

    context.fillStyle = 'black'; // Set the fill style to black for the eyes
    context.fillRect(95, 70, 5, 5); // Draw the left eye
    context.fillRect(105, 70, 5, 5); // Draw the right eye

    context.fillStyle = 'black'; // Set the fill style to black for the mouth
    context.beginPath();
    context.arc(100, 90, 5, 0, Math.PI, false); // Draw the mouth
    context.closePath();
    context.fill();

    return canvas;

  }

  attack(opponent) {
    // Generate a random number between 1 and 20
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    let damage = (this.attackRate - opponent.defense) + randomNumber;


    // If the snowman has an attack item, apply its bonus damage
    if (this.attackItem === 'ice sword') {
      damage += 5;
    } else if (this.attackItem === 'freeze spell') {
      damage += 10;
    } else if (this.attackItem === 'fire spell') {
      damage += 15;
    }
    opponent.health -= damage;

    // Choose a random body part to attack
    const attackPart = this.bodyParts[Math.floor(Math.random() * this.bodyParts.length)];

    // If the opponent's health drops to zero or below, the fight is over
    /*if (opponent.health <= 0) {
      return `${opponent.name} has been defeated!`;
    } else return*/
    console.log(`${this.name} attacks ${opponent.name}'s ${attackPart} for ${damage} damage!`);
  }

  defend() {
    // Generate a random number between 5 and 34
    const randomNumber = Math.floor(Math.random() * (15 - 5 + 1) + 5);

    // Increase the snowman's defense by the random number
    this.defense += randomNumber;
    console.log(`${this.name} raises their shield and defends against the attack with a defense of ${this.defense}!`);
  }

}

module.exports = Snowman;
