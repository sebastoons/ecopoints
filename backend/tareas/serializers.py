# backend/tareas/serializers.py

from rest_framework import serializers
from .models import TipoTarea, TareaRegistrada
from usuarios.serializers import UsuarioSerializer

class TipoTareaSerializer(serializers.ModelSerializer):
    """
    Serializer para el catálogo de tipos de tareas ecológicas (HU15).
    """
    class Meta:
        model = TipoTarea
        fields = [
            'id', 'nombre', 'descripcion', 'categoria',
            'co2_evitado_por_accion', 'puntos_otorgados',
            'icono', 'activa'
        ]
        read_only_fields = ['id']


class TareaRegistradaSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de tareas ecológicas (HU04).
    """
    usuario_info = UsuarioSerializer(source='usuario', read_only=True)
    tipo_tarea_info = TipoTareaSerializer(source='tipo_tarea', read_only=True)
    
    class Meta:
        model = TareaRegistrada
        fields = [
            'id', 'usuario', 'usuario_info', 'tipo_tarea', 'tipo_tarea_info',
            'fecha_realizacion', 'co2_evitado', 'puntos_ganados',
            'notas', 'foto', 'validada', 'fecha_registro'
        ]
        read_only_fields = ['id', 'co2_evitado', 'puntos_ganados', 'fecha_registro', 'usuario_info', 'tipo_tarea_info']
    
    def validate_fecha_realizacion(self, value):
        """
        Validar que la fecha de realización no sea futura.
        """
        from django.utils import timezone
        if value > timezone.now().date():
            raise serializers.ValidationError("La fecha de realización no puede ser futura.")
        return value


class TareaRegistradaCreateSerializer(serializers.ModelSerializer):
    """
    Serializer específico para crear tareas (simplificado).
    """
    class Meta:
        model = TareaRegistrada
        fields = ['tipo_tarea', 'fecha_realizacion', 'notas', 'foto']
    
    def create(self, validated_data):
        """
        Crear tarea y asignar el usuario autenticado.
        """
        # El usuario viene del contexto (request.user)
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)