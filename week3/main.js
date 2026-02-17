// shorthand for the 
// document.addEventListener('load', () => {})
// i do not use DOMEeventLoaded
window.onload = () => {
    console.log("script is connected");

    let button = document.getElementById("send");
    button.addEventListener("click", () => {
        let text = document.getElementById("search");
        console.log(text.value);
        //call my function when the button has been pressed
        request(text.value);

        //resetting my text value to be empty
        text.value = "";
    });

    //call my function to make the request to the API
    //request(); i only want to call my fetch request when my button has been clicked
};

//added async inside function header so that we can use await 
async function request(inputText) {
    //this is the base url, retrieved from the OMDB API docs
    let baseURL = "https://www.omdbapi.com/?";

    //apikey=9aa9e798
    //s="one battle after another"
    let params = new URLSearchParams({
        apikey: "9aa9e798",
        s: inputText,
        type: "movie",
    });

    console.log(baseURL + params);

    let url = baseURL + params;

    let response = await fetch(url);
    console.log(response);

    // i just want to see the data, not everything about the request

    let json = await response.json();
    console.log(json);

    ///json.Search comes from the OMDB API, the Search field is determined by the external service (OMDB)
    let movies = json.Search;
    console.log(movies);

    for (let movie of movies) {
        // 1. retrieve where on the webpage my movie data should be added
        let container = document.getElementById("container");
        // 2. create the item to be added 
        let m = document.createElement("div");
        m.textContent = movie.Title + " " + movie.Year;
        // 2.5 adding the poster element
        let img = document.createElement("img");
        img.src = movie.Poster;
        //3. add the image to the div
        m.appendChild(img);
        //4. add the div to the container
        container.appendChild(m);

    }
}



