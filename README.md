# Currency-Convertor
A website designed to be a mobile app, using HTML, CSS and JavaScript which I developed during Semester 2 of my Third Year at Strathclyde.
The app is relatively simple but it uses a lot of JavaScript to handle events such as buttons being clicked.
It allows the user to select two currencies and convert a certain amount from one to the other.
The currency exchange rates are updated dynamically once every 24 hrs from an xml file that caches the official ECB rates.
When updated, the exchange rates are stored in local storage to be used if the app is offline or if the app is used again before the rates are updated 24 hrs later.
