from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import QuizSerializer, QuestionSerializer, AnswerSerializer
from .models import Quiz, Question, Answer

# Create your views here.


class QuizView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

class GetQuiz(APIView):
    """ Searches for a quiz given its code and returns the Quiz with is_host info"""
    serializer_class = QuizSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None): # This is an HTTP GET request
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None: # Check if code is not equal to None
            quiz = Quiz.objects.filter(code=code)
            if len(quiz) > 0: # If there is a quiz...
                data = QuizSerializer(quiz[0]).data
                data['is_host'] = self.request.session.session_key == quiz[0].host
                

                return Response(data, status=status.HTTP_200_OK)

            return Response({'Quiz not found': 'Invalid Code'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code Parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)
        

        
class CreateQuizView(APIView):
    """Creates A new Quiz given nested question and answer data"""
    serializer_class = QuizSerializer

    def post(self, request, format=None):
        """ Create the User's Account first"""
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        data = request.data
        data['host'] = self.request.session.session_key
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():
            
            quiz = serializer.create(validated_data=data)
            self.request.session['quiz_code'] = quiz.code

            return Response(
                self.serializer_class(quiz).data, 
                status=status.HTTP_201_CREATED
                )


        return Response({'Bad Request': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)

        
class JoinQuiz(APIView):
    """Join a quiz based on the quiz code"""
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)

        if code != None:
            quiz_result = Quiz.objects.filter(code=code)
            if len(quiz_result) > 0:

                self.request.session['quiz_code'] = code
                return Response({'message': 'Quiz Joined!'}, status=status.HTTP_200_OK)
            
            return Response({'Quiz Not Found': 'Invalid Quiz Code'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Invalid Post Data'}, status=status.HTTP_400_BAD_REQUEST)
        


class QuestionView(generics.ListAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

class GetQuestion(APIView):
    """ Get a Question by ID"""
    lookup_url_kwarg = 'id'
    serializer_class = QuestionSerializer

    def get(self, request, format=None):
        question_id = request.GET.get(self.lookup_url_kwarg)

        if question_id != None:
            questions = Question.objects.filter(id=question_id)
            if len(questions) > 0:
                question = questions[0]
                data = QuestionSerializer(question).data

                return Response(data, status=status.HTTP_200_OK)
            
            return Response({'Question Not Found': 'Invalid ID'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'Bad Request': 'Invalid Data'}, status=status.HTTP_400_BAD_REQUEST)





class AnswerView(generics.ListAPIView):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer

