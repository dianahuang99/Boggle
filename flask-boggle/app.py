from boggle import Boggle

from flask import Flask, request, render_template, redirect, flash, jsonify, session

from random import choice, randint, sample

from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config["SECRET_KEY"] = "oh-so-secret"
app.config["DEBUG_TB_INTERCEPT_REDIRECTS"] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()


@app.route('/', methods=['POST', 'GET'])
def show_home_page():
    board = boggle_game.make_board()
    session['board'] = board
    highscore = session.get('highscore', 0)
    numplays = session.get('numplays', 0)
    
    return render_template('home.html', highscore=highscore, numplays=numplays)

@app.route('/check-word')
def check_word():
    word = request.args['word']
    board = session['board']
    response_string = boggle_game.check_valid_word(board, word)
    return jsonify({'response': response_string})

@app.route("/end-game", methods=["POST"])
def end_game():
   """get the axios post (score) from the endgame function and update highscore in session"""
   score = request.json["score"]
   #get current high score from session, if there is no high score saved in session, set variable to zero.
   highscore = session.get("highscore", 0)
   #update high score in the session
   session["highscore"] = max(score, highscore)
   numplays = session.get('numplays', 0)
   session["numplays"] = numplays + 1
   #It seems like we have to return something here or else we will get a 500 error.
   return "game over"