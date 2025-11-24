# backend/usuarios/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer básico para mostrar información de usuarios.
    Se usa en listados y consultas.
    """
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'rol', 'fecha_nacimiento', 'telefono', 'avatar',
            'puntos_totales', 'nivel', 'co2_total_evitado',
            'fecha_creacion', 'activo'
        ]
        read_only_fields = ['id', 'puntos_totales', 'nivel', 'co2_total_evitado', 'fecha_creacion']


class UsuarioRegistroSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios (HU01).
    Incluye validación de contraseña y creación segura.
    """
    password = serializers.CharField(
        write_only=True,  # No se muestra en las respuestas
        required=True,
        validators=[validate_password],  # Validación de Django
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label="Confirmar contraseña"
    )
    
    class Meta:
        model = Usuario
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'fecha_nacimiento', 'telefono'
        ]
    
    def validate(self, attrs):
        """
        Validar que las contraseñas coincidan.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({
                "password": "Las contraseñas no coinciden."
            })
        return attrs
    
    def create(self, validated_data):
        """
        Crear usuario con contraseña encriptada.
        """
        # Eliminar password2 ya que no es parte del modelo
        validated_data.pop('password2')
        
        # Crear usuario con contraseña encriptada
        usuario = Usuario.objects.create_user(**validated_data)
        return usuario


class UsuarioPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para ver y editar el perfil completo del usuario autenticado.
    """
    tareas_completadas = serializers.SerializerMethodField()
    logros_obtenidos_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'rol', 'fecha_nacimiento', 'telefono', 'avatar',
            'puntos_totales', 'nivel', 'co2_total_evitado',
            'tareas_completadas', 'logros_obtenidos_count',
            'fecha_creacion', 'activo'
        ]
        read_only_fields = [
            'id', 'username', 'rol', 'puntos_totales', 'nivel',
            'co2_total_evitado', 'fecha_creacion'
        ]
    
    def get_tareas_completadas(self, obj):
        """
        Retorna el número de tareas completadas por el usuario.
        """
        return obj.tareas_registradas.filter(validada=True).count()
    
    def get_logros_obtenidos_count(self, obj):
        """
        Retorna el número de logros obtenidos.
        """
        return obj.logros_obtenidos.count()