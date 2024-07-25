import json
import uuid
import random


def duplicate_and_save(input_file, output_file):
    """
    Дублирует объекты в файле, создает параметры и сенсоры для каждого дубликата
    и сохраняет все в отдельные файлы.
    """

    with open(input_file, "r") as f:
        data = json.load(f)

    duplicated_data = []
    parameters_data = []
    sensors_data = []
    parameter_types = [
        "Length", "Weight", "OD", "OD Collapsed", "OD Opened",
        "h Shift", "h Scale", "Image h_y1", "Image h_y2", "COMP STR"
    ]

    for obj in data:
        new_obj = obj.copy()
        duplicated_data.append(new_obj)
        # Дублируем объект 7 раз
        for _ in range(7):
            new_obj = obj.copy()
            new_obj["id"] = str(uuid.uuid4())
            duplicated_data.append(new_obj)

            # Создаем параметры для дубликата
            for parameter_type in parameter_types:
                parameters_data.append({
                    "unit": None,
                    "toolmodule": new_obj["id"],
                    "parameter_type": parameter_type,
                    "parameter_value": random.randint(0, 1000)
                })

            # Создаем сенсор для дубликата
            sensors_data.append({
                "id": str(uuid.uuid4()),  # Генерируем ID для сенсора
                "r_toolmodule_id": new_obj["id"],
                "r_toolsensortype_id": "4052b4ad-8aa8-4e07-a5db-cec400da14d6",  # Заменяем на ваше значение
                "record_point_": random.randint(0, 1000),  # Случайное значение
                "unit": "mm"
            })

    with open(output_file, "w") as f:
        json.dump(duplicated_data, f, indent=4)

    with open("Large/parameter_large.json", "a") as f:
        json.dump(parameters_data, f, indent=4)

    with open("Large/sensor_large.json", "a") as f:
        json.dump(sensors_data, f, indent=4)


# Замените "input.json" на имя вашего входного файла
# и "output.json" на имя желаемого выходного файла
duplicate_and_save("Base/tool_module.json", "Large/tool_module_large.json")
