from django.db import models
import datetime

class PlaySession (models.Model):
    '''
    Models a playback session among multiple machines.
    '''
    title = models.CharField(max_length=100, unique=True)

    def __unicode__( self ):
        return self.title

class PlayState (models.Model):
    '''
    Models the playstate of a single song within a Session.
    '''
    # How long to wait after "PLAY" button is pressed to start playing.
    # This is used to debunk some network latency.
    LATENCY_TIME_MS = 3000
    # Are we ready to play?
    ready = models.BooleanField( default=False )
    # When will we start playing (+ LATENCY_TIME_MS)?
    startTime = models.DateTimeField( auto_now=True )
    # Session we're playing in
    playSession = models.ForeignKey('PlaySession')

    def time( self ):
        epoch = datetime.datetime.fromtimestamp(0)
        offset = datetime.timedelta( milliseconds=PlayState.LATENCY_TIME_MS )
        delta = self.startTime - epoch + offset
        return delta.total_seconds() * 1000.0

    def __unicode__( self ):
        return "<%s> (%s)"%( "ready" if self.ready else "not ready", self.time() )
