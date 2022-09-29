let apiKey = "c0727ad6f00544e28f79127521a31139"

let regionsStatsCan_En = []; // English regions array
let themesStatsCan_En = []; // English themes array
let searchquery;

let theme = {
        theme_id: 0,
        label: ""
};


extractStatsCanThemes("housing");
fetchStatsCanHeadlines("money");

let search = $("#searchForm");

function thingy(e) {
    e.preventDefault();
    searchquery = $("#search").val();
}

search.on("submit", thingy)



// function takes in the themes string from payload and extracts and returns comma delimitted  theme labels
function extractStatsCanThemes(str) {
    let themeStr = str;
    themeStr[0]=themeStr[0].replace('*','');
    themeStr[themeStr.length-1]=themeStr[themeStr.length-1].replace('*','');
    str="";
    for (let i=0;i<themeStr.length;i++) {
        for (let j=0;j<themesStatsCan_En.length;j++) {
            if (themeStr[i]===themesStatsCan_En[j].theme_id) {
                str=str+themesStatsCan_En[j].label + ', ';
            }
        }
    }
    console.log(str);
    return str;
}

// Fetches the Stats Canada - The Daily news feeds by economic indicator. this data can be passed to display function using original payload object or it can be saved locally for further processing
function fetchStatsCanHeadlines() {

        fetch('https://statcan-economic-indicators-statcan-apicast-production.api.canada.ca/v1/ind-econ.json',{
            headers: {
            'user-key': '93edde87b4ffe28899e335bf9e8336ab'
            }
        })
              .then((response) => response.json())
              .then((data) => {
                
                console.log(data); // log the payload object

                for (let i=0;i<data.results.geo.length;i++) {
                    regionsStatsCan_En.push(data.results.geo[i].label.en); // extract the geographic locations array
                }
                
                themesStatsCan_En=data.results.themes_en; // extract the themes array 

                // ** THIS IS JUST A SAMPLE AND CLEARLY NOT FORMATED -- WE'LL NEED A CONTAINER FOR THIS AND A SERACH STRATEGY *** 
                // currently display the indicators as concatinated links (that inlude report name, indicator title, and reported values/period) that lead to the economic indicator newspage
                // this can be removed from this fetch function and the data object can be passed on to a dedicated dipslay function
                $('#articles-list').children('h1').text("Indicators");
                $('#articles-list').children('h1').append($('<br/>'));
                for (let i=0;i<data.results.indicators.length;i++) {
                    var linkEl = $('<a>');
                    linkEl.attr("target","_blank") // Open link in new tab
                    let title = data.results.indicators[i].daily_title.en + '::'+data.results.indicators[i].title.en + '::' + regionsStatsCan_En[data.results.indicators[i].geo_code]; 
                    let themeTags = data.results.indicators[i].themes.split('**');
                    title = title + '---> THEMES: '+extractStatsCanThemes(themeTags);
                    linkEl.text(title);
                    linkEl.attr('href','https://www.statcan.gc.ca/'+data.results.indicators[i].daily_url.en);
                    $('#articles-list').children('h1').append(linkEl);
                    $('#articles-list').children('h1').append($('<br/>'));
                }
                
              })
              .catch(console.error)
}

// function getNews (query, date) {

//     let url = "https://newsapi.org/v2/everything?q=" + query + 
//        "&from=" + date + 
//        // "&domains=" + domains + 
//        "&sortBy=popularity&apiKey=" + apiKey // Can add option for sorting

//    fetch(new Request(url))
//        .then((response) => response.json())
//        .then(function (data) {

//            console.log(data)

//            console.log(data.articles[0].title) // May want to truncate this
//            console.log(data.articles[0].description)
//            console.log(data.articles[0].source.name)

//    })

// }

// getNews("Financial Market","2022-09-28")

function getNews(query) {

    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'b8835ac7f4msh09512c251bb8c50p1f9a63jsnfcf8c28c6887',
            'X-RapidAPI-Host': 'free-news.p.rapidapi.com'
        }
    };

    fetch('https://free-news.p.rapidapi.com/v1/search?q=' + query + '&lang=en', options)
        .then(response => response.json())
        .then(function(data){
            console.log(data)
            console.log(data.articles[0].title)
            console.log(data.articles[0].summary)
            console.log(data.articles[0].clean_url)
            console.log(data.articles[0].link)
        })
        .catch(err => console.error(err));
}

getNews('china economy')

