# backend/tareas/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum
from .models import TipoTarea, TareaRegistrada
from .serializers import (
    TipoTareaSerializer,
    TareaRegistradaSerializer,
    TareaRegistradaCreateSerializer
)

class TipoTareaViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para el catálogo de tipos de tareas (HU15).
    Solo lectura para usuarios normales.
    
    Endpoints:
    - GET /api/tipos-tarea/ - Listar todos los tipos de tareas
    - GET /api/tipos-tarea/{id}/ - Ver detalle de un tipo de tarea
    """
    queryset = TipoTarea.objects.filter(activa=True)
    serializer_class = TipoTareaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Filtrar por categoría si se proporciona.
        """
        queryset = super().get_queryset()
        categoria = self.request.query_params.get('categoria', None)
        
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        
        return queryset


class TareaRegistradaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar tareas registradas por usuarios.
    
    Endpoints:
    - GET /api/tareas/ - Listar mis tareas (HU12: Historial)
    - GET /api/tareas/{id}/ - Ver detalle de una tarea
    - POST /api/tareas/ - Registrar nueva tarea (HU04)
    - PUT /api/tareas/{id}/ - Editar tarea (HU10)
    - DELETE /api/tareas/{id}/ - Eliminar tarea (HU10)
    - GET /api/tareas/estadisticas/ - Ver estadísticas personales (HU09)
    """
    serializer_class = TareaRegistradaSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Cada usuario solo ve sus propias tareas.
        Los administradores ven todas.
        """
        if self.request.user.is_staff:
            return TareaRegistrada.objects.all()
        return TareaRegistrada.objects.filter(usuario=self.request.user)
    
    def get_serializer_class(self):
        """
        Usar serializer específico para creación.
        """
        if self.action == 'create':
            return TareaRegistradaCreateSerializer
        return TareaRegistradaSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Registrar una nueva tarea ecológica (HU04).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        tarea = serializer.save()
        
        # Retornar con el serializer completo
        output_serializer = TareaRegistradaSerializer(tarea)
        
        return Response({
            'message': 'Tarea registrada exitosamente',
            'tarea': output_serializer.data,
            'puntos_ganados': tarea.puntos_ganados,
            'co2_evitado': float(tarea.co2_evitado)
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='estadisticas')
    def estadisticas(self, request):
        """
        Obtener estadísticas del usuario (HU09).
        GET /api/tareas/estadisticas/
        """
        usuario = request.user
        tareas = self.get_queryset()
        
        # Calcular estadísticas
        total_tareas = tareas.count()
        total_co2 = tareas.aggregate(Sum('co2_evitado'))['co2_evitado__sum'] or 0
        total_puntos = tareas.aggregate(Sum('puntos_ganados'))['puntos_ganados__sum'] or 0
        
        # Tareas por categoría
        from django.db.models import Count
        por_categoria = tareas.values(
            'tipo_tarea__categoria'
        ).annotate(
            cantidad=Count('id')
        ).order_by('-cantidad')
        
        return Response({
            'usuario': {
                'username': usuario.username,
                'nivel': usuario.nivel,
                'puntos_totales': usuario.puntos_totales
            },
            'estadisticas': {
                'total_tareas': total_tareas,
                'total_co2_evitado': float(total_co2),
                'total_puntos_ganados': total_puntos,
                'tareas_por_categoria': list(por_categoria)
            }
        })