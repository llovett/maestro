from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib import messages
from maestro_site.models import PlaySession, SongStem, SongStemEncoder
import datetime
import json
from forms import PlaySessionForm
    
def session_new( request ):
    '''
    Starts a new playing sesssion.
    '''
    user_list = []
    song_list = SongStem.objects.all()
    for song in song_list:
	if user_list.count(song.name) == 0:
	    user_list.append(str(song.name))

    form = PlaySessionForm( request.POST or None )
    if form.is_valid():
	playSession = form.save()
	session_title = playSession.title
	request.session['playsession'] = playSession.id
	return render_to_response('session.html', locals(), context_instance=RequestContext(request))
    return render_to_response('index.html', locals(), context_instance=RequestContext(request))

def get_stems( request ):
    '''
    Returns all the stems for a particular song, set the song for the session.
    '''
    # Make sure our session is clean
    playSession = PlaySession.objects.get(id=request.session['playsession'])
    playSession.startPosition = 0.0
    playSession.ready = False

    # Get the song name, grab stems
    songname = request.GET.get('title')
    songname = songname.strip()
    stems = {}
    if songname:
        encoder = SongStemEncoder()
        songStems = SongStem.objects.filter( name=str(songname) )
        for s in songStems:
            s.num_access += 1
            s.save()
            stems['stems'] = encoder.default(s)

    # Set the song title for the session
    playSession.songTitle = songname
    playSession.save()

    return HttpResponse( json.dumps( stems ),
                         mimetype='application/json' )

def session_get( request ):
    '''
    Gets (joins) a session
    '''
    user_list = []
    song_list = SongStem.objects.all()
    for song in song_list:
	if user_list.count(song.name) == 0:
	    user_list.append(str(song.name))
    session_title = request.POST['title']
    try:
        playSession = PlaySession.objects.get(title=session_title)
        request.session['playsession'] = playSession.id
    except PlaySession.DoesNotExist:
        # Show a message & create a new form
        messages.add_message( request, messages.ERROR, 'Could not find a session with that name.' )
        form = PlaySessionForm()
        return render_to_response('index.html', locals(), context_instance=RequestContext(request))
    return render_to_response('session.html', locals(), context_instance=RequestContext(request))

def session_destroy( request ):
    '''
    Destroys (leaves) a session
    '''
    try:
	playSession = PlaySession.objects.get(id=request.session['playsession'])
        playSession.delete()
        request.session['playsession'] = 0
    except PlaySession.DoesNotExist:
        # May have been destroyed by another user connected to the session
        pass
    form = PlaySessionForm()    
    return render_to_response('index.html', locals(), context_instance=RequestContext(request))

def time( request ):
    msSinceEpoch = (datetime.datetime.now() - datetime.datetime.fromtimestamp(0)).total_seconds()*1000.0
    return HttpResponse( json.dumps({"time":msSinceEpoch}),
			 mimetype="application/json" )

def start_playback( request ):
    '''
    The 'play' action
    '''
    playSession = PlaySession.objects.get(id=request.session['playsession'])
    playSession.ready = True
    playSession.startTime = datetime.datetime.now()
    playSession.save()
    return HttpResponse()

def poll_playback( request ):
    '''
    Information returned to clients on a regular polling basis
    '''
    # Check if we're ready to play or not
    response = { 'ready':False }
    try:
        playSession = PlaySession.objects.get(id=request.session['playsession'])
    except PlaySession.DoesNotExist:
        response['redirect'] = True
        return HttpResponse( json.dumps(response), mimetype='application/json' )
    if playSession.songTitle:
        response['songtitle'] = playSession.songTitle
    if playSession.ready:
	response['ready'] = True
        response['playtime'] = playSession.time()
        response['playposition'] = playSession.startPosition
    return HttpResponse( json.dumps(response), mimetype='application/json' )

def reset_playback( request ):
    '''
    The "pause" action
    '''
    import sys
    sys.stderr.write("resetting playback")
    time = float(request.POST['time']) if 'time' in request.POST else None
    playSession = PlaySession.objects.get(id=request.session['playsession'])
    if time:
        playSession.startPosition = time
    playSession.ready = False
    playSession.save()
    return HttpResponse()
