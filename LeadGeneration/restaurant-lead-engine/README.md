# Restaurant Lead Engine

Internal lead-generation tool for Northova Digital.

## Current Module

Module 1: Restaurant Extraction

## Features

* Extract restaurants by location
* Collect business name, category, website, phone, and address
* Generate Google Maps verification links
* Remove duplicate records
* Filter major national chains
* Exclude irrelevant categories
* Rank leads using a data-quality score
* Export qualification-friendly CSV files

## Setup

Create and activate the virtual environment:

```
python -m venv .venv
source .venv/Scripts/activate
```

Install dependencies:

```
python -m pip install -r requirements.txt
```

## Usage

Run the Houston restaurant extractor:

```
python main.py --location "Houston, Texas, USA" --limit 200 --output output/houston_restaurants_priority.csv
```

## Workflow

```
OpenStreetMap
    ↓
Restaurant Extraction
    ↓
Data Cleaning
    ↓
Duplicate Removal
    ↓
National Chain Filtering
    ↓
Priority Lead CSV
    ↓
Manual Qualification
    ↓
Cold Outreach
```

Generated CSV and Excel lead files are excluded from Git because they contain internal prospecting data.
