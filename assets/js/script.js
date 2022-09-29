function getNews (query, date) {

    $.ajax({
        url: "https://newsapi.org/v2/everything?q=" + query + 
        "&from=" + date + 
        // "&domains=" + domains + 
        "&sortBy=popularity&apiKey=" + apiKey, // Can add option for sorting
        method: 'GET',
        error: function(request, status, error) {
            alert("error"); // Make this a modal
        }
        }).then(function (response) {

        console.log(response.articles[0].title) // May want to truncate this
        console.log(response.articles[0].description)
        console.log(response.articles[0].source.name)

    })

}

getNews("Financial Market","2022-09-28")