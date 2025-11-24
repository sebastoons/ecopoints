# backend/gamificacion/serializers.py

from rest_framework import serializers
from .models import Logro, LogroUsuario, Grupo, MiembroGrupo
from usuarios.serializers import UsuarioSerializer

class LogroSerializer(serializers.ModelSerializer):
    """
    Serializer para logros/insignias (HU08).
    """
    class Meta:
        model = Logro
        fields = [
            'id', 'nombre', 'descripcion', 'tipo', 'icono',
            'puntos_requeridos', 'tareas_requeridas', 'co2_requerido',
            'activo'
        ]
        read_only_fields = ['id']


class LogroUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para logros obtenidos por usuarios.
    """
    logro_info = LogroSerializer(source='logro', read_only=True)
    usuario_info = UsuarioSerializer(source='usuario', read_only=True)
    
    class Meta:
        model = LogroUsuario
        fields = ['id', 'usuario', 'usuario_info', 'logro', 'logro_info', 'fecha_obtencion']
        read_only_fields = ['id', 'fecha_obtencion', 'usuario_info', 'logro_info']


class GrupoSerializer(serializers.ModelSerializer):
    """
    Serializer para grupos/comunidades (HU11).
    """
    creador_info = UsuarioSerializer(source='creador', read_only=True)
    total_miembros = serializers.SerializerMethodField()
    puntos_totales_grupo = serializers.SerializerMethodField()
    
    class Meta:
        model = Grupo
        fields = [
            'id', 'nombre', 'descripcion', 'creador', 'creador_info',
            'imagen', 'publico', 'activo', 'fecha_creacion',
            'total_miembros', 'puntos_totales_grupo'
        ]
        read_only_fields = ['id', 'creador', 'fecha_creacion', 'creador_info']
    
    def get_total_miembros(self, obj):
        """
        Retorna el número total de miembros del grupo.
        """
        return obj.miembros.count()
    
    def get_puntos_totales_grupo(self, obj):
        """
        Suma los puntos de todos los miembros del grupo.
        """
        return sum([m.puntos_totales for m in obj.miembros.all()])


class MiembroGrupoSerializer(serializers.ModelSerializer):
    """
    Serializer para la membresía de usuarios en grupos.
    """
    usuario_info = UsuarioSerializer(source='usuario', read_only=True)
    grupo_info = GrupoSerializer(source='grupo', read_only=True)
    
    class Meta:
        model = MiembroGrupo
        fields = ['id', 'usuario', 'usuario_info', 'grupo', 'grupo_info', 'fecha_union', 'es_admin']
        read_only_fields = ['id', 'fecha_union', 'usuario_info', 'grupo_info']