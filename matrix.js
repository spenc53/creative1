$(document).ready(function(){
  var interval;

  var maxRed = 255;
  var maxGreen = 255;
  var maxBlue = 255;

  // function()
  //var c;
  //var ctx;
  //var font_size;
  //var columns;
  //var drops;
  var c = document.getElementById("matrix");
  var ctx = c.getContext("2d");

  //making the canvas full screen
  c.height = window.innerHeight;
  c.width = window.innerWidth;

  //chinese characters - taken from the unicode charset
  var chinese = "田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑";
  // var chinese = "10";
  //converting the string into an array of single characters
  chinese = chinese.split("");

  var font_size = 15;
  var columns = c.width/font_size; //number of columns for the rain
  //an array of drops - one per column
  var drops = [];
  //x below is the x coordinate
  //1 = y co-ordinate of the drop(same for every drop initially)
  for(var x = 0; x < columns; x++)
  drops[x] = 1 - Math.floor(Math.random()*150);

  //drawing the characters
  function draw()
  {
  //Black BG for the canvas
  //translucent BG to show trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, c.width, c.height);


    //looping over drops
    for(var i = 0; i < drops.length; i++)
    {
      var red = Math.floor(Math.random()*maxRed)
      var green = Math.floor(Math.random()*maxGreen);
      var blue = Math.floor(Math.random()*maxBlue)

      ctx.fillStyle = "rgb("+red+","+ green +","+ blue +")"; //green text
      ctx.font = font_size + "px Lucida Console";
      //a random chinese character to print
      var text = chinese[Math.floor(Math.random()*chinese.length)];
      //x = i*font_size, y = value of drops[i]*font_size
      ctx.fillText(text, i*font_size, drops[i]*font_size);

      //sending the drop back to the top randomly after it has crossed the screen
      //adding a randomness to the reset to make the drops scattered on the Y axis
      if(drops[i]*font_size > c.height && Math.random() > 0.975)
        drops[i] = 0;

      //incrementing Y coordinate
      drops[i]++;
    }
  }

  $("#startButton").click(function(){
    var element = document.getElementById("opening");
    $("#opening").fadeOut(1000);
    $("#matrix").fadeIn(1000);
    $("#matrix").css("position","fixed");
    $("#matrix").css("top","0");
    $("#matrix").css("left","0");

    //get new color values and set them
    var newRed = $("#red").val();
    var newGreen = $("#green").val();
    var newBlue = $("#blue").val();

    if(newRed > 255)
    {
      newRed = 255;
    }
    if(newGreen > 255)
    {
      newGreen = 255;
    }
    if(newBlue > 255)
    {
      newBlue = 255;
    }

    maxRed = newRed;
    maxGreen = newGreen;
    maxBlue = newBlue;

    console.log(maxRed);
    console.log(maxGreen);
    console.log(maxBlue);



    //element.parentNode.removeChild(element);
    setTimeout(1000);
    interval = setInterval(draw, 60);
  });

  $("#goBack").click(function() {
    window.location.href = "index.html";
  });

  $(document).keyup(function(e) {
     if (e.keyCode == 27) { // escape key maps to keycode `27`
       clearInterval(interval);
       $("#opening").fadeIn(1000);
       ctx.fillStyle = "rgba(0, 0, 0, 1)";
       $("#matrix").fadeOut(500);
    }
  });

});
