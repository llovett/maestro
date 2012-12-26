from django.http import HttpResponse
from maestro_site.models import PlayState
import json

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
        return HttpResponse( json.dumps(response) )
    if playstate.ready:
        response['ready'] = True
        response['playtime'] = playstate.time()
    return HttpResponse( json.dumps(response) )

def reset_playback( request ):
    try:
        playstate = PlayState.objects.get(pk=1)
    except PlayState.DoesNotExist:
        playstate = PlayState()
    playstate.ready = False
    playstate.save()
    return HttpResponse()
