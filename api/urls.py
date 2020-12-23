from django.urls import path
from .views import QuizView, AnswerView, QuestionView, GetQuiz, CreateQuizView, GetQuestion, JoinQuiz


urlpatterns = [
    path('quizzes', QuizView.as_view()),
    path('questions', QuestionView.as_view()),
    path('answers', AnswerView.as_view()),
    path('create-quiz', CreateQuizView.as_view()),
    path('join-quiz', JoinQuiz.as_view()),
    path('get-question', GetQuestion.as_view()),
    path('get-quiz', GetQuiz.as_view())
]  