from django.db import models
import string
import random

# Create your models here.

def generate_unique_code():
    length = 6
    code = ''.join(random.choices(string.ascii_uppercase, k=length))
    while True:
        if Quiz.objects.filter(code=code).count()==0:
            break
    return code

class Quiz(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(default=generate_unique_code, unique=True, max_length=6)
    host = models.CharField(max_length=50)

    class Meta: 
        verbose_name_plural = "Quizzes"
    
    def __str__(self):
        return f'code: {self.code} name: {self.name}'

class Question(models.Model):
    time_limit = models.IntegerField(default=20)
    text = models.CharField(max_length=100)
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)
    def __str__(self):
        return self.text


class Answer(models.Model):
    text = models.CharField(max_length=40)
    is_correct = models.BooleanField(default=False)
    question = models.ForeignKey(Question, related_name='answers', on_delete=models.CASCADE)
    