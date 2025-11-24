# gamificacion/models.py

from django.db import models
from usuarios.models import Usuario

class Logro(models.Model):
    """
    Insignias y medallas que pueden obtener los usuarios.
    Según HU08: Insignias y medallas.
    """
    
    TIPO_BRONCE = 'bronce'
    TIPO_PLATA = 'plata'
    TIPO_ORO = 'oro'
    TIPO_PLATINO = 'platino'
    
    TIPOS = [
        (TIPO_BRONCE, 'Bronce'),
        (TIPO_PLATA, 'Plata'),
        (TIPO_ORO, 'Oro'),
        (TIPO_PLATINO, 'Platino'),
    ]
    
    nombre = models.CharField(
        max_length=100,
        help_text="Nombre del logro/insignia"
    )
    
    descripcion = models.TextField(
        help_text="Descripción de cómo obtener este logro"
    )
    
    tipo = models.CharField(
        max_length=20,
        choices=TIPOS,
        default=TIPO_BRONCE,
        help_text="Tipo/nivel del logro"
    )
    
    icono = models.ImageField(
        upload_to='logros/',
        null=True,
        blank=True,
        help_text="Imagen del logro/insignia"
    )
    
    # Condiciones para obtener el logro
    puntos_requeridos = models.IntegerField(
        default=0,
        help_text="Puntos totales necesarios para obtener este logro"
    )
    
    tareas_requeridas = models.IntegerField(
        default=0,
        help_text="Cantidad de tareas completadas necesarias"
    )
    
    co2_requerido = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Kg de CO₂ evitado necesarios"
    )
    
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Logro"
        verbose_name_plural = "Logros"
        ordering = ['tipo', '-puntos_requeridos']
    
    def __str__(self):
        return f"{self.nombre} ({self.get_tipo_display()})"


class LogroUsuario(models.Model):
    """
    Relación entre usuarios y logros obtenidos.
    """
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='logros_obtenidos'
    )
    
    logro = models.ForeignKey(
        Logro,
        on_delete=models.CASCADE,
        related_name='usuarios_que_lo_obtuvieron'
    )
    
    fecha_obtencion = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora en que se obtuvo el logro"
    )
    
    class Meta:
        verbose_name = "Logro de Usuario"
        verbose_name_plural = "Logros de Usuarios"
        unique_together = ['usuario', 'logro']
        ordering = ['-fecha_obtencion']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.logro.nombre}"


class Grupo(models.Model):
    """
    Grupos/comunidades ecológicas.
    Según HU11: Creación y unión a grupos.
    """
    nombre = models.CharField(
        max_length=100,
        unique=True,
        help_text="Nombre del grupo"
    )
    
    descripcion = models.TextField(
        help_text="Descripción del grupo y sus objetivos"
    )
    
    creador = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        null=True,
        related_name='grupos_creados',
        help_text="Usuario que creó el grupo"
    )
    
    miembros = models.ManyToManyField(
        Usuario,
        through='MiembroGrupo',
        related_name='grupos',
        help_text="Miembros del grupo"
    )
    
    imagen = models.ImageField(
        upload_to='grupos/',
        null=True,
        blank=True
    )
    
    publico = models.BooleanField(
        default=True,
        help_text="Si es público, cualquiera puede unirse"
    )
    
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return self.nombre


class MiembroGrupo(models.Model):
    """
    Tabla intermedia para la relación Usuario-Grupo.
    """
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    grupo = models.ForeignKey(Grupo, on_delete=models.CASCADE)
    fecha_union = models.DateTimeField(auto_now_add=True)
    
    es_admin = models.BooleanField(
        default=False,
        help_text="Indica si el miembro es administrador del grupo"
    )
    
    class Meta:
        verbose_name = "Miembro de Grupo"
        verbose_name_plural = "Miembros de Grupos"
        unique_together = ['usuario', 'grupo']
        ordering = ['-fecha_union']
    
    def __str__(self):
        return f"{self.usuario.username} en {self.grupo.nombre}"