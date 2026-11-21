
let pokemon1;
let pokemon2;
let currentStat = "";
let previousStat = "";
let score = 0;
let gameOver = false;

const stats = [
    "hp",
    "attack",
    "defense",
    "special-attack",
    "special-defense",
    "speed"
];
const higherButton = document.getElementById("higher");
const lowerButton = document.getElementById("lower");
const nextButton = document.getElementById("next");

function randomPokemon() {
    return Math.floor(Math.random() * 649) + 1;
}

async function getPokemon(id) {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon/" + id
    );

    if (!response.ok) {
        throw new Error("Could not load Pokémon");
    }

    return await response.json();
}

function getStat(pokemon) {
    for (let i = 0; i < pokemon.stats.length; i++) {
        if (pokemon.stats[i].stat.name === currentStat) {
            return pokemon.stats[i].base_stat;
        }
    }
}

async function newRound() {
    higherButton.disabled = true;
    lowerButton.disabled = true;
    nextButton.hidden = true;

    document.getElementById("result").textContent = "Loading...";

    let statIndex = Math.floor(Math.random() * stats.length);

    while (stats[statIndex] === previousStat) {
        statIndex = Math.floor(Math.random() * stats.length);
    }

    currentStat = stats[statIndex];
    previousStat = currentStat;

    document.getElementById("stat-name").textContent =
        currentStat.toUpperCase().replace("-", " ");

    let id1 = randomPokemon();
    let id2 = randomPokemon();

    while (id1 === id2) {
        id2 = randomPokemon();
    }

    try {
        pokemon1 = await getPokemon(id1);
        pokemon2 = await getPokemon(id2);

 
        document.getElementById("name1").textContent = pokemon1.name;
        document.getElementById("name2").textContent = pokemon2.name;


        document.getElementById("image1").src =
            pokemon1.sprites.front_default;

        document.getElementById("image2").src =
            pokemon2.sprites.front_default;

        document.getElementById("stat1").textContent =
            getStat(pokemon1);

        document.getElementById("stat2").textContent = "???";

        document.getElementById("result").textContent = "";

        higherButton.disabled = false;
        lowerButton.disabled = false;

    } catch (error) {
        document.getElementById("result").textContent =
            "Something went wrong. Try again.";

        nextButton.textContent = "Try Again";
        nextButton.hidden = false;
    }
}

function checkGuess(guess) {
    let firstStat = getStat(pokemon1);
    let secondStat = getStat(pokemon2);

    let correct = false;

    if (firstStat === secondStat) {
        correct = true;
    } else if (guess === "higher" && secondStat > firstStat) {
        correct = true;
    } else if (guess === "lower" && secondStat < firstStat) {
        correct = true;
    }

    document.getElementById("stat2").textContent = secondStat;

    if (correct) {
        score++;
        document.getElementById("result").textContent =
            "Correct!";
        nextButton.textContent = "Next Round";
    } else {
        gameOver = true;
        document.getElementById("result").textContent =
            "Wrong! Game Over!";
        nextButton.textContent = "Play Again";
    }

    document.getElementById("score").textContent = score;

    higherButton.disabled = true;
    lowerButton.disabled = true;
    nextButton.hidden = false;
}


higherButton.addEventListener("click", function() {
    checkGuess("higher");
});

lowerButton.addEventListener("click", function() {
    checkGuess("lower");
});

nextButton.addEventListener("click", function() {
    if (gameOver) {
        score = 0;
        gameOver = false;
        document.getElementById("score").textContent = score;
    }

    newRound();
});


newRound();
