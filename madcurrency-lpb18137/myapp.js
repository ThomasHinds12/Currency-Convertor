'use strict';

let exchangeRates;
let textBox;
let inputState; //stores whether the app is in input state (true) or output state (false) to help with dealing with actions differently

//initialises variables and calls setup methods
const init = () => {
    exchangeRates = {"eur" : 1};
    textBox = document.getElementById("text");
    inputState = true;

    getExchangeRates();

    for (let id = 0; id < 10; id++) {
        numberClickListener(id);
    }

    clearClickListener();
    equalsClickListener();
    inputCurrencyChangedListener();
};


window.addEventListener("load", init);


//gets exchange rates from the server but will also get from localstorage if the server rates were pulled less than 24hrs ago
function getExchangeRates () {
    let lastUpdated = Date.parse(localStorage.getItem("dateTime"));
    if ((new Date() - lastUpdated) >= 24 * 60 * 60 * 1000 || localStorage.getItem("dateTime") === null) {
        console.log("updating");
        loadRatesFromServer();
        localStorage.setItem("dateTime",  (new Date()).toString());
        setTimeout ( () => {
            if (Object.keys(exchangeRates).length === 1){
                console.log("not loaded");
                getExchangeRatesLocalStorage();
            }
        },100);
    }else{
        console.log("not updating - last updated : " + localStorage.getItem("dateTime"));
        getExchangeRatesLocalStorage();
    }
}


// loads conversion rates from the server and adds them to the dictionary and calls for the options to be added to the html
function loadRatesFromServer () {
    let req = new XMLHttpRequest();

    req.addEventListener("load", () => {
        let cubeArray = ((req.responseXML).getElementsByTagName("Cube"));
        for (let i = 2; i < cubeArray.length; i++) {     //i starts at 2 because first two elements are overarching cube tags
            let currency = cubeArray[i].getAttribute("currency");
            exchangeRates[currency.toLocaleLowerCase()] = parseFloat(cubeArray[i].getAttribute("rate"));
        }
        addCurrencyOptions();
        localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
    });

    req.open("GET", "https://devweb2020.cis.strath.ac.uk/~aes02112/ecbxml.php");
    req.send();
}


//gets the exchange rates from the local storage or uses hard coded data if that soe not work then populates the options in the html
function getExchangeRatesLocalStorage () {
    exchangeRates =  JSON.parse(localStorage.getItem("exchangeRates"));

    if (exchangeRates === null) {
        exchangeRates = {"eur" : 1, "gbp" :  0.88145, "pln" : 4.4917, "usd" : 1.1996, "jpy" : 126.24, "bgn" : 1.9558, "czk" : 25.896, "dkk" : 7.4367, "huf" : 355.58, "ron" : 4.8755,
            "sek" : 10.1358, "chf" : 1.0818, "isk" : 156.10, "nok" : 10.3380, "hrk" : 7.5715, "rub" : 90.6192, "try" : 8.5490, "aud" : 1.5727, "brl" : 6.4285, "cad" : 1.5358, "cny" : 7.7542,
            "hkd" : 9.3003, "idr" : 16838.85, "ils" : 3.9549, "inr" : 87.4345, "krw" : 1341.26, "mxn" : 24.2904, "myr" : 4.8686, "nzd" : 1.6666, "php" : 57.668, "sgd" : 1.6025, "thb" : 36.060,
            "zar" : 18.0297};
        localStorage.setItem("exchangeRates", JSON.stringify(exchangeRates));
    }
    addCurrencyOptions();
}


//adds the options for currencies to the drop downs in the html and loads the previous state of them from local storage
function addCurrencyOptions () {
    for (let key in exchangeRates) {
        if (key !== "eur" && key !== "gbp") {
            let option1 = createCurrencyOption(key);
            let option2 = createCurrencyOption(key);
            document.getElementById("inCurrency").add(option1);
            document.getElementById("outCurrency").add(option2);
        }
    }
    getSelectFromStorage("inCurrency");
    document.getElementById("textCurrency").innerHTML =  document.getElementById("inCurrency").value.toUpperCase();
    getSelectFromStorage("outCurrency");
    getSelectFromStorage("fee");
}


// gets the previously selected option for the specified select from local storage
function getSelectFromStorage (id) {
    let value = localStorage.getItem(id);
    if (value !== null){
        document.getElementById(id).value = value;
    }
}


//creates an option to be added to either currency select in html
function createCurrencyOption(key) {
    let option = document.createElement("option");
    option.value = key;
    option.text = key.toUpperCase();
    return option;
}


// the function to convert the amount and output it
function convert() {
    if (inputState) {
        let inCurrency = document.getElementById("inCurrency").value;
        localStorage.setItem("inCurrency", inCurrency);
        let outCurrency = document.getElementById("outCurrency").value;
        localStorage.setItem("outCurrency", outCurrency);
        let visitingValue = textBox.value;
        let fee = document.getElementById("fee").value;
        localStorage.setItem("fee", fee);

        document.getElementById("textCurrency").innerHTML = outCurrency.toUpperCase();
        textBox.value = (((visitingValue/exchangeRates[inCurrency]) * exchangeRates[outCurrency]) + (visitingValue * Number(fee))).toFixed(2);

        inputState = false;
    }

}


//handles what happens when the equals button on the pad is clicked
function equalsClickListener() {
    document.getElementById("=").addEventListener("click", convert);
}


//handles what happens when a number on the pad is clicked
function numberClickListener (buttonId) {
    document.getElementById(buttonId).addEventListener("click", () => {
        if (!inputState){
            resetIO();
        }
        textBox.value += buttonId;
    });
}


//handles what happens when the clear button on the pad is clicked
function clearClickListener() {
    document.getElementById("clear").addEventListener("click", resetIO);
}

//handles what happens when input currency is changed
function inputCurrencyChangedListener() {
    document.getElementById("inCurrency").addEventListener("change", () => {
        document.getElementById("textCurrency").innerHTML = document.getElementById("inCurrency").value.toUpperCase();
        if (!inputState){
            textBox.value = "";
        }
    });
}

function resetIO () {
    textBox.value = "";
    inputState = true;
    document.getElementById("textCurrency").innerHTML = document.getElementById("inCurrency").value.toUpperCase();
}