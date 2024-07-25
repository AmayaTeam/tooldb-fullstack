import os

from django.core.management import BaseCommand
import json

from api.models.unit_system_models import (
    ResourceString,
    Unit,
    UnitSystem,
    Measure,
    MeasureUnit,
    UnitSystemMeasureUnit,
    ConversionFactor
)


class Command(BaseCommand):
    help = "add_unit_system_data"

    @staticmethod
    def add_resource_string(resource_string_data):
        resource_stringg = []
        for resource_string_element in resource_string_data:
            id = resource_string_element['id']
            en = resource_string_element['en']
            ru = resource_string_element['ru']
            # es = resource_string_element['es']
            resource_string = ResourceString(
                id=id,
                en=en,
                ru=ru,
                es=None
            )
            resource_stringg.append(resource_string)
        return resource_stringg

    @staticmethod
    def add_unit(unit_data):
        units = []
        for unit_element in unit_data:
            id = unit_element["id"]
            name = ResourceString.objects.filter(id=unit_element["name_id"]).first()
            html_name = ResourceString.objects.filter(id=unit_element["html_name_id"]).first()
            id_unisum = unit_element["id_unisum"]
            unit = Unit(
                id=id,
                name=name,
                html_name=html_name,
                id_unisum=id_unisum
            )
            units.append(unit)
        return units

    @staticmethod
    def add_unit_system(unit_system_data):
        unit_systems = []
        for unit_system_element in unit_system_data:
            id = unit_system_element["id"]
            name = ResourceString.objects.filter(id=unit_system_element["name_id"]).first()
            unit_system = UnitSystem(
                id=id,
                name=name,
            )
            unit_systems.append(unit_system)
        return unit_systems

    @staticmethod
    def add_measure(measure_data):
        measures = []
        for measure_element in measure_data:
            id = measure_element["id"]
            name = ResourceString.objects.filter(id=measure_element["name_id"]).first()
            id_unisum = measure_element["id_unisum"]
            if measure_element["default_unit"] is not None:
                default_unit = Unit.objects.filter(id=measure_element["default_unit"]).first()
            else:
                default_unit = None
            measure = Measure(
                id=id,
                name=name,
                id_unisum=id_unisum,
                default_unit=default_unit
            )
            measures.append(measure)
        return measures

    @staticmethod
    def add_measure_unit(measure_unit_data):
        measures_units = []
        for measure_unit_element in measure_unit_data:
            id = measure_unit_element["id"]
            measure = Measure.objects.filter(id=measure_unit_element["measure_id"]).first()
            unit = Unit.objects.filter(id=measure_unit_element["unit_id"]).first()
            measure_unit = MeasureUnit(
                id=id,
                measure=measure,
                unit=unit
            )
            measures_units.append(measure_unit)
        return measures_units

    @staticmethod
    def add_unit_system_measure_unit(unit_system_measure_unit_data):
        unit_system_measure_units = []
        for unit_system_measure_unit_element in unit_system_measure_unit_data:
            id = unit_system_measure_unit_element["id"]
            measure_unit = MeasureUnit.objects.filter(id=unit_system_measure_unit_element["measure_unit_id"]).first()
            unit_system = UnitSystem.objects.filter(id=unit_system_measure_unit_element["unit_system_id"]).first()
            unit_system_measure_unit = UnitSystemMeasureUnit(
                id=id,
                measure_unit=measure_unit,
                unit_system=unit_system
            )
            unit_system_measure_units.append(unit_system_measure_unit)
        return unit_system_measure_units

    @staticmethod
    def add_conversion_factor(conversion_factor_data):
        conversion_factors = []
        for conversion_factor_element in conversion_factor_data:
            from_unit = Unit.objects.filter(name__en=conversion_factor_element["from_unit"]).first()
            to_unit = Unit.objects.filter(name__en=conversion_factor_element["to_unit"]).first()
            factor_1 = conversion_factor_element["factor_1"]
            factor_2 = conversion_factor_element["factor_2"]
            conversion_factor = ConversionFactor(
                from_unit=from_unit,
                to_unit=to_unit,
                factor_1=factor_1,
                factor_2=factor_2
            )
            conversion_factors.append(conversion_factor)
        return conversion_factors

    def handle(self, *args, **kwargs):
        resource_string_filepath = "api/management/data/UnitSystem/resource_string.json"
        unit_file_path = "api/management/data/UnitSystem/unit.json"
        unit_system_file_path = "api/management/data/UnitSystem/unit_system.json"
        measure_file_path = "api/management/data/UnitSystem/measure.json"
        measure_unit_file_path = "api/management/data/UnitSystem/measure_unit.json"
        unit_system_measure_unit_file_path = "api/management/data/UnitSystem/unit_system_measure_unit.json"
        conversion_factor_file_path = "api/management/data/UnitSystem/conversion_factor.json"

        with open(
                resource_string_filepath, "r", encoding="utf-8"
        ) as resource_string_file:
            resource_string_data = json.load(resource_string_file)

        with open(
                measure_file_path, "r", encoding="utf-8"
        ) as measure_file:
            measure_data = json.load(measure_file)

        with open(
                unit_file_path, "r", encoding="utf-8"
        ) as unit_file:
            unit_data = json.load(unit_file)

        with open(
                unit_system_file_path, "r", encoding="utf-8"
        ) as unit_system_file:
            unit_system_data = json.load(unit_system_file)

        with open(
                measure_unit_file_path, "r", encoding="utf-8"
        ) as measure_unit_file:
            measure_unit_data = json.load(measure_unit_file)

        with open(
                unit_system_measure_unit_file_path, "r", encoding="utf-8"
        ) as unit_system_measure_unit_file:
            unit_system_measure_unit_data = json.load(unit_system_measure_unit_file)

        with open(
            conversion_factor_file_path, "r", encoding="utf-8"
        ) as conversion_factor_file:
            conversion_factor_data = json.load(conversion_factor_file)

        ResourceString.objects.bulk_create(self.add_resource_string(resource_string_data))
        print("ResourceString created")
        Measure.objects.bulk_create(self.add_measure(measure_data))
        print("Measure created")
        Unit.objects.bulk_create(self.add_unit(unit_data))
        print("Unit created")
        UnitSystem.objects.bulk_create(self.add_unit_system(unit_system_data))
        print("UnitSystem created")
        MeasureUnit.objects.bulk_create(self.add_measure_unit(measure_unit_data))
        print("MeasureUnit created")
        UnitSystemMeasureUnit.objects.bulk_create(self.add_unit_system_measure_unit(unit_system_measure_unit_data))
        print("UnitSystemMeasureUnit created")
        ConversionFactor.objects.bulk_create(self.add_conversion_factor(conversion_factor_data))
        print("ConversionFactor created")

