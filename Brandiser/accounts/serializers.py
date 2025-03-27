from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only= True)

    def create(self,validated_data):
        password = validated_data.pop('password',None)
        user = get_user_model().objects.create_user(**validated_data)

        if password:
            user.set_password(password)
            user.save()

        return user
    
    class Meta:
        model = get_user_model()
        fields = ['id','username','email','first_name','last_name','password']
        extra_kwargs = {'password':{'write_only':True}}

class LoginSerializer(serializers.Serializer):
    id = serializers.CharField(max_length = 15 , read_only = True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(max_length=150,read_only=True)
    first_name = serializers.CharField(max_length=150,read_only=True)
    last_name = serializers.CharField(max_length=150,read_only=True)

    def validate(self,data):
        email = data.get('email',None)
        password = data.get('password',None)

        if not email:
            raise serializers.ValidationError("Email is Required For Authentication")
        if not password:
            raise serializers.ValidationError('Password is Required For Authentication')
        
        user = authenticate(email=email,password=password)
        if user is None:
            raise serializers.ValidationError('User Not Found')
        return {
            'id':user.id,
            'email':user.email,
            'username':user.username,
            'first_name':user.first_name,
            'last_name':user.last_name
        }
        





