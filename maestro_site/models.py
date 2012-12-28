from django.db import models
import datetime

# Create your models here.
class PlayState (models.Model):
    # How long to wait after "PLAY" button is pressed to start playing.
    # This is used to debunk some network latency.
    LATENCY_TIME_MS = 3000
    # Are we ready to play?
    ready = models.BooleanField( default=False )
    # When will we start playing (+ LATENCY_TIME_MS)?
    startTime = models.DateTimeField( auto_now=True )

    def time( self ):
        epoch = datetime.datetime.fromtimestamp(0)
        offset = datetime.timedelta( milliseconds=PlayState.LATENCY_TIME_MS )
        delta = self.startTime - epoch + offset
        return delta.total_seconds() * 1000.0

    def __unicode__( self ):
        return "<%s> (%s)"%( "ready" if self.ready else "not ready", self.time() )
