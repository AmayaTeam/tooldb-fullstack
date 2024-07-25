import uuid
from django.db import models

from .unit_system_models import Unit, Measure


class ToolModuleGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("name",)


class ToolModuleType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    r_modules_group = models.ForeignKey(ToolModuleGroup, on_delete=models.CASCADE)
    name = models.TextField(null=True, blank=True)
    module_type = models.TextField(null=True, blank=True)
    hash_code = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ("name",)


class ToolModule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    r_module_type = models.ForeignKey(ToolModuleType, on_delete=models.CASCADE)
    sn = models.TextField(max_length=255, null=True, blank=True)
    dbdate = models.DateField(null=True, blank=True)
    dbversion = models.TextField(null=True, blank=True)
    dbsn = models.TextField(null=True, blank=True)
    dbcomment = models.TextField(null=True, blank=True)
    dbtname = models.TextField(null=True, blank=True)
    image = models.TextField(null=True, blank=True)
    status = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.sn

    class Meta:
        ordering = ("sn",)


class ParameterType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parameter_name = models.TextField(null=True, blank=True)
    default_measure = models.ForeignKey(Measure, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return self.parameter_name


class Parameter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, null=True, blank=True)
    toolmodule = models.ForeignKey(ToolModule, on_delete=models.CASCADE)
    parameter_type = models.ForeignKey(ParameterType, on_delete=models.CASCADE)
    parameter_value = models.FloatField(null=True, blank=True)

    def __str__(self):
        return str(self.parameter_type.parameter_name)
