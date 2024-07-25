import uuid
from django.db import models

from .unit_system_models import Unit
from .tool_models import ToolModule


class ToolSensorType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField(null=True, blank=True)
    sensor = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("name",)


# нужно добавить FK unit_id. пока не могу связать, Unit без тестовых данных
class ToolInstalledSensor(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    r_toolmodule = models.ForeignKey(ToolModule, on_delete=models.CASCADE)
    r_toolsensortype = models.ForeignKey(ToolSensorType, on_delete=models.CASCADE)
    record_point = models.FloatField(null=True, blank=True)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return str(self.record_point)
