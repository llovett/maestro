from django.http import HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib import messages
from maestro_site.models import PlayState, PlaySession
import datetime
import json
from forms import PlaySessionForm

def session_new( request ):
    form = PlaySessionForm( request.POST or None )
    if form.is_valid():
        form.save()
        return HttpResponse("Your new session has been created")
    return render_to_response('index.html', locals(), context_instance=RequestContext(request))

def session_get( request ):
    session_title = request.POST['title']
    try:
        playSession = PlaySession.objects.get(title=session_title)
    except PlaySession.DoesNotExist:
        # Show a message & create a new form
        messages.add_message( request, messages.ERROR, 'Could not find a session with that name.' )
        form = PlaySessionForm()
        return render_to_response('index.html', locals(), context_instance=RequestContext(request))
    return render_to_response('session.html', locals(), context_instance=RequestContext(request))

def time( request ):
    msSinceEpoch = (datetime.datetime.now() - datetime.datetime.fromtimestamp(0)).total_seconds()*1000.0
    return HttpResponse( json.dumps({"time":msSinceEpoch}),
                                    mimetype="application/json" )

def start_playback( request ):
    # Grab the playstate
    try:
        playstate = PlayState.objects.get(pk=1)
    except PlayState.DoesNotExist:
        playstate = PlayState()

    playstate.ready = True
    playstate.save()

    return HttpResponse()

def poll_playback( request ):
    # Check if we're ready to play or not
    response = {'ready':False}
    try:
        playstate = PlayState.objects.get(pk=1)
    except PlayState.DoesNotExist:
        return HttpResponse( json.dumps(response), mimetype='application/json' )
    if playstate.ready:
        response['ready'] = True
        response['playtime'] = playstate.time()
    return HttpResponse( json.dumps(response), mimetype='application/json' )

def reset_playback( request ):
    try:
        playstate = PlayState.objects.get(pk=1)
    except PlayState.DoesNotExist:
        playstate = PlayState()
    playstate.ready = False
    playstate.save()
    return HttpResponse()
