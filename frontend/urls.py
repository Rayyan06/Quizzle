from django.urls import path
from .views import index

urlpatterns = [
    path('create', index),
    path('join', index),
    path('', index),
    path('play/<str:quizCode>', index),
]