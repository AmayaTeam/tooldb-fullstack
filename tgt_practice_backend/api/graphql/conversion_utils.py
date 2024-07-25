from api.models import UnitSystemMeasureUnit, ConversionFactor

class ConversionUtils:
    @staticmethod
    def get_unit_for_measure_and_unit_system(measure, unit_system):
        try:
            unit_system_measure_unit = UnitSystemMeasureUnit.objects.get(
                measure_unit__measure=measure,
                unit_system=unit_system
            )
            return unit_system_measure_unit.measure_unit.unit
        except UnitSystemMeasureUnit.DoesNotExist:
            return measure.default_unit

    @staticmethod
    def get_conversion_factor(from_unit, to_unit):
        try:
            return ConversionFactor.objects.get(from_unit=from_unit, to_unit=to_unit)
        except ConversionFactor.DoesNotExist:
            try:
                conversion_factor = ConversionFactor.objects.get(from_unit=to_unit, to_unit=from_unit)
                return ConversionFactor(from_unit=from_unit, to_unit=to_unit, factor_1=conversion_factor.factor_2,
                                        factor_2=conversion_factor.factor_1)
            except ConversionFactor.DoesNotExist:
                return None

    @staticmethod
    def convert_value(value, factor_1, factor_2):
        return (factor_1 / factor_2) * value
