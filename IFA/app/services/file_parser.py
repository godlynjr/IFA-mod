import xml.etree.ElementTree as ET
import pandas as pd


def parse_element(element):
    """Convertit un élément XML en dictionnaire, y compris ses enfants."""
    data = element.attrib.copy()  # Récupérer les attributs de l'élément

    # Ajouter les enfants imbriqués (sous-éléments)
    for child in element:
        if child.tag not in data:
            data[child.tag] = []
        data[child.tag].append(parse_element(child))  # Récursivité pour explorer toute la hiérarchie

    return data


def extract_data(xml_file):
    """Charge le fichier XML et extrait toutes les données pertinentes."""
    tree = ET.parse(xml_file)
    root = tree.getroot()

    # Extraire les enregistrements <Record>
    records = [parse_element(record) for record in root.iter('Record')]

    # Création des DataFrames
    df_records = pd.DataFrame(records)  # Convertir les records en DataFrame

    return df_records  # Conversion en DataFrame


def parse_ecg_file(file_path):
    """Parse le fichier ECG CSV et extrait les données brutes."""
    with open(file_path, "r", encoding="utf-8") as file:
        raw_lines = file.readlines()

    # Trouver l'index où commencent les données ECG brutes
    ecg_start_index = next(i for i, line in enumerate(raw_lines) if line.strip().isdigit())

    # Extraire uniquement les valeurs ECG (converties en float)
    ecg_values = [float(line.strip()) for line in raw_lines[ecg_start_index:]]

    return ecg_values