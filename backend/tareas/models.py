# tareas/models.py

from django.db import models
from usuarios.models import Usuario

class TipoTarea(models.Model):
    """
    Catálogo de tipos de tareas ecológicas disponibles.
    Según HU04 y HU15: Registro de tareas ecológicas.
    """
    
    CATEGORIA_RECICLAJE = 'reciclaje'
    CATEGORIA_TRANSPORTE = 'transporte'
    CATEGORIA_ENERGIA = 'energia'
    CATEGORIA_AGUA = 'agua'
    CATEGORIA_ALIMENTACION = 'alimentacion'
    CATEGORIA_OTRO = 'otro'
    
    CATEGORIAS = [
        (CATEGORIA_RECICLAJE, 'Reciclaje'),
        (CATEGORIA_TRANSPORTE, 'Transporte Sustentable'),
        (CATEGORIA_ENERGIA, 'Ahorro de Energía'),
        (CATEGORIA_AGUA, 'Ahorro de Agua'),
        (CATEGORIA_ALIMENTACION, 'Alimentación Sustentable'),
        (CATEGORIA_OTRO, 'Otro'),
    ]
    
    nombre = models.CharField(
        max_length=100,
        help_text="Nombre de la tarea ecológica"
    )
    
    descripcion = models.TextField(
        help_text="Descripción detallada de la tarea"
    )
    
    categoria = models.CharField(
        max_length=20,
        choices=CATEGORIAS,
        default=CATEGORIA_OTRO,
        help_text="Categoría a la que pertenece la tarea"
    )
    
    # HU05: Cálculo de CO₂ evitado
    co2_evitado_por_accion = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.00,
        help_text="Kg de CO₂ evitado por realizar esta acción (valor base)"
    )
    
    puntos_otorgados = models.IntegerField(
        default=10,
        help_text="Puntos que se otorgan al completar esta tarea"
    )
    
    icono = models.CharField(
        max_length=50,
        blank=True,
        help_text="Nombre del icono para mostrar en la interfaz"
    )
    
    activa = models.BooleanField(
        default=True,
        help_text="Indica si la tarea está disponible para los usuarios"
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Tipo de Tarea"
        verbose_name_plural = "Tipos de Tareas"
        ordering = ['categoria', 'nombre']
    
    def __str__(self):
        return f"{self.nombre} ({self.get_categoria_display()})"


class TareaRegistrada(models.Model):
    """
    Registro de tareas ecológicas completadas por los usuarios.
    Según HU04, HU10, HU12: Registro, edición y seguimiento de tareas.
    """
    
    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='tareas_registradas',
        help_text="Usuario que realizó la tarea"
    )
    
    tipo_tarea = models.ForeignKey(
        TipoTarea,
        on_delete=models.PROTECT,
        related_name='registros',
        help_text="Tipo de tarea realizada"
    )
    
    fecha_realizacion = models.DateField(
        help_text="Fecha en que se realizó la tarea"
    )
    
    # Campos calculados al momento del registro
    co2_evitado = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        help_text="Kg de CO₂ evitado en esta acción específica"
    )
    
    puntos_ganados = models.IntegerField(
        help_text="Puntos ganados por esta acción"
    )
    
    # Campos opcionales para detalles
    notas = models.TextField(
        blank=True,
        help_text="Notas adicionales sobre la tarea realizada"
    )
    
    foto = models.ImageField(
        upload_to='tareas/',
        null=True,
        blank=True,
        help_text="Foto opcional de la tarea realizada"
    )
    
    # Control de validación (opcional, para administradores)
    validada = models.BooleanField(
        default=True,
        help_text="Indica si la tarea ha sido validada"
    )
    
    fecha_registro = models.DateTimeField(
        auto_now_add=True,
        help_text="Fecha y hora en que se registró la tarea"
    )
    
    ultima_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Tarea Registrada"
        verbose_name_plural = "Tareas Registradas"
        ordering = ['-fecha_realizacion', '-fecha_registro']
    
    def __str__(self):
        return f"{self.usuario.username} - {self.tipo_tarea.nombre} ({self.fecha_realizacion})"
    
    def save(self, *args, **kwargs):
        """
        Sobrescribir el método save para calcular automáticamente
        CO₂ y puntos si no se proporcionan.
        """
        # Si es un nuevo registro y no tiene valores calculados
        if not self.pk:
            if not self.co2_evitado:
                self.co2_evitado = self.tipo_tarea.co2_evitado_por_accion
            
            if not self.puntos_ganados:
                self.puntos_ganados = self.tipo_tarea.puntos_otorgados
            
            # Actualizar estadísticas del usuario
            self.usuario.puntos_totales += self.puntos_ganados
            self.usuario.co2_total_evitado += float(self.co2_evitado)
            self.usuario.calcular_nivel()
            self.usuario.save()
        
        super().save(*args, **kwargs)