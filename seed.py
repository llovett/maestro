from django.core.management import setup_environ
from maestro import settings

if __name__ == '__main__':
    setup_environ( settings )
    from maestro_site.models import SongStem

    # Clear out all SongStems
    SongStem.objects.all().delete()

    AUDIO = [
        { 'name':"When I'm 64",         # Song name
          'instr':"bass",               # Instrument name, as it appears on session
          'faudio':"64.Bass.m4a",       # Audio file name (basename)
          'artist':"The Beatles"        # Artist name
        },
        { 'name':"When I'm 64",
          'instr':"clarinet",
          'faudio':"64.Clarinets.m4a",
          'artist':"The Beatles"
        }
    ]

    # Turn "AUDIO" into SongStem objects
    for track in AUDIO:
        print "Creating %s (%s)"%(track['name'],track['instr'])
        SongStem.objects.create( **track )


