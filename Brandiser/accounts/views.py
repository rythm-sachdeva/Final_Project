from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,LoginSerializer
from .tokenAuthentication import TokenAuthentication


# Create your views here.

class UserRegisterView(APIView):
    def post(self,request):
        serialiser = UserSerializer(data=request.data)
        if(serialiser.is_valid()):
            serialiser.save()
            token = TokenAuthentication.generate_token(serialiser.validated_data)
            return Response({'message':'registration_successful','token':token},status=status.HTTP_201_CREATED)
        return Response(serialiser.errors,status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
   def post(self,request):
        serializers = LoginSerializer(data=request.data)
        if serializers.is_valid():
            token = TokenAuthentication.generate_token(serializers.validated_data)
            return Response({'message':'Login Successfull','token':token,'user':serializers.data},status=status.HTTP_201_CREATED)
        return Response(serializers.errors,status=status.HTTP_400_BAD_REQUEST)
        
        
