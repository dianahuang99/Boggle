const correct_words = [];
let score = 0;
$("body").prepend($("#score"));
$("#score").after($("#not-a-word"));

// //Set countdown timer until endgame
let time = 20;
$("#timer").html(time);

$("form").on("submit", handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  let word = $("input").val();
  //   console.log(word);

  if (!word) return;

  const res = await axios.get("/check-word", { params: { word: word } });
  let response = res.data.response;
  console.log(response);
  console.log(word);
  if (response === "ok") {
    if (!correct_words.includes(word)) {
      correct_words.push(word);
      score += word.length;
      $("#not-a-word").text("");
      $("#score").text(`Score: ${score}`);
      $("#score").css("color", "green");
    }
  } else {
    $("#not-a-word").text("Sorry, not a word!!");
    $("#not-a-word").css("color", "red");
    $("#score").css("color", "black");
  }

  $("input").val("");
}

let countDown = setInterval(function () {
  //Every second, decrease the time by one and update the time displayed in the DOM
  time--;
  $("#timer").html(time);
  //run this function that only fully executes when time is up.
  stopTimer();
}, 1000);

function stopTimer() {
  //if time has run out, stop the countdown and replace the form with the words "GAME OVER"
  if (time < 1) {
    clearInterval(countDown);
    $("form").hide();
    $("table").hide();
    $(".container").append(
      $("<span>").html("GAME OVER!!! You scored " + score)
    );
    endGame();
  }
}

async function endGame() {
  //post score to server to see if the high score needs to be updated
  await axios.post("/end-game", { score: score });
}
