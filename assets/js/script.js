let regionsStatsCan_En = []; // English regions array
let themesStatsCan_En = []; // English themes array
let indicators_en = [];
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
    console.log(searchquery)
}

search.on("submit", thingy)


// function takes in the themes string from payload and extracts and returns comma delimitted  theme labels
function extractStatsCanThemes(str) {
    let themeStr = str;
    themeStr = themeStr.split('**');
    themeStr[0]=themeStr[0].replace('*','');
    themeStr[themeStr.length-1]=themeStr[themeStr.length-1].replace('*','');
    str="";
    for (let i=0;i<themeStr.length;i++) {
        for (let j=0;j<themesStatsCan_En.length;j++) {
            if (themeStr[i]===themesStatsCan_En[j].theme_id) {
                if (i===themeStr.length-2) {
                    str=str+themesStatsCan_En[j].label;
                } else {
                    str=str+themesStatsCan_En[j].label + ', ';
                }
            }
        }
    }
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
                

                for (let i=0;i<data.results.geo.length;i++) {
                    regionsStatsCan_En.push(data.results.geo[i].label.en); // extract the geographic locations array
                }
                themesStatsCan_En=data.results.themes_en; // extract the themes array 

                console.log(data);
                parseStatsCanIndicators(data);
                filterStatsCanIndicators(['Ontario','Canada'],['Earnings']);
                // displayStatsCanHeadlines();

              })
              .catch(console.error)
}

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
            displayNews(data);
        })
        
}

function displayNews(APInews) {
    let newsList = $("#articles-list");
    for (i=0;i<APInews.articles.length;i++) {
        // Outer shell
        let newsOuterContainer = document.createElement("div");
        newsOuterContainer.classList.add("card", "col", "s12");
        // Inner Shell
        let newsBody = document.createElement("div");
        newsBody.classList.add("card-content");
        //Headline
        let headline = document.createElement("a");
        headline.setAttribute("target","_blank");
        headline.classList.add("headline-link"); // Styling for headline links
        headline.setAttribute("href",APInews.articles[i].link);
        let headlineText = document.createElement("h1");
        headlineText.textContent=(APInews.articles[i].title);
        headline.append(headlineText);
        newsBody.append(headline);
        //Source
        let source = document.createElement("h4");
        source.classList.add("card-title");
        source.textContent = (APInews.articles[i].clean_url);
        newsBody.append(source);
        //Text
        let textPreview = document.createElement("p");
        textPreview.textContent = (APInews.articles[i].summary);
        newsBody.append(textPreview);
        //Readmore
        let readMore = document.createElement("a");
        readMore.setAttribute("target","_blank");
        readMore.textContent = ("Read more here!");
        readMore.setAttribute("href",APInews.articles[i].link);
        newsBody.append(readMore)
        // Add element to news headlines
        newsOuterContainer.append(newsBody);
        newsList.append(newsOuterContainer);
    }
}

$('#aSearchButton').on('click', function(event){
    event.preventDefault();

    let query = {
        query: $('#queryInput').val(),
        gArea: $('#gArea').val(),
        theme: $('#theme').val()
    };

function parseStatsCanIndicators(data) {
    let indicators = data.results.indicators;

    indicators.forEach(element => {

        let indicator = {
            category: "",
            title: "",
            region:"",
            date:"",
            period:"",
            amount:"",
            rate:"",
            arrow:"",
            dailyUrl:"",
            sourceID:"",
            themes: []
    }; 
    
        indicator.category=element.daily_title.en;
        indicator.title=element.title.en;
        indicator.region=regionsStatsCan_En[element.geo_code];
        indicator.date=element.refper.en;
        indicator.amount=element.value.en;
        indicator.dailyUrl='https://www.statcan.gc.ca/'+element.daily_url.en;
        indicator.sourceID=element.source;
        indicator.themes=extractStatsCanThemes(element.themes);
        if (element.growth_rate!=null) {
            indicator.period=element.growth_rate.details.en;
            indicator.rate=element.growth_rate.growth.en;
            if (element.growth_rate.arrow_direction==1) 
            {
                indicator.arrow='⬆';
            } else {
                indicator.arrow='⬇';
            }
            
        }
        indicators_en.push(indicator);
    });

    console.log(indicators_en);

}

function filterStatsCanIndicators(region,theme) {
    
    let filteredArr =[];

    console.log(filteredArr);
    
    indicators_en.forEach((element,index,arr) => {
        

        if (element.region===region && element.themes.includes(theme))
            {   
                filteredArr.push(element);
            }
       
            
    });
    
    console.log(filteredArr);
}

// displays the StatsCan information based on input region/theme criteria to be obtained form user search UI at top of page
function displayStatsCanHeadlines() {

    let thisTitle="";
    let prevTitle="";
    var divEl = $('<div>');
    let indicators = data.results.indicators;
    let includeGeo=[];
    let includeTheme=[];

    if (geo==='') {
        includeGeo = regionsStatsCan_En;
    } else {
        includeGeo = geo;
    }

    if (theme==='') {
        themesStatsCan_En.forEach(element => {
                includeTheme.push(element.label);
        });
    } else {
        includeTheme = theme;
    }

    indicators.forEach((element,index,arr) => {
        
        let themes = [];
        themes = extractStatsCanThemes(element.themes).split(', ');

        const filteredThemes = themes.filter(value => includeTheme.includes(value));
        const filteredGeo = includeGeo.filter(value => regionsStatsCan_En[element.geo_code].includes(value));

        console.log(themes);
        console.log(includeTheme);
        console.log(filteredThemes);

        console.log(regionsStatsCan_En[element.geo_code]);
        console.log(includeGeo);
        console.log(filteredGeo);
       
        // console.log('includes geo:',includeGeo.includes(regionsStatsCan_En[element.geo_code]));
        // console.log('includes geo:',regionsStatsCan_En[element.geo_code]);
        // console.log('includes theme:',themes.includes(includeTheme));
        // console.log('includes theme:',themes);
        // console.log('includes theme:',includeTheme);

        if (filteredThemes===null)
            {   
                console.log('Filter In: ',extractStatsCanThemes(element.themes));
            } else {
                console.log('Filter Out: ',extractStatsCanThemes(element.themes));
                arr.splice(index, 1);
            }

        if (includeGeo.includes(regionsStatsCan_En[element.geo_code]))
        {   
            console.log('Filter In: ',regionsStatsCan_En[element.geo_code]);
        } else {
            console.log('Filter Out: ',regionsStatsCan_En[element.geo_code]);
            arr.splice(index, 1);
        }

    });
    // console.log(indicators.length);
    // console.log(indicators);

//    {

    for (let i=0;i<indicators.length;i++) {

        // // for each new object I want to check whether we are at the start of a new rubric.  If we are at start of new rubric THEN terminate the previous item list (if any), THEN display the rubric name AND display the first report title in the rubric as a first list item. If it's a subsequent rubric name appearance then ONLY append the new report title to the previous item list.

        if (i===0) {
            prevTitle="";
        } else {
            prevTitle = indicators[i-1].daily_title.en;
        }

        thisTitle = indicators[i].daily_title.en;

        let sameRubric=false;

        if (thisTitle===prevTitle) {
            sameRubric=true;
        }

        if (sameRubric) {

            // var linkEl = $('<a>');
            // let title = indicators[i].title.en + '::' + regionsStatsCan_En[indicators[i].geo_code]; 
            // title = title + ', ' + indicators[i].refper.en;
            // title = title + ', ' + indicators[i].value.en;
            // if (indicators[i].growth_rate!=null) {
            //     title = title + ', ' + indicators[i].growth_rate.growth.en;
            //     if (indicators[i].growth_rate.arrow_direction==1) {
            //         title = title + ' ⬆ ';
            //     } else {
            //         title = title + ' ⬇ ';
            //     }
            //     title = title + ', ' + indicators[i].growth_rate.details.en;
            // }
            // title = title + ' ['+extractStatsCanThemes(indicators[i].themes)+']';
            // linkEl.text(title);
            // linkEl.attr('href','https://www.statcan.gc.ca/'+indicators[i].daily_url.en);
            // linkEl.attr('style','font-size: 1rem;');
            // listEl.append(linkEl);
            // listEl.append('<br/>');

            var $rowDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("row");   // add a class
            // .html("<div>stuff here</div>");

            divEl.append($rowDiv);  

            var $colDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("col s12 m6");  // add a class
            // .html("<div>stuff here</div>");

            $rowDiv.append($colDiv);

            var $cardDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card blue-grey darken-1");   // add a class
            // .html("<div>stuff here</div>");

            $colDiv.append($cardDiv);

             var $card_ContentdDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card-content white-text");   // add a class
            // .html("<div>stuff here</div>");

            $cardDiv.append($card_ContentdDiv);

            var $card_titleDiv = $("<span>/")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card-title");   // add a class
            // .html("<div>stuff here</div>");
            $card_ContentdDiv.append($card_titleDiv);
            $card_titleDiv.text(indicators[i].title.en);

            $card_ContentdDiv.html('<p>'+regionsStatsCan_En[indicators[i].geo_code]+'</p><br/><p>'+regionsStatsCan_En[indicators[i].geo_code]+'</p><br/><p>'+indicators[i].refper.en+'</p><br/>'

            );
            
            
            $card_ContentdDiv.append($rowDiv);


        } else {

            if (i===0) {
                var $rowDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("row");   // add a class
                // .html("<div>stuff here</div>");

                divEl.append($rowDiv);  

                var $colDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("col s12 m6");  // add a class
                // .html("<div>stuff here</div>");

                $rowDiv.append($colDiv);

                var $cardDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card blue-grey darken-1");   // add a class
                // .html("<div>stuff here</div>");

                $colDiv.append($cardDiv);

                 var $card_ContentdDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card-content white-text");   // add a class
                // .html("<div>stuff here</div>");

                $cardDiv.append($card_ContentdDiv);

                var $card_titleDiv = $("<span>/")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card-title");   // add a class
                // .html("<div>stuff here</div>");
                $card_ContentdDiv.append($card_titleDiv);
                $card_titleDiv.text(thisTitle);
                
                // listEl = $("<ul>");
                // $card_ContentdDiv.append(listEl);

            } else {
                
                divEl.append($rowDiv);

                var $rowDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("row");   // add a class
                // .html("<div>stuff here</div>");

                divEl.append($rowDiv);  

                var $colDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("col s12 m6");  // add a class
                // .html("<div>stuff here</div>");

                $rowDiv.append($colDiv);

                var $cardDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card blue-grey darken-1");   // add a class
                // .html("<div>stuff here</div>");

                $colDiv.append($cardDiv);

                 var $card_ContentdDiv = $("<div>")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card-content white-text");   // add a class
                // .html("<div>stuff here</div>");

                $cardDiv.append($card_ContentdDiv);

                var $card_titleDiv = $("<span>/")   // creates a div element
                // .attr("id", "someID")  // adds the id
                .addClass("card-title");   // add a class
                // .html("<div>stuff here</div>");
                $card_ContentdDiv.append($card_titleDiv);
                $card_titleDiv.text(thisTitle);
                
                // listEl = $("<ul>");
                // $card_ContentdDiv.append(listEl);
            }

            
            var $rowDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("row");   // add a class
            // .html("<div>stuff here</div>");

            divEl.append($rowDiv);  

            var $colDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("col s12 m6");  // add a class
            // .html("<div>stuff here</div>");

            $rowDiv.append($colDiv);

            var $cardDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card blue-grey darken-1");   // add a class
            // .html("<div>stuff here</div>");

            $colDiv.append($cardDiv);

             var $card_ContentdDiv = $("<div>")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card-content white-text");   // add a class
            // .html("<div>stuff here</div>");

            $cardDiv.append($card_ContentdDiv);

            var $card_titleDiv = $("<span>/")   // creates a div element
            // .attr("id", "someID")  // adds the id
            .addClass("card-title");   // add a class
            // .html("<div>stuff here</div>");
            $card_ContentdDiv.append($card_titleDiv);
            $card_titleDiv.text(indicators[i].title.en);

            $card_ContentdDiv.html('<p>'+regionsStatsCan_En[indicators[i].geo_code]+'</p><br/><p>'+regionsStatsCan_En[indicators[i].geo_code]+'</p><br/><p>'+indicators[i].refper.en+'</p><br/>'

            );
            
            $card_ContentdDiv.append($rowDiv);
        }
        

    
   }
   $('.container').find('p').append(divEl);
}

$(document).ready(function(){
    $('select').formSelect();
  });

$(document).ready(function() {
    $('input#input_text, textarea#textarea2').characterCounter();
});

$(document).ready(function(){
$('.modal').modal();
});