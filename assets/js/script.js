let searchquery;
document.querySelector("#search").addEventListener("submit", (e) => {
    searchquery = e.target.textContent;
})

let regionsStatsCan_En = []; // English regions array
let themesStatsCan_En = []; // English themes array

let theme = {
        theme_id: 0,
        label: ""
};

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

                displayStatsCanHeadlines('','',data);

              })
              .catch(console.error)
}

// displays the StatsCan information based on input region/theme criteria to be obtained form user search UI at top of page
function displayStatsCanHeadlines(geo,theme,data) {

    let thisTitle="";
    let prevTitle="";
    var divEl = $('<div>');

    for (let i=0;i<data.results.indicators.length;i++) {

        // // for each new object I want to check whether we are at the start of a new rubric.  If we are at start of new rubric THEN terminate the previous item list (if any), THEN display the rubric name AND display the first report title in the rubric as a first list item. If it's a subsequent rubric name appearance then ONLY append the new report title to the previous item list.
        console.log(i);

        if (i==0) {
            prevTitle="";
        } else {
            prevTitle = data.results.indicators[i-1].daily_title.en;
        }

        thisTitle = data.results.indicators[i].daily_title.en;

        let sameRubric=false;

        if (thisTitle===prevTitle) {
            sameRubric=true;
        }

        console.log(sameRubric);

        if (sameRubric) {
            var linkEl = $('<a>');
            let title = data.results.indicators[i].title.en + '::' + regionsStatsCan_En[data.results.indicators[i].geo_code]; 
            title = title + ', ' + data.results.indicators[i].refper.en;
            title = title + ', ' + data.results.indicators[i].value.en;
            if (data.results.indicators[i].growth_rate!=null) {
                title = title + ', ' + data.results.indicators[i].growth_rate.growth.en;
                if (data.results.indicators[i].growth_rate.arrow_direction==1) {
                    title = title + ' ⬆ ';
                } else {
                    title = title + ' ⬇ ';
                }
                title = title + ', ' + data.results.indicators[i].growth_rate.details.en;
            }
            title = title + ' ['+extractStatsCanThemes(data.results.indicators[i].themes)+']';
            linkEl.text(title);
            linkEl.attr('href','https://www.statcan.gc.ca/'+data.results.indicators[i].daily_url.en);
            linkEl.attr('style','font-size: 1rem;');
            listEl.append(linkEl);
            listEl.append('<br/>');
        } else {

            if (i===0) {
                var headingEl = $('<h1>');
                headingEl.text(thisTitle);
                divEl.append(headingEl);
                divEl.append('<br/>');
                var listEl = $('<ul>');
                divEl.append(listEl);
            } else {
                divEl.append(listEl);
                var divEl = $('<div>');
                var headingEl = $('<h1>');
                headingEl.text(thisTitle);
                divEl.append(headingEl);
                divEl.append('<br/>');
                var listEl = $('<ul>');
                divEl.append(listEl);
            }

            var linkEl = $('<a>');
            let title = data.results.indicators[i].title.en + '::' + regionsStatsCan_En[data.results.indicators[i].geo_code]; 
            title = title + ', ' + data.results.indicators[i].refper.en;
            title = title + ', ' + data.results.indicators[i].value.en;
            if (data.results.indicators[i].growth_rate!=null) {
                title = title + ', ' + data.results.indicators[i].growth_rate.growth.en;
                console.log('arrow direction: ',data.results.indicators[i].growth_rate.arrow_direction);
                if (data.results.indicators[i].growth_rate.arrow_direction==1) {
                    title = title + ' ⬆ ';
                } else {
                    title = title + ' ⬇ ';
                }
                title = title + ', ' + data.results.indicators[i].growth_rate.details.en;
            }
            title = title + ' ['+extractStatsCanThemes(data.results.indicators[i].themes)+']';
            linkEl.text(title);
            linkEl.attr('href','https://www.statcan.gc.ca/'+data.results.indicators[i].daily_url.en);
            linkEl.attr('style','font-size: 1rem;');
            listEl.append(linkEl);
            listEl.append('<br/>');
        }
        $('#articles-list').append(divEl);
        }
    
    // for (let i=0;i<10;i++) {
    //     let divEl = $('<div>');
    //     let headerEl = $('<h1>');

    //     divEl.append(headerEl);
    //     headerEl.text("Div "+i);
    //     divEl.append('<br/>');
    //     $('#articles-list').append(divEl);
    // }

    
}

fetchStatsCanHeadlines();

// function getNews (query, date) {

//     $.ajax({
//         url: "https://newsapi.org/v2/everything?q=" + query + 
//         "&from=" + date + 
//         // "&domains=" + domains + 
//         "&sortBy=popularity&apiKey=" + apiKey, // Can add option for sorting
//         method: 'GET',
//         error: function(request, status, error) {
//             alert("error"); // Make this a modal
//         }
//         }).then(function (response) {

//         console.log(response.articles[0].title) // May want to truncate this
//         console.log(response.articles[0].description)
//         console.log(response.articles[0].source.name)

//     })

// }

// getNews("Financial Market","2022-09-28")

