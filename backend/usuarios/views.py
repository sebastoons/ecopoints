# backend/usuarios/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Usuario
from .serializers import (
    UsuarioSerializer,
    UsuarioRegistroSerializer,
    UsuarioPerfilSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar usuarios.
    
    Endpoints:
    - GET /api/usuarios/ - Listar usuarios (solo admin)
    - GET /api/usuarios/{id}/ - Ver detalle de usuario
    - POST /api/usuarios/registro/ - Registrar nuevo usuario (HU01)
    - POST /api/usuarios/login/ - Iniciar sesión (HU02)
    - GET /api/usuarios/perfil/ - Ver perfil propio
    - PUT /api/usuarios/perfil/ - Editar perfil propio
    - GET /api/usuarios/ranking/ - Ver ranking global (HU07)
    """
    queryset = Usuario.objects.filter(activo=True)
    serializer_class = UsuarioSerializer
    
    def get_permissions(self):
        """
        Define permisos según la acción.
        """
        if self.action in ['registro', 'login']:
            # Registro y login son públicos
            return [permissions.AllowAny()]
        elif self.action in ['perfil', 'update_perfil']:
            # Perfil solo para usuarios autenticados
            return [permissions.IsAuthenticated()]
        else:
            # Otras acciones solo para administradores
            return [permissions.IsAdminUser()]
    
    def get_serializer_class(self):
        """
        Retorna el serializer adecuado según la acción.
        """
        if self.action == 'registro':
            return UsuarioRegistroSerializer
        elif self.action in ['perfil', 'update_perfil']:
            return UsuarioPerfilSerializer
        return UsuarioSerializer
    
    @action(detail=False, methods=['post'], url_path='registro')
    def registro(self, request):
        """
        Registrar un nuevo usuario (HU01).
        POST /api/usuarios/registro/
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        
        # Generar tokens JWT para login automático
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """
        Iniciar sesión y obtener tokens JWT (HU02).
        POST /api/usuarios/login/
        Body: { "username": "...", "password": "..." }
        """
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'Por favor proporciona username y password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Autenticar usuario
        usuario = authenticate(username=username, password=password)
        
        if usuario is None:
            return Response({
                'error': 'Credenciales inválidas'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not usuario.activo:
            return Response({
                'error': 'Esta cuenta está desactivada'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Inicio de sesión exitoso',
            'usuario': UsuarioSerializer(usuario).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    
    @action(detail=False, methods=['get'], url_path='perfil')
    def perfil(self, request):
        """
        Ver el perfil del usuario autenticado.
        GET /api/usuarios/perfil/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'], url_path='perfil/editar')
    def update_perfil(self, request):
        """
        Editar el perfil del usuario autenticado.
        PUT/PATCH /api/usuarios/perfil/editar/
        """
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True  # Permite actualización parcial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'usuario': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='ranking')
    def ranking(self, request):
        """
        Obtener el ranking global de usuarios (HU07).
        GET /api/usuarios/ranking/
        """
        # Ordenar usuarios por puntos (mayor a menor)
        usuarios_ranking = Usuario.objects.filter(
            activo=True
        ).order_by('-puntos_totales')[:100]  # Top 100
        
        serializer = UsuarioSerializer(usuarios_ranking, many=True)
        return Response(serializer.data)