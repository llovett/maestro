# README

## A Synopsis of How it Works

### The 'PLAY' Button

When the client loads a page for a particular song, all of the instrument tracks
for that song are loaded. Using JavaScript, which track is appropriate to play
is determined when the user selects an instrument from the instrument list. At
this time, the client begins to poll the server at second intervals in order to
determine whether it is time to play or not. The server will give back one of
two possible responses: either "NO," it is not time to play the track yet or
"YES, play the track at time x" where x is specified in server time milliseconds
UTC. It should be noted that the value of 'x' should be chosen to try to account
for some network latency, maybe 3 seconds of server time after the point when
the PLAY button is pressed on the client's end. Upon receiving a "YES" reply
from the server, the client uses the offset time calculated when the client
first connected to Maestro in order to transform the time 'x' into client time,
then sets a timer in JavaScript for time 'x'. When the timer goes off, the track
begins to play.
