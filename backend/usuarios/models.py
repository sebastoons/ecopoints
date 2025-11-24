# backend/usuarios/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado que extiende el usuario de Django.
    Según HU01-HU03: Registro, login y gestión de usuarios.
    """
    
    # Roles de usuario
    ROL_USUARIO = 'usuario'
    ROL_ADMIN = 'admin'
    
    ROLES = [
        (ROL_USUARIO, 'Usuario'),
        (ROL_ADMIN, 'Administrador'),
    ]
    
    # Campos adicionales
    rol = models.CharField(
        max_length=20,
        choices=ROLES,
        default=ROL_USUARIO,
        help_text="Rol del usuario en el sistema"
    )
    
    fecha_nacimiento = models.DateField(
        null=True,
        blank=True,
        help_text="Fecha de nacimiento del usuario"
    )
    
    telefono = models.CharField(
        max_length=15,
        blank=True,
        help_text="Número de teléfono del usuario"
    )
    
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        help_text="Foto de perfil del usuario"
    )
    
    # Gamificación (HU06: Visualización de puntos y nivel)
    puntos_totales = models.IntegerField(
        default=0,
        help_text="Puntos acumulados por el usuario"
    )
    
    nivel = models.IntegerField(
        default=1,
        help_text="Nivel actual del usuario (calculado según puntos)"
    )
    
    co2_total_evitado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Total de kg de CO₂ evitados por el usuario"
    )
    
    # Metadatos
    fecha_creacion = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha de registro del usuario"
    )
    
    ultima_actualizacion = models.DateTimeField(
        auto_now=True,
        help_text="Última actualización del perfil"
    )
    
    activo = models.BooleanField(
        default=True,
        help_text="Indica si el usuario está activo en el sistema"
    )
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.username} - {self.get_rol_display()}"
    
    def calcular_nivel(self):
        """
        Calcula el nivel del usuario basado en sus puntos.
        Cada 100 puntos = 1 nivel.
        """
        self.nivel = (self.puntos_totales // 100) + 1
        self.save()
        return self.nivel
    
    def agregar_puntos(self, puntos):
        """
        Agrega puntos al usuario y recalcula su nivel.
        """
        self.puntos_totales += puntos
        self.calcular_nivel()
        return self.puntos_totales