from django.forms import ModelForm
from maestro_site.models import PlaySession

class PlaySessionForm( ModelForm ):
    class Meta:
        model = PlaySession
