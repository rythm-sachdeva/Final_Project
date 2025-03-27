import jwt
from jwt import InvalidTokenError, ExpiredSignatureError
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.contrib.auth import get_user_model
from datetime import datetime,timedelta

User = get_user_model()

class TokenAuthentication(BaseAuthentication):

    def authenticate(self,request):
        token = self.extract_token(request)

        if token is None:
            return None
        
        try:
            payload = jwt.decode(token,settings.SECRET_KEY,algorithms=['HS256'])
            self.verify_token(payload)
            user_id = payload['id']
            user = User.objects.get(id=user_id)
            return (user,token)
        except (InvalidTokenError,ExpiredSignatureError):
            raise AuthenticationFailed('Invalid Token')
        except User.DoesNotExist:
            raise AuthenticationFailed('User Not found')
        
    def extract_token(self,request):
        auth_header = request.headers.get('Authorization',None)
        if auth_header and auth_header.startswith('Bearer'):
            return auth_header.split(' ')[1]
        return None
    
    def verify_token(self,payload):
        if "exp" not in payload:
            raise InvalidTokenError('token is not having expiration')
        expiration = payload['exp']
        current_time = datetime.utcnow().timestamp()
        if current_time > expiration:
            raise ExpiredSignatureError('Token is Expired')
        
    @staticmethod
    def generate_token(payload):
        payload['exp'] = datetime.utcnow() + timedelta(days=1)
        token = jwt.encode(payload,settings.SECRET_KEY,algorithm='HS256')
        return token
        


