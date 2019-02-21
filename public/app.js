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
// ajax function to load the table inside index.html 
$.getJSON("/scrape", function (data) {
    displayResults(data);
    // console.log(data);
    // for (var i = 0; i < data.length; i++) {
    //     $("#results").append("<tr><td>" + data[i].link + "</td>" +
    //         "<td>" + data[i].title + "</td>" +
    //         "<td>" + data[i].summary + "</td></tr>");
    // }
});

