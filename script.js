$(document).ready(function(){
  $("#xkcd").click(function() {
    var num = Math.floor(Math.random() * 1000);
    var myUrl = "http://dynamic.xkcd.com/api-0/jsonp/comic/" + num +"?callback=?";
    console.log(myUrl);
    $.ajax({
      url: myUrl,
      dataType: "json",
      jsonpCallback: "xkcddata",
      success: function(data) {
        console.log(data);
        var toDisplay = "";
        toDisplay += "<h1>" + data.title + "</h1>";
        toDisplay += "<img src=\""+ data.img + "\" title=\"" + data.alt + "\" alt= \"" + data.title + "\">" + "</img>";
        $("#display").html(toDisplay);
       }
    });
    return false;
  });

  $("#norris").click(function() {
    var myUrl = "https://api.chucknorris.io/jokes/random?category=science";
    console.log(myUrl);
    $.ajax({
      url: myUrl,
      dataType: "json",
      success: function(data) {
        console.log(data);
        var toDisplay = "";
        toDisplay += "<img src=\""+ data.icon_url + "\" alt=\"Chuch Norris\">" + "</img>";
        toDisplay += "<h1>" + data.value + "</h1>";
        $("#display").html(toDisplay);
       }
    });
    return false;
  });

  $("#clear").click(function() {
    $("#display").html("");
  });

});
