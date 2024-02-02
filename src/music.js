import * as Tone from 'tone'
let allKeys = [
    {
        "character": "w",
        "keyCode": 87,
        "note": 61,
        "frequency": 277.1826309768721,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "e",
        "keyCode": 69,
        "note": 63,
        "frequency": 311.12698372208087,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "t",
        "keyCode": 84,
        "note": 66,
        "frequency": 369.99442271163446,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "y",
        "keyCode": 89,
        "note": 68,
        "frequency": 415.3046975799451,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "u",
        "keyCode": 85,
        "note": 70,
        "frequency": 466.1637615180899,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "o",
        "keyCode": 79,
        "note": 73,
        "frequency": 554.3652619537442,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "p",
        "keyCode": 80,
        "note": 75,
        "frequency": 622.2539674441618,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "a",
        "keyCode": 65,
        "note": 60,
        "frequency": 261.6255653005986,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "s",
        "keyCode": 83,
        "note": 62,
        "frequency": 293.6647679174076,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "d",
        "keyCode": 68,
        "note": 64,
        "frequency": 329.6275569128699,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "f",
        "keyCode": 70,
        "note": 65,
        "frequency": 349.2282314330039,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "g",
        "keyCode": 71,
        "note": 67,
        "frequency": 391.99543598174927,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "h",
        "keyCode": 72,
        "note": 69,
        "frequency": 440,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "j",
        "keyCode": 74,
        "note": 71,
        "frequency": 493.8833012561241,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "k",
        "keyCode": 75,
        "note": 72,
        "frequency": 523.2511306011972,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "l",
        "keyCode": 76,
        "note": 74,
        "frequency": 587.3295358348151,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": ";",
        "keyCode": 186,
        "note": 76,
        "frequency": 659.2551138257398,
        "velocity": 0,
        "isActive": true
    },
    {
        "character": "'",
        "keyCode": 222,
        "note": 77,
        "frequency": 698.4564628660078,
        "velocity": 0,
        "isActive": true
    }
]

const keyboard = new AudioKeys();
const sampler = new Tone.Sampler({
	urls: {
		A1: "A1.mp3",
		A2: "A2.mp3",
	},
	baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();

let jumbo = document.getElementsByClassName('keyboard-button');
for (const child of jumbo) {
    let key = child.id;
    child.addEventListener('click', (evt)=>{
        playNote(key);
        // const event = new KeyboardEvent('keydown', {key:key});
        // child.dispatchEvent(event);
    });
}

keyboard.down((key)=> {
    console.log("hey");
    if (Tone.context.state != "running") {
        Tone.start();
    }
    sampler.triggerAttack(key.frequency/4);

    let pressedKey = String.fromCharCode(key.keyCode).toLowerCase();
    let regex = /^[a-zA-Z]$/g;
    let found = pressedKey.match(regex);
    if (found || key.keyCode == 186 || key.keyCode == 222) {
        document.getElementById(pressedKey).classList.add("keyboard-button-focus");
    } else {
        return;
    }
})

keyboard.up((key)=> {
    sampler.triggerRelease();
    let pressedKey = String.fromCharCode(key.keyCode).toLowerCase();
    let regex = /^[a-zA-Z]$/g;
    let found = pressedKey.match(regex);
    if (found || key.keyCode == 186 || key.keyCode == 222) {
        document.getElementById(pressedKey).classList.remove("keyboard-button-focus");
    } else {
        return;
    }
})

function playNote(key) {
    key = allKeys.find((ky)=>ky.character==key)
    if (!key) key = { keyCode: 186, frequency: 659.2551138257398 }

    if (Tone.context.state != "running") {
        Tone.start();
    }
    sampler.triggerAttack(key.frequency/4);

    let pressedKey = String.fromCharCode(key.keyCode).toLowerCase();

    let regex = /^[a-zA-Z]$/g;
    let found = pressedKey.match(regex);
    if (found || key.keyCode == 186 || key.keyCode == 222) {
        document.getElementById(pressedKey).classList.add("keyboard-button-focus");
    } else {
        return;
    }
}
