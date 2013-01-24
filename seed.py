from django.core.management import setup_environ
from maestro import settings

if __name__ == '__main__':
    setup_environ( settings )
    from maestro_site.models import SongStem

    # Clear out all SongStems
    SongStem.objects.all().delete()

    AUDIO = [
        { 'name':"When I'm 64",         # Song name
          'instr':"Bass",               # Instrument name, as it appears on session
          'faudio':"64.Bass.m4a",       # Audio file name (basename)
          'artist':"The Beatles"        # Artist name
        },
        { 'name':"When I'm 64",
          'instr':"Clarinets",
          'faudio':"64.Clarinets.m4a",
          'artist':"The Beatles"
        },
        { 'name':"When I'm 64",
          'instr':"Drums",
          'faudio':"64.Drums.m4a",
          'artist':"The Beatles"
        },
        { 'name':"When I'm 64",
          'instr':"Piano",
          'faudio':"64.Piano",
          'artist':"The Beatles"
        },
        { 'name':"When I'm 64",
          'instr':"Vocals",
          'faudio':"64.Voice.m4a",
          'artist':"The Beatles"
        },
        { 'name':"I Am The Walrus",
          'instr':"Bass",
          'faudio':"Walrus.Bass.m4a",
          'artist':"The Beatles"
        },
        { 'name':"I Am The Walrus",
          'instr':"Drums",
          'faudio':"Walrus.Drums.m4a",
          'artist':"The Beatles"
        },
        { 'name':"I Am The Walrus",
          'instr':"Guitar and Keys",
          'faudio':"Walrus.GuitarKeys.m4a",
          'artist':"The Beatles"
        },
        { 'name':"I Am The Walrus",
          'instr':"Strings",
          'faudio':"Walrus.Strings.m4a",
          'artist':"The Beatles"
        },
        { 'name':"I Am The Walrus",
          'instr':"Vocals",
          'faudio':"Walrus.Vocals.m4a",
          'artist':"The Beatles"
        },
        { 'name':"Cologne",
          'instr':"Bass",
          'faudio':"Cologne.Bass.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Cologne",
          'instr':"Drums",
          'faudio':"Cologne.Drums.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Cologne",
          'instr':"Piano",
          'faudio':"Cologne.Piano.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Cologne",
          'instr':"Strings",
          'faudio':"Cologne.Strings.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Cologne",
          'instr':"Vocals",
          'faudio':"Cologne.Vocals.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Effington",
          'instr':"Bass",
          'faudio':"Effington.Bass.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Effington",
          'instr':"Drums",
          'faudio':"Effington.Drums.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Effington",
          'instr':"Piano",
          'faudio':"Effington.Piano.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Effington",
          'instr':"Vocals",
          'faudio':"Effington.Voice.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Effington",
          'instr':"Bass",
          'faudio':"Effington.Bass.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Ben Vocals",
          'faudio':"YDKM.Ben_Vocals.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Cellos + Background Vocals",
          'faudio':"YDKM.Cellos_+_Bkgd Vocals.m4a", #This file name has a space
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Drums",
          'faudio':"YDKM.Drums.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Piano",
          'faudio':"YDKM.Piano.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Regina Spektor + Piano",
          'faudio':"YDKM.Regina_+_Piano.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"You Don't Know Me",
          'instr':"Violins",
          'faudio':"YDKM.Violins.m4a",
          'artist':"Ben Folds"
        },
        { 'name':"Holocene",
          'instr':"Bass",
          'faudio':"Holocene.Bass.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Drums",
          'faudio':"Holocene.Drums.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Guitar 1",
          'faudio':"Holocene.Guitar1.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Guitar 2",
          'faudio':"Holocene.Guitar2.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Synth",
          'faudio':"Holocene.Synth.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Vibes",
          'faudio':"Holocene.Vibes.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Vocals",
          'faudio':"Holocene.Vox.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"Holocene",
          'instr':"Winds",
          'faudio':"Holocene.Winds.m4a",
          'artist':"Bon Iver"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Drums",
          'faudio':"Evening.Drums.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Guitar 1",
          'faudio':"Evening.Guitar1.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Guitar 2",
          'faudio':"Evening.Guitar2.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Kalimba + Voice",
          'faudio':"Evening.KalimbaVoice.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Piano",
          'faudio':"Evening.Piano.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Voice 1",
          'faudio':"Evening.Voice1.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"An Evening with Mr. Ignatius",
          'instr':"Voice 2",
          'faudio':"Evening.Voice2.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 1",
          'faudio':"PianoVisions_Speaker_1.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 2",
          'faudio':"PianoVisions_Speaker_2.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 3",
          'faudio':"PianoVisions.Speaker_3.m4a",#File Name Changes back to usual structure
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 4",
          'faudio':"PianoVisions.Speaker_4.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 5",
          'faudio':"PianoVisions.Speaker_5.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 6",
          'faudio':"PianoVisions.Speaker_6.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 7",
          'faudio':"PianoVisions.Speaker_7.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Piano Visions",
          'instr':"Speaker 8",
          'faudio':"PianoVisions.Speaker_8.m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 1 (Left)",
          'faudio':"Planetarium.Voice_1_(Left).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 1 (Right)",
          'faudio':"Planetarium.Voice_1_(Right).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 2 (Left)",
          'faudio':"Planetarium.Voice_2_(Left).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 2 (Right)",
          'faudio':"Planetarium.Voice_2_(Right).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 3 (Left)",
          'faudio':"Planetarium.Voice_3_(Left).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Planetarium",
          'instr':"Voice 3 (Right)",
          'faudio':"Planetarium.Voice_3_(Right).m4a",
          'artist':"Charlie Spears"
        },
        { 'name':"Ghosts",
          'instr':"Guitar Loops",
          'faudio':"Ghosts.GuitarLoops.m4a",
          'artist':"Duncan Reilly"
        },
        { 'name':"Ghosts",
          'instr':"Guitars and Bass",
          'faudio':"Ghosts.GuitarGuitarsBass.m4a",
          'artist':"Duncan Reilly"
        },
        { 'name':"Ghosts",
          'instr':"Melody",
          'faudio':"Ghosts.Melody.m4a",
          'artist':"Duncan Reilly"
        },
        { 'name':"Ghosts",
          'instr':"Piano Texture",
          'faudio':"Ghosts.PianoTexture.m4a",
          'artist':"Duncan Reilly"
        },
        { 'name':"Ghosts",
          'instr':"Synths and Bass",
          'faudio':"Ghosts.SynthsAndBass.m4a",
          'artist':"Duncan Reilly"
        },
        { 'name':"You Used to be So Sweet",
          'instr':"Bass",
          'faudio':"Sweet.Bass.mp3",
          'artist':"Eastman Presser"
        },
        { 'name':"You Used to be So Sweet",
          'instr':"Drums",
          'faudio':"Sweet.Drums.mp3",
          'artist':"Eastman Presser"
        },
        { 'name':"You Used to be So Sweet",
          'instr':"Synth 1 (Light)",
          'faudio':"Sweet.Synth1(Light).mp3",
          'artist':"Eastman Presser"
        },
        { 'name':"You Used to be So Sweet",
          'instr':"Synth 2 (Accompaniment)",
          'faudio':"Sweet.Synth2(Accompaniment).mp3",
          'artist':"Eastman Presser"
        },
        { 'name':"You Used to be So Sweet",
          'instr':"Synth 3 (Melody)",
          'faudio':"Sweet.Synth3(Melody).mp3",
          'artist':"Eastman Presser"
        },
        { 'name':"Firework",
          'instr':"Ensemble1",
          'faudio':"Firework.Ensemble 1.m4a",
          'artist':"The Obertones"
        },
        { 'name':"Firework",
          'instr':"Ensemble2",
          'faudio':"Firework.Ensemble2.m4a",
          'artist':"The Obertones"
        },
        { 'name':"Firework",
          'instr':"Noah (Solo)",
          'faudio':"Firework.Noah(Solo).m4a",
          'artist':"The Obertones"
        },
        { 'name':"Firework",
          'instr':"Max (Countersolo)",
          'faudio':"Firework.Max(Countersolo).m4a",
          'artist':"The Obertones"
        },
        { 'name':"Sticks & Stones",
          'instr':"Richard (Solo)",
          'faudio':"Jonsi.Richard(Solo).m4a",
          'artist':"The Obertones"
        },
        { 'name':"Sticks & Stones",
          'instr':"Dan (Beatbox)",
          'faudio':"Jonsi.Dan(Beatbox).m4a",
          'artist':"The Obertones"
        },
        { 'name':"Sticks & Stones",
          'instr':"Ensemble 1",
          'faudio':"Jonsi.Ensemble1.m4a",
          'artist':"The Obertones"
        },
        { 'name':"Sticks & Stones",
          'instr':"Ensemble 2",
          'faudio':"Jonsi.Ensemble2.m4a",
          'artist':"The Obertones"
        },
        { 'name':"Routine Symptoms",
          'instr':"Ambience",
          'faudio':"Rout.Ambience.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Churning Machinery",
          'faudio':"Rout.ChurningMachinery.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Fuzz Overload",
          'faudio':"Rout.FuzzOverload.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Old Piano",
          'faudio':"Rout.OldPiano.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Positive Feedback Loop",
          'faudio':"Rout.PositiveFeedbackLoop.m4a",
          'artist':"Ross Chait"
          },
        { 'name':"Routine Symptoms",
          'instr':"Sampled, Voiced, Strummed 1",
          'faudio':"Rout.SampledVoicedStrummed1.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Sampled, Voiced, Strummed 2",
          'faudio':"Rout.SampledVoicedStrummed2.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Routine Symptoms",
          'instr':"Sampled, Voiced, Strummed 3",
          'faudio':"Rout.SampledVoicedStrummed3.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Solo for Walden",
          'instr':"Distant Voice",
          'faudio':"Walden.Distantvoice.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Solo for Walden",
          'instr':"Rocks On Rocks",
          'faudio':"Walden.RocksOnRocks.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Solo for Walden",
          'instr':"Water Sounds",
          'faudio':"Walden.WaterSounds.m4a",
          'artist':"Ross Chait"
        },
        { 'name':"Ransacked",
          'instr':"Drums and Bass",
          'faudio':"Rans.DrumsAndBass.m4a",
          'artist':"Stolen Jars"
        },
        { 'name':"Ransacked",
          'instr':"Main Guitars + More",
          'faudio':"Rans.MainGuitars+More.m4a",
          'artist':"Stolen Jars"
        },
        { 'name':"Ransacked",
          'instr':"Secondary Guitars",
          'faudio':"Rans.SecondaryGuitars.m4a",
          'artist':"Stolen Jars"
        },
        { 'name':"Ransacked",
          'instr':"Vocals",
          'faudio':"Rans.Vocals.m4a",
          'artist':"Stolen Jars"
        }
    ]

    # Turn "AUDIO" into SongStem objects
    for track in AUDIO:
        print "Creating %s (%s)"%(track['name'],track['instr'])
        SongStem.objects.create( **track )
