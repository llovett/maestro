from django.conf.urls import patterns, include, url
from django.views.generic.simple import direct_to_template
from maestro_site import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
                       url( r'^$', views.session_new, name="main_page" ),
                       url( r'^session/new/$', views.session_new, name="session_new" ),
                       url( r'^session/join/$', views.session_get, name="session_join" ),
                       url( r'time$', views.time ),
                       url( r'play$', views.start_playback ),
                       url( r'poll$', views.poll_playback ),
                       url( r'reset$', views.reset_playback ),

                       # Examples:
                       # url(r'^$', 'maestro.views.home', name='home'),
                       # url(r'^maestro/', include('maestro.foo.urls')),
                       
                       # Uncomment the admin/doc line below to enable admin documentation:
                       # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
                       
                       # Uncomment the next line to enable the admin:
                       # url(r'^admin/', include(admin.site.urls)),
)
