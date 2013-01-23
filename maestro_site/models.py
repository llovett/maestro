from django.db import models
import datetime
import json

class PlaySession (models.Model):
    '''
    Models a playback session among multiple machines.
    '''
    # Title of the session
    title = models.CharField(max_length=100, unique=True)

    # ---------- originally from PlayState model:
    # How long to wait after "PLAY" button is pressed to start playing.
    # This is used to debunk some network latency.
    LATENCY_TIME_MS = 3000
    # Are we ready to play?
    ready = models.BooleanField( default=False )
    # When will we start playing (+ LATENCY_TIME_MS)?
    startTime = models.DateTimeField( null=True, blank=True )
    # What position through playback we should begin playing
    startPosition = models.FloatField( null=True, blank=True )
    # What song we are playing right now
    songTitle = models.CharField(blank=True, null=True, max_length=500)

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

    def __unicode__( self ):
        return self.faudio

class SongStemEncoder( json.JSONEncoder ):
    def default( self, o ):
        if isinstance( o, SongStem ):
            return {
                'name':o.name,
                'instr':o.instr,
                'faudio':o.faudio,
                'num_access':o.num_access,
                'artist':o.artist
            }
        else:
            return json.JSONEncoder.default( self, o )
