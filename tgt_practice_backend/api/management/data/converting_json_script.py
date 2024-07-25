import json


def convert_data(data):
    """Конвертирует список объектов в формат parameter_large.json."""
    parameters = []
    for item in data:
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "Length",
                "parameter_value": item["dbtlength"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "Weight",
                "parameter_value": item["dbtweight"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "OD",
                "parameter_value": item["dbtmax_od_"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "OD Collapsed",
                "parameter_value": item["dbtmax_od_collapsed_"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "OD Opened",
                "parameter_value": item["dbtmax_od_opened_"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "h Shift",
                "parameter_value": item["dbtimage_h_shift"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "h Scale",
                "parameter_value": item["dbtimage_h_scale"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "Image h_y1",
                "parameter_value": item["dbtimage_h_y1"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "Image h_y2",
                "parameter_value": item["dbtimage_h_y2"],
            }
        )
        parameters.append(
            {
                "unit": None,
                "toolmodule": item["id"],
                "parameter_type": "COMP STR",
                "parameter_value": item["dbtcomp_str"],
            }
        )
    return parameters


# Загрузите данные из JSON-файла или из переменной
with open("Base/tool_module_old.json", "r") as f:
    data = json.load(f)

# Конвертируйте данные в формат parameter_large.json
parameters = convert_data(data)

# Сохраните результаты в новый файл
with open("Base/parameter.json", "w") as f:
    json.dump(parameters, f, indent=4)

print("Данные успешно конвертированы в parameter_large.json!")

# import json
#
#
# def remove_empty_lines(file_path):
#     """Удаляет пустые строки из JSON-файла."""
#     with open(file_path, "r") as f:
#         data = json.load(f)
#
#     # Удаляем пустые строки из "dbcomment_"
#     for item in data:
#         item["dbcomment_"] = item["dbcomment_"]
#
#     # Сохраняем изменения в файл
#     with open(file_path, "w") as f:
#         json.dump(data, f, indent=4)
#
#
# # Замените "data.json" на путь к вашему файлу
# remove_empty_lines("tool_module.json")
# with open("Base/sensor_large.json", "r") as f:
#     data = json.load(f)
#     for i in data:
#         i["unit"] = "mm"
# with open("Base/sensor_large.json", "w") as f2:
#     json.dump(data, f2, indent=4)
