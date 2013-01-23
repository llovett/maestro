from django.forms import ModelForm
from django import forms
from maestro_site.models import PlaySession

class PlaySessionForm( ModelForm ):
    def __init__( self, *args, **kwargs ):
        super( PlaySessionForm, self ).__init__( *args, **kwargs )
        titleField = self.fields.get( 'title' )
        if titleField:
            titleField.widget = forms.TextInput(
                attrs = {'placeholder':"Enter Listening Room name here..."}
            )
            titleField.label = ""

    class Meta:
        model = PlaySession
        fields = ('title',)
