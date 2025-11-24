# backend/gamificacion/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Logro, LogroUsuario, Grupo, MiembroGrupo
from .serializers import (
    LogroSerializer,
    LogroUsuarioSerializer,
    GrupoSerializer,
    MiembroGrupoSerializer
)

class LogroViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para logros/insignias (HU08).
    
    Endpoints:
    - GET /api/logros/ - Listar todos los logros disponibles
    - GET /api/logros/{id}/ - Ver detalle de un logro
    - GET /api/logros/mis-logros/ - Ver logros obtenidos por el usuario
    """
    queryset = Logro.objects.filter(activo=True)
    serializer_class = LogroSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='mis-logros')
    def mis_logros(self, request):
        """
        Ver logros obtenidos por el usuario autenticado.
        GET /api/logros/mis-logros/
        """
        logros_usuario = LogroUsuario.objects.filter(
            usuario=request.user
        ).select_related('logro')
        
        serializer = LogroUsuarioSerializer(logros_usuario, many=True)
        return Response(serializer.data)


class GrupoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para grupos/comunidades ecológicas (HU11).
    
    Endpoints:
    - GET /api/grupos/ - Listar grupos
    - GET /api/grupos/{id}/ - Ver detalle de un grupo
    - POST /api/grupos/ - Crear nuevo grupo
    - POST /api/grupos/{id}/unirse/ - Unirse a un grupo
    - POST /api/grupos/{id}/salir/ - Salir de un grupo
    """
    queryset = Grupo.objects.filter(activo=True)
    serializer_class = GrupoSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """
        Al crear un grupo, el creador es el usuario autenticado.
        """
        grupo = serializer.save(creador=self.request.user)
        
        # Agregar al creador como miembro administrador
        MiembroGrupo.objects.create(
            usuario=self.request.user,
            grupo=grupo,
            es_admin=True
        )
    
    @action(detail=True, methods=['post'], url_path='unirse')
    def unirse(self, request, pk=None):
        """
        Unirse a un grupo (HU11).
        POST /api/grupos/{id}/unirse/
        """
        grupo = self.get_object()
        
        # Verificar si ya es miembro
        if MiembroGrupo.objects.filter(usuario=request.user, grupo=grupo).exists():
            return Response({
                'error': 'Ya eres miembro de este grupo'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear membresía
        MiembroGrupo.objects.create(
            usuario=request.user,
            grupo=grupo
        )
        
        return Response({
            'message': f'Te has unido al grupo "{grupo.nombre}" exitosamente'
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'], url_path='salir')
    def salir(self, request, pk=None):
        """
        Salir de un grupo.
        POST /api/grupos/{id}/salir/
        """
        grupo = self.get_object()
        
        try:
            membresia = MiembroGrupo.objects.get(usuario=request.user, grupo=grupo)
            membresia.delete()
            
            return Response({
                'message': f'Has salido del grupo "{grupo.nombre}"'
            })
        except MiembroGrupo.DoesNotExist:
            return Response({
                'error': 'No eres miembro de este grupo'
            }, status=status.HTTP_400_BAD_REQUEST)