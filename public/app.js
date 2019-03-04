function displayResults(articles) {
    $("tbody").empty();

    articles.forEach(function(article) {
        var tr = $("<tr>").append(
            $("<td>").text(article.link),
            $("<td>").text(article.name),
            $("<td>").text(article.summary)
        );

        $("tbody").append(tr);
    })
}
// button on click with ajax function to load the table inside index.html 
$("#scrape").on("click", function() {
    $.getJSON("/scrape", function (data) {
        displayResults(data);
    });
});


// button to clear articles
$("#clear").on("click", function() {

})




