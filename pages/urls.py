from django.urls import path
from . import views

urlpatterns = [

    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('translate/', views.translate_view, name='translate_view'),
    path('name/', views.give_text, name='give_text'),
    path('solar/', views.solar, name='solar'),
    path('chatbot/', views.chatbot, name='chatbot')


]