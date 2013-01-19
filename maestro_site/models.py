from django.db import models
import datetime

class PlaySession (models.Model):
    '''
    Models a playback session among multiple machines.
    '''
    title = models.CharField(max_length=100, unique=True)

    # ---------- originally from PlayState model:
    # How long to wait after "PLAY" button is pressed to start playing.
    # This is used to debunk some network latency.
    LATENCY_TIME_MS = 3000
    # Are we ready to play?
    ready = models.BooleanField( default=False )
    # When will we start playing (+ LATENCY_TIME_MS)?
    startTime = models.DateTimeField( null=True, blank=True )

    def time( self ):
        if self.startTime:
            epoch = datetime.datetime.fromtimestamp(0)
            offset = datetime.timedelta( milliseconds=PlaySession.LATENCY_TIME_MS )
            delta = self.startTime - epoch + offset
            return delta.total_seconds() * 1000.0
        return -1

    def __unicode__( self ):
        return self.title



class SongStem(models.Model):
		
		name = models.CharField(max_length=60)
		instr = models.CharField(max_length=30)#Instrument
		faudio = models.CharField(max_length=50)#Audio file name
		num_access = models.IntegerField()
		artist = models.CharField(max_length=40)
