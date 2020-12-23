from django.test import TestCase
from .models import Answer, Question, Quiz

# Create your tests here.

class QuizTest(TestCase):
    """Testing for the Quiz Model"""

    def test_unique_code(self):
        pass

class QuestionTest(TestCase):
    """Testing for the Question Model"""
    pass

class AnswerTest(TestCase):
    """ Testing for the Answer model"""

    def setUp(self):
        test_quiz = Quiz.objects.create(name='Test Quiz', host='Blah Blag')
        test_question = Question.objects.create(text='Test Question', time_limit=4, quiz=test_quiz, order=1)
        Answer.objects.create(text='Answer 1', is_correct=False, question=test_question)
        Answer.objects.create(text='Answer 2', is_correct=True, question=test_question)


    def test_is_correct(self):
        true_answer = Answer.objects.get(text='Answer 2')
        false_answer = Answer.objects.get(text='Answer 1')

        self.assertEqual(true_answer.is_correct, True)
        self.assertEqual(false_answer.is_correct, False)

class CreateQuizTest(TestCase):
    pass

