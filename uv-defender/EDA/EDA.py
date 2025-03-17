#!/usr/bin/env python
# coding: utf-8

# # 1. Importing Library and Accessing data 
# TA26-Note: Change the relevant file_path

# In[1]:


import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import math

# Visualization
from dash import dcc, html
import dash
import plotly.express as px
from dash.dependencies import Input, Output, State

import json
import requests


## Sunprotection data
file_path = 'Sun-protection-behaviours-Nov-2023-to-Feb-2024/SPBDC01.xlsx'
sheets_dict = pd.read_excel(file_path, sheet_name=None)
# Print out the sheet names
print(sheets_dict.keys())
# Read the tabs
df_1b = sheets_dict["Table 1b"]
df_2b = sheets_dict["Table 2b"]
df_3b = sheets_dict["Table 3b"]
df_4b = sheets_dict["Table 4b"]
df_5b = sheets_dict["Table 5b"]

## UV DATA MELB
uv_path = 'MEL daily UV Index and UV Dose 2005-2025.xlsx'
sheets = pd.read_excel(uv_path, sheet_name=None)
# Print out the sheet names
print(sheets.keys())
# Read the tabs
uv_index = sheets["UV Index"]
uv_dose = sheets["UV Dose"]

## UV DATA SYD
uv_path1 = 'SYD daily UV Index and UV Dose 2005-2025.xlsx'
sheets1 = pd.read_excel(uv_path1, sheet_name=None)
# Print out the sheet names
print(sheets.keys())
# Read the tabs
uv_index1 = sheets1["UV Index"]
uv_dose1 = sheets1["UV Dose"]


# # 2. Data Wrangling
# 
# **For sun protecting behavior and UV data**
# 
# - Sun Protecting Behavior: Data from 1/11/2023 - 29/02/2024
# - UV Index 1/1/2005 - 28/02/2025
# 
# Output: 
# 1. df_xb_clean (where x represent number of table, from 1-5)
# 2. df_uv_index & df_uv_dose (all range, include NaN)
# 3. df_uv_index_filtered & df_uv_dose_filtered for MELBOUNRE (from 1/11/2023 - 29/02/2024)
# 4. df_uv_filtered for MELBOURNE AND SYDNEY (from 1/11/2023 - 29/02/2024)
# 
# Reference: 
# 1. https://www.abs.gov.au/statistics/health/health-conditions-and-risks/sun-protection-behaviours/latest-release#data-downloads
# 2. https://www.arpansa.gov.au/our-services/monitoring/ultraviolet-radiation-monitoring/ultraviolet-radiation-index

# ## 2.1 Sun protecting behavior
# Output: df_xb_clean (where x represent number of table, from 1-5)

# In[2]:


def clean_survey_data(df):
    """
    Cleans the survey data by:
    1. Removing metadata rows at the top.
    2. Merging multi-level column headers.
    3. Dropping unnecessary rows and resetting the index.
    4. Renaming the first column to 'Characteristic'.
    5. Removing any footer rows if present.
    6. Removing rows and columns that contain only NaN values.
    7. Remove the last row
    """

    # Step 1: Remove the first 3 rows (metadata, title rows)
    df_clean = df.iloc[3:].reset_index(drop=True)

    # Step 2: Merge the first two rows to create proper column names
    df_clean.columns = [
        f"{df_clean.iloc[0, i]}_{df_clean.iloc[1, i]}" 
        if pd.notna(df_clean.iloc[0, i]) 
        else df_clean.iloc[1, i] 
        for i in range(df_clean.shape[1])
    ]

    # Step 3: Remove the first two rows that were used as new headers
    df_clean = df_clean.iloc[2:].reset_index(drop=True)

    # Step 4: Rename the first column to "Characteristic"
    df_clean.rename(columns={df_clean.columns[0]: "Characteristic"}, inplace=True)

    # Step 5: Remove the first row after merging headers (contains "Proportion of persons")
    df_clean = df_clean.iloc[1:].reset_index(drop=True)

    # Step 6: Remove both rows and columns that contain only NaN values
    df_clean = df_clean.dropna(axis=0, how='all').dropna(axis=1, how='all')

    # Step 7: Remove the first last row
    df_clean = df_clean.iloc[:-1].reset_index(drop=True)

    return df_clean

df_1b_clean = clean_survey_data(df_1b)
df_2b_clean = clean_survey_data(df_2b)
df_3b_clean = clean_survey_data(df_3b)
df_4b_clean = clean_survey_data(df_4b)
df_5b_clean = clean_survey_data(df_5b)


# In[3]:


def extract_margin_of_error(df):
    """
    Automatically detects rows containing '95% Margin of error' and separates them,
    along with subsequent rows, from the main dataset.
    """
    # Identify rows that contain '95% Margin of error'
    margin_rows = df[df.apply(lambda row: row.astype(str).str.contains("95% Margin of error", case=False, na=False).any(), axis=1)]

    # If no margin of error is found, return the original dataset
    if margin_rows.empty:
        return df, None

    # Get the index of the margin row
    margin_index = margin_rows.index[0]

    # Create a DataFrame containing the Margin of Error and subsequent rows
    margin_of_error_df = df.iloc[margin_index:].reset_index(drop=True)
    
    # Remove the first row (the '95% Margin of error' header)
    margin_of_error_df = margin_of_error_df.iloc[1:].reset_index(drop=True)

    # Remove the margin row and all rows below from df_cleaned
    df_cleaned = df.iloc[:margin_index].reset_index(drop=True)

    return df_cleaned, margin_of_error_df

df_1b_clean, df_1b_margin = extract_margin_of_error(df_1b_clean)
df_2b_clean, df_2b_margin = extract_margin_of_error(df_2b_clean)
df_3b_clean, df_3b_margin = extract_margin_of_error(df_3b_clean)
df_4b_clean, df_4b_margin = extract_margin_of_error(df_4b_clean)
df_5b_clean, df_5b_margin = extract_margin_of_error(df_5b_clean)


# In[4]:


def group_survey_data(df):
    """
    Groups survey data by assigning each row to its respective section header.
    """

    df_clean = df.copy()
    df_clean["Group"] = None  # Add column "Group"
    current_group = None

    for index, row in df_clean.iterrows():
        # If the row only contains text (no numbers) => Is the group title
        if row.iloc[1:].isnull().all():
            current_group = row["Characteristic"]
        else:
            df_clean.at[index, "Group"] = current_group # Assign groups to data rows

    # Remove group header lines (since they don't have numeric data)
    df_clean = df_clean.dropna(subset=["Group"]).reset_index(drop=True)

    return df_clean

df_1b_clean = group_survey_data(df_1b_clean)
df_2b_clean = group_survey_data(df_2b_clean)
df_3b_clean = group_survey_data(df_3b_clean)
df_4b_clean = group_survey_data(df_4b_clean)
df_5b_clean = group_survey_data(df_5b_clean)


# ## 2.2 UV Data (2005-2025)
# Output: 
# 1. df_uv_index & df_uv_dose (all range, include NaN)
# 2. df_uv_index_filtered & df_uv_dose_filtered for MELBOURNE (from 1/11/2023 - 29/02/2024)
# 3. df_uv_filtered: MELBOURNE AND SYDNEY (from 1/11/2023 - 29/02/2024)

# In[5]:


uv_index


# In[6]:


def clean_uv_data(df):
    """
    Clean and transform UV dataset from wide format to long format, ensuring proper date format (DD-MM-YYYY).

    Returns:
        pd.DataFrame: Cleaned dataset with columns ["Date", "UV_Value"]
    """
    # Remove the first two header rows as they are not needed
    df = df.iloc[2:].reset_index(drop=True)

    # Set the second row as column names
    df.columns = df.iloc[0]
    df = df[1:].reset_index(drop=True)

    # Rename the first column to 'Day'
    df = df.rename(columns={df.columns[0]: "Day"})

    # Strip extra spaces and ensure day column is formatted correctly
    df["Day"] = df["Day"].astype(str).str.strip()

    # Convert 'Day' column to MM-DD format (remove year 1996)
    df["Day"] = pd.to_datetime(df["Day"], errors="coerce").dt.strftime("%d-%m")

    # Drop NaN values that might arise due to conversion errors
    df = df.dropna(subset=["Day"])

    # Reshape data from wide to long format
    df_melted = df.melt(id_vars=["Day"], var_name="Year", value_name="UV_Value")

    # Convert 'Year' to integer and drop NaN values
    df_melted["Year"] = pd.to_numeric(df_melted["Year"], errors="coerce").dropna().astype(int)

    # Create 'Date' column in DD-MM-YYYY format
    df_melted["Date"] = pd.to_datetime(df_melted["Day"] + "-" + df_melted["Year"].astype(str), format="%d-%m-%Y", errors="coerce")

    # Drop rows where 'Date' conversion failed
    df_cleaned = df_melted.dropna(subset=["Date"])

    # Keep only relevant columns
    df_cleaned = df_cleaned[["Date", "UV_Value"]].sort_values("Date").reset_index(drop=True)

    return df_cleaned

# Melbourne
df_uv_index = clean_uv_data(uv_index)
df_uv_dose = clean_uv_data(uv_dose)
# Sydney
df_uv_index1 = clean_uv_data(uv_index1)
df_uv_dose1 = clean_uv_data(uv_dose1)


# In[7]:


# Converting and combining for the MELBOURNE UV data

# Define the date range
start_date = "2023-11-01"
end_date = "2024-02-29"

# Filter the data within the given date range
df_uv_index_filtered = df_uv_index[(df_uv_index["Date"] >= start_date) & (df_uv_index["Date"] <= end_date)]
# Reset the index
df_uv_index_filtered = df_uv_index_filtered.reset_index(drop=True)


df_uv_dose["Date"] = pd.to_datetime(df_uv_dose["Date"])
df_uv_dose_filtered = df_uv_dose[(df_uv_dose["Date"] >= start_date) & (df_uv_dose["Date"] <= end_date)]
df_uv_dose_filtered = df_uv_dose_filtered.reset_index(drop=True)

# Convert 'Date' column to DD-MM-YYYY format
df_uv_dose_filtered["Date"] = df_uv_dose_filtered["Date"].dt.strftime("%d-%m-%Y")
df_uv_index_filtered["Date"] = df_uv_index_filtered["Date"].dt.strftime("%d-%m-%Y")


# In[8]:


# Converting and combining for the MELBOURNE AND SYDNEY UV INDEX AND DOSE
df_uv_index["location"] = "Melbourne"
df_uv_index["type"] = "UV Index"

df_uv_index1["location"] = "Sydney"
df_uv_index1["type"] = "UV Index"

df_uv_dose["location"] = "Melbourne"
df_uv_dose["type"] = "UV Dose"

df_uv_dose1["location"] = "Sydney"
df_uv_dose1["type"] = "UV Dose"

df_uv_combined = pd.concat([df_uv_index, df_uv_index1, df_uv_dose, df_uv_dose1], ignore_index=True)

## Changing data type part
start_date = "2023-11-01"
end_date = "2024-02-29"

df_uv_combined["Date"] = pd.to_datetime(df_uv_combined["Date"])

df_uv_filtered = df_uv_combined[(df_uv_combined["Date"] >= start_date) & (df_uv_combined["Date"] <= end_date)]

# Reset lại index
df_uv_filtered = df_uv_filtered.reset_index(drop=True)

df_uv_filtered["Date"] = df_uv_filtered["Date"].dt.strftime("%d-%m-%Y")

# Fixing date for visualisation
df_uv_filtered["Date"] = pd.to_datetime(df_uv_filtered["Date"], format="%d-%m-%Y")
unique_dates = sorted(df_uv_filtered["Date"].dt.strftime("%d-%m-%Y").unique(), key=lambda x: pd.to_datetime(x, format="%d-%m-%Y"))


# In[9]:


df_uv_filtered


# # 3. Data Synthetic
# **For sun protecting behavior** 
# 
# Output: df_xb_synthetic (where "x" represent number of table, from 1-5)
# 
# Note: 
# - Table 1b: sunscreen use last month
# - Table 2b: subnburn last week
# - Table 3b: suntanning last 12 months
# - Table 4b: days last week outdoors for longer than 15 minutes during peak hour
# - Table 5b: sun protection measure

# ## Table 1: Sunscreen use last month

# In[10]:


def generate_full_weighted_data(df_clean, total_population):
    """
    Generate synthetic data for exactly 50,000 individuals, ensuring that each person 
    has complete information from the `Group` categories while adhering to the actual 
    percentage distribution from the original dataset.

    Returns:
        pd.DataFrame: A complete dataset with exactly 50,000 rows.
    """
    synthetic_data = []
    np.random.seed(42)  # Ensure reproducibility

    # Initialize a list of 50,000 individuals
    genders = np.random.choice(["Male", "Female"], size=total_population)
    people = [{"ID": i, "Gender": genders[i]} for i in range(total_population)]

    # Process each `Group` with weighted sampling
    unique_groups = df_clean["Group"].unique()

    for group in unique_groups:
        subset = df_clean[df_clean["Group"] == group]
        if subset.empty:
            continue

        # Select `Characteristic` based on the actual percentage distribution
        probabilities = []
        characteristics = []

        for _, row in subset.iterrows():
            characteristic = row["Characteristic"]
            avg_percentage = np.nanmean([
                pd.to_numeric(row.get("Males_Used SPF30 or higher sunscreen on most days", 0), errors="coerce"),
                pd.to_numeric(row.get("Females_Used SPF30 or higher sunscreen on most days", 0), errors="coerce"),
                pd.to_numeric(row.get("Persons_Used SPF30 or higher sunscreen on most days", 0), errors="coerce")
            ]) / 100  # Convert to percentage

            if np.isnan(avg_percentage) or avg_percentage <= 0:
                continue

            characteristics.append(characteristic)
            probabilities.append(avg_percentage)

        # Assign each person a corresponding value based on probability distribution
        chosen_values = np.random.choice(characteristics, size=total_population, p=np.array(probabilities) / sum(probabilities))
        for i in range(total_population):
            people[i][group] = chosen_values[i]

    return pd.DataFrame(people)

# Call function for table 1B
df_1b_synthetic = generate_full_weighted_data(df_1b_clean, 50000)


# ## Table 2: Subnburn last week

# In[11]:


def generate_sunburn_data(df_clean, total_population):
    synthetic_data = []
    np.random.seed(42)

    genders = np.random.choice(["Male", "Female"], size=total_population)
    people = [{"ID": i, "Gender": genders[i]} for i in range(total_population)]

    unique_groups = df_clean["Group"].unique()

    for group in unique_groups:
        subset = df_clean[df_clean["Group"] == group]
        if subset.empty:
            continue

        probabilities = []
        characteristics = []

        for _, row in subset.iterrows():
            characteristic = row["Characteristic"]
            avg_percentage = np.nanmean([
                pd.to_numeric(row.get("Males_Experienced sunburn", 0), errors="coerce"),
                pd.to_numeric(row.get("Females_Experienced sunburn", 0), errors="coerce"),
                pd.to_numeric(row.get("Persons_Experienced sunburn", 0), errors="coerce")
            ]) / 100

            if np.isnan(avg_percentage) or avg_percentage <= 0:
                continue

            characteristics.append(characteristic)
            probabilities.append(avg_percentage)

        chosen_values = np.random.choice(characteristics, size=total_population, p=np.array(probabilities) / sum(probabilities))
        for i in range(total_population):
            people[i][group] = chosen_values[i]

    return pd.DataFrame(people)

df_2b_synthetic = generate_sunburn_data(df_2b_clean, 50000)


# ## Table 3: Suntanning last 12 months

# In[12]:


def generate_tanning_data(df_clean, total_population):
    synthetic_data = []
    np.random.seed(42)

    genders = np.random.choice(["Male", "Female"], size=total_population)
    people = [{"ID": i, "Gender": genders[i]} for i in range(total_population)]

    unique_groups = df_clean["Group"].unique()

    for group in unique_groups:
        subset = df_clean[df_clean["Group"] == group]
        if subset.empty:
            continue

        probabilities = []
        characteristics = []

        for _, row in subset.iterrows():
            characteristic = row["Characteristic"]
            avg_percentage = np.nanmean([
                pd.to_numeric(row.get("Males_Attempted to get a suntan", 0), errors="coerce"),
                pd.to_numeric(row.get("Females_Attempted to get a suntan", 0), errors="coerce"),
                pd.to_numeric(row.get("Persons_Attempted to get a suntan", 0), errors="coerce")
            ]) / 100

            if np.isnan(avg_percentage) or avg_percentage <= 0:
                continue

            characteristics.append(characteristic)
            probabilities.append(avg_percentage)

        chosen_values = np.random.choice(characteristics, size=total_population, p=np.array(probabilities) / sum(probabilities))
        for i in range(total_population):
            people[i][group] = chosen_values[i]

    return pd.DataFrame(people)

df_3b_synthetic = generate_tanning_data(df_3b_clean, 50000)


# ## Table 4: Days last week outdoors for longer than 15 minutes during peak hour

# In[13]:


def generate_full_weighted_data_4b(df_clean, total_population):
    """
    Generate synthetic data for table 4B with exactly 50,000 individuals,
    ensuring each person has complete information based on the actual distribution.

    Returns:
        pd.DataFrame: A complete dataset with exactly 50,000 rows.
    """
    np.random.seed(42)  # Ensure reproducibility
    synthetic_data = []

    # Generate a list of 50,000 individuals with gender distribution based on actual proportions
    genders = np.random.choice(["Male", "Female"], size=total_population)
    people = [{"ID": i, "Gender": genders[i]} for i in range(total_population)]

    # List of weekdays
    weekdays = [
        "Days last week outdoors for longer than 15 minutes during peak UV time_Monday",
        "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ]

    # Extract age group data from df_clean by weekday
    male_ages = df_clean.loc[
        (df_clean["Group"] == "Males") & ~df_clean["Characteristic"].str.contains("Total"),
        ["Characteristic"] + weekdays
    ]
    female_ages = df_clean.loc[
        (df_clean["Group"] == "Females") & ~df_clean["Characteristic"].str.contains("Total"),
        ["Characteristic"] + weekdays
    ]

    # Create age group distribution for each weekday
    male_age_probs = {}
    female_age_probs = {}

    for day in weekdays:
        male_ages[f"{day}_prob"] = male_ages[day].astype(float) / male_ages[day].sum()
        female_ages[f"{day}_prob"] = female_ages[day].astype(float) / female_ages[day].sum()
        
        male_age_probs[day] = {
            "groups": male_ages["Characteristic"].tolist(),
            "weights": male_ages[f"{day}_prob"].fillna(0).tolist()
        }
        female_age_probs[day] = {
            "groups": female_ages["Characteristic"].tolist(),
            "weights": female_ages[f"{day}_prob"].fillna(0).tolist()
        }

    for i in range(total_population):
        person = people[i]

        # Select outdoor day based on actual distribution
        probabilities_days = df_clean[weekdays].dropna().astype(float).mean(axis=0) / 100
        if probabilities_days.isnull().all():
            chosen_day = np.random.choice(weekdays)
        else:
            chosen_day = np.random.choice(weekdays, p=np.array(probabilities_days) / sum(probabilities_days))

        person["Spent_Time_Outdoor"] = chosen_day

        # Select age group based on corresponding weekday distribution
        if person["Gender"] == "Male":
            person["Age_Group"] = np.random.choice(male_age_probs[chosen_day]["groups"], p=male_age_probs[chosen_day]["weights"])
        elif person["Gender"] == "Female":
            person["Age_Group"] = np.random.choice(female_age_probs[chosen_day]["groups"], p=female_age_probs[chosen_day]["weights"])

        # Assign values for the remaining columns (excluding Persons)
        for col in [
            "State or territory of usual residence", "Remoteness area", "Country of birth",
            "Labour force status and Occupation", "Highest educational attainment",
            "Index of relative socio-economic disadvantage (SEIFA)", "Skin sensitivity to sun exposure for 30 minutes"
        ]:
            subset = df_clean[df_clean["Group"] == col]
            if not subset.empty:
                values = subset["Characteristic"].tolist()
                person[col] = np.random.choice(values) if values else np.nan

    return pd.DataFrame(people)

# Call function for table 4B
df_4b_synthetic = generate_full_weighted_data_4b(df_4b_clean, 50000)


# ## Table 5: Sun protection measure

# In[14]:


def generate_full_weighted_data_5b(df_clean, total_population):
    """
    Generate synthetic data for table 5B with exactly 50,000 individuals,
    ensuring each person has complete information based on the actual distribution.

    Returns:
        pd.DataFrame: A complete dataset with exactly 50,000 rows.
    """
    np.random.seed(42)  # Ensure reproducibility
    synthetic_data = []

    # Generate a list of 50,000 individuals with gender distribution based on actual proportions
    genders = np.random.choice(["Male", "Female"], size=total_population)
    people = [{"ID": i, "Gender": genders[i]} for i in range(total_population)]

    # List of sun protection measures
    protection_methods = [
        "Type of sun protection measure used last week_Used SPF30 or higher sunscreen",
        "Broad brimmed hat or cap with a back flap",
        "Stayed in the shade",
        "Clothing or swimwear that covered three-quarters or more of arms",
        "Clothing or swimwear that covered three-quarters or more of legs",
        "Sunglasses",
        "None of these measures",
        "Three or more sun protection measures used"
    ]

    # Extract age group data from df_clean
    male_ages = df_clean.loc[
        (df_clean["Group"] == "Males") & ~df_clean["Characteristic"].str.contains("Total"),
        ["Characteristic"] + protection_methods
    ]
    female_ages = df_clean.loc[
        (df_clean["Group"] == "Females") & ~df_clean["Characteristic"].str.contains("Total"),
        ["Characteristic"] + protection_methods
    ]

    # Create age group distribution for each sun protection measure
    male_age_probs = {}
    female_age_probs = {}

    for method in protection_methods:
        male_ages[f"{method}_prob"] = male_ages[method].astype(float) / male_ages[method].sum()
        female_ages[f"{method}_prob"] = female_ages[method].astype(float) / female_ages[method].sum()
        
        male_age_probs[method] = {
            "groups": male_ages["Characteristic"].tolist(),
            "weights": male_ages[f"{method}_prob"].fillna(0).tolist()
        }
        female_age_probs[method] = {
            "groups": female_ages["Characteristic"].tolist(),
            "weights": female_ages[f"{method}_prob"].fillna(0).tolist()
        }

    for i in range(total_population):
        person = people[i]

        # Select sun protection method based on actual distribution
        protection_probs = df_clean[protection_methods].dropna().astype(float).mean(axis=0) / 100
        if protection_probs.isnull().all():
            chosen_protection = np.random.choice(protection_methods)
        else:
            chosen_protection = np.random.choice(protection_methods, p=np.array(protection_probs) / sum(protection_probs))

        person["Used_Sun_Protection"] = chosen_protection

        # Assign age group based on chosen sun protection method
        if person["Gender"] == "Male":
            person["Age_Group"] = np.random.choice(male_age_probs[chosen_protection]["groups"], p=male_age_probs[chosen_protection]["weights"])
        elif person["Gender"] == "Female":
            person["Age_Group"] = np.random.choice(female_age_probs[chosen_protection]["groups"], p=female_age_probs[chosen_protection]["weights"])

        # Assign remaining columns (excluding Persons)
        for col in [
            "State or territory of usual residence", "Remoteness area", "Country of birth",
            "Labour force status and Occupation", "Highest educational attainment",
            "Index of relative socio-economic disadvantage (SEIFA)", "Skin sensitivity to sun exposure for 30 minutes"
        ]:
            subset = df_clean[df_clean["Group"] == col]
            if not subset.empty:
                values = subset["Characteristic"].tolist()
                person[col] = np.random.choice(values) if values else np.nan

    return pd.DataFrame(people)

# Call function for table 5B
df_5b_synthetic = generate_full_weighted_data_5b(df_5b_clean, 50000)


# # 4. Visualize data

# In[15]:


# ✅ Initialize Dash App
app1 = dash.Dash(__name__, suppress_callback_exceptions=True)
server1 = app1.server  # Needed for deployment

# ✅ Prepare UV Index Data
df_uv_filtered["Date"] = pd.to_datetime(df_uv_filtered["Date"], format="%d-%m-%Y")
df_uv_filtered = df_uv_filtered[df_uv_filtered["type"] == "UV Index"]

# 📌 Define City Coordinates
city_coords = {
    "Melbourne": (-37.8136, 144.9631),
    "Sydney": (-33.8688, 151.2093)
}

df_uv_filtered["Latitude"] = df_uv_filtered["location"].map(lambda x: city_coords[x][0])
df_uv_filtered["Longitude"] = df_uv_filtered["location"].map(lambda x: city_coords[x][1])

# 📌 Unique Dates for Animation
unique_dates = sorted(df_uv_filtered["Date"].dt.strftime("%Y-%m-%d").unique())

# ✅ Default display (latest date)
default_index = len(unique_dates) - 1  # Or use 0 for the first date
default_date = unique_dates[default_index]

# ✅ Function to Generate Extra Points for Smooth Heatmap
def generate_uv_points(df, num_points=30, spread=0.08):
    """Generate additional data points around main UV index locations for a smooth heatmap effect."""
    new_rows = []
    for _, row in df.iterrows():
        for _ in range(num_points):
            lat_offset = np.random.uniform(-spread, spread)
            lon_offset = np.random.uniform(-spread, spread)
            new_rows.append({
                "Date": row["Date"],
                "location": row["location"],
                "Latitude": row["Latitude"] + lat_offset,
                "Longitude": row["Longitude"] + lon_offset,
                "UV_Value": row["UV_Value"]
            })
    return pd.DataFrame(new_rows)

# ✅ Layout for Animation UV Index
app1.layout = html.Div([
    html.H1("Dynamic UV Index - Melbourne & Sydney", style={"textAlign": "center"}),

    # 🎯 Display Current Date
    html.H3(f"Date: {default_date}", id="animated-date", style={"textAlign": "center"}),

    # 📌 Display Two Maps (Melbourne & Sydney)
    html.Div([
        dcc.Graph(id="melbourne-map", style={'width': '48%', 'display': 'inline-block'}),
        dcc.Graph(id="sydney-map", style={'width': '48%', 'display': 'inline-block'})
    ]),

    # 🎯 Hidden Slider (Controlled Automatically)
    dcc.Slider(
        id="date-slider",
        min=0,
        max=len(unique_dates) - 1,
        value=default_index,  # ✅ Start with latest or first available date
        marks={i: date for i, date in enumerate(unique_dates) if i % 10 == 0},
        step=1,
        updatemode="drag"
    ),

    # ⏳ Interval Component for Auto-Playing Animation
    dcc.Interval(
        id="interval-component",
        interval=500,  # ✅ Speed of animation (adjustable)
        n_intervals=0,
        disabled=True  # ✅ Start in paused mode
    ),

    # ▶️ Button to Start/Stop Animation
    html.Button("Start Animation", id="toggle-button", n_clicks=0, style={
        "margin": "10px", "display": "block", "marginLeft": "auto", "marginRight": "auto"
    })
])

# ✅ Callback to Toggle Animation
@app1.callback(
    Output("interval-component", "disabled"),
    Input("toggle-button", "n_clicks"),
    prevent_initial_call=True
)
def toggle_animation(n_clicks):
    """Enable or disable animation based on button clicks."""
    return n_clicks % 2 == 1  # Disable on odd clicks, enable on even clicks

# ✅ Callback to Update Maps & Date Automatically
@app1.callback(
    [Output("melbourne-map", "figure"),
     Output("sydney-map", "figure"),
     Output("date-slider", "value"),
     Output("animated-date", "children"),
     Output("toggle-button", "children")],  # Update button text
    [Input("interval-component", "n_intervals"),
     Input("toggle-button", "n_clicks")],  # Track button clicks
    [State("interval-component", "disabled")]  # Check if animation is active
)
def update_maps(n_intervals, n_clicks, is_paused):
    """Update maps dynamically based on animation state."""
    if n_intervals == 0 and n_clicks == 0:
        selected_index = default_index
    else:
        selected_index = n_intervals % len(unique_dates)  

    selected_date = unique_dates[selected_index]
    
    df_filtered = df_uv_filtered[df_uv_filtered["Date"] == selected_date]
    df_melbourne = df_filtered[df_filtered["location"] == "Melbourne"]
    df_sydney = df_filtered[df_filtered["location"] == "Sydney"]

    df_melbourne_expanded = generate_uv_points(df_melbourne, num_points=30, spread=0.08)
    df_sydney_expanded = generate_uv_points(df_sydney, num_points=30, spread=0.08)

    fig_melbourne = px.density_mapbox(
        df_melbourne_expanded,
        lat="Latitude",
        lon="Longitude",
        z="UV_Value",
        title=f"Melbourne UV Index on {selected_date}",
        radius=80,
        color_continuous_scale=["green", "yellow", "orange", "red", "purple"],
        range_color=(0, 12),
        hover_name="location",
        zoom=10,
        mapbox_style="carto-positron"
    )

    fig_sydney = px.density_mapbox(
        df_sydney_expanded,
        lat="Latitude",
        lon="Longitude",
        z="UV_Value",
        title=f"Sydney UV Index on {selected_date}",
        radius=80,
        color_continuous_scale=["green", "yellow", "orange", "red", "purple"],
        range_color=(0, 12),
        hover_name="location",
        zoom=10,
        mapbox_style="carto-positron"
    )

    fig_melbourne.update_layout(
        title_x=0.5, 
        font=dict(family="Arial, sans-serif", size=18),
        coloraxis_colorbar=dict(
            title="UV Index Level",
            title_side="top",  
            tickmode="array",
            tickvals=[0, 2, 4, 6, 8, 10, 12],
        )
    )
    fig_sydney.update_layout(
        title_x=0.5, 
        font=dict(family="Arial, sans-serif", size=18),
        coloraxis_colorbar=dict(
            title="UV Index Level",
            title_side="top",  
            tickmode="array",
            tickvals=[0, 2, 4, 6, 8, 10, 12],
        )
    )
    
    button_text = "Click to Stop" if not is_paused else "Motion"

    return fig_melbourne, fig_sydney, selected_index, f"Date: {selected_date}", button_text

# ✅ Run the Dash App on port 8050
if __name__ == "__main__":
    app1.run_server(debug=True, port=8050)


# In[16]:


# # Print out unique value of type
# df_5b_synthetic['Used_Sun_Protection'].unique()

# # Map with emoji
# rename_map = {
#     "Type of sun protection measure used last week_Used SPF30 or higher sunscreen": "\U0001F9F4",  
#     "Broad brimmed hat or cap with a back flap": "\U0001F452",
#     "Sunglasses": "\U0001F576",
#     "Stayed in the shade": "\U0001F333",
#     "Clothing or swimwear that covered three-quarters or more of arms": "\U0001F455",
#     "Three or more sun protection measures used": "\U0001F3C3",
#     "Clothing or swimwear that covered three-quarters or more of legs": "\U0001F456",
#     "None of these measures": "\u274C"
# }

# Applying
# df_5b_synthetic["Sun_Protection_Type"] = df_5b_synthetic["Used_Sun_Protection"].replace(rename_map)

# Print out unique value again
# df_5b_synthetic['Sun_Protection_Type'].unique()

##### Synchronize the column names #####
# df_5b_synthetic = df_5b_synthetic.rename(columns={"Age_Group": "Age group"})
df_5b_synthetic["Age group"] = df_5b_synthetic["Age_Group"]

df_4b_synthetic["Age group"] = df_4b_synthetic["Age_Group"]
df_4b_synthetic["Spent_Time_Outdoor"] = df_4b_synthetic["Spent_Time_Outdoor"].replace(
    "Days last week outdoors for longer than 15 minutes during peak UV time_Monday", "Monday")


# In[19]:


app2 = dash.Dash(__name__, suppress_callback_exceptions=True)
server = app2.server  # needed for deployment

# Shared Color Mapping for Age group
age_group_colors = {
    "15-24 years": "#F4A261",
    "25-34 years": "#E9C46A",
    "35-44 years": "#2A9D8F",
    "45-54 years": "#264653",
    "55-64 years": "#8AB17D",
    "65 years and over": "#E76F51"
}

#TAB 1: Sunscreen Use Overview (Choropleth + Bar Chart)
df_map = df_1b_synthetic.groupby("State or territory of usual residence").agg({"ID": "count"}).reset_index()
df_map.columns = ["State", "Sunscreen Users"]

with open("states.geojson", "r") as f:
    geojson_aus = json.load(f)

fig_map = px.choropleth(
    df_map,
    geojson=geojson_aus,
    locations="State",
    featureidkey="properties.STATE_NAME",
    color="Sunscreen Users",
    hover_name="State",
    title="Sunscreen Use by State (Australia)",
    color_continuous_scale="Blues"
)
fig_map.update_geos(fitbounds="locations", visible=False)
fig_map.update_layout(title_x=0.5, margin=dict(l=20, r=20, t=60, b=20))

df_bar = df_1b_synthetic.groupby("Age group").agg({"ID": "count"}).reset_index()
df_bar.columns = ["Age Group", "Sunscreen Users"]

fig_bar = px.bar(
    df_bar,
    x="Age Group",
    y="Sunscreen Users",
    title="Sunscreen Use by Age Group",
    color="Sunscreen Users",
    color_continuous_scale="Blues"
)
fig_bar.update_layout(title_x=0.5, margin=dict(l=20, r=20, t=60, b=20))

# Use a flex container so both charts share the same height if needed
sunscreen_overview = html.Div([
    html.Div([
        dcc.Graph(figure=fig_map, style={'height': '100%', 'width': '100%'})
    ], style={'flex': '1', 'margin': '10px'}),

    html.Div([
        dcc.Graph(figure=fig_bar, style={'height': '100%', 'width': '100%'})
    ], style={'flex': '1', 'margin': '10px'})
], style={'display': 'flex', 'flexDirection': 'row', 'height': '600px'})

# TAB 2: Sun Protection & Outdoor Time
# 1. Dropdown + Sunburst

rename_map = {
    "Type of sun protection measure used last week_Used SPF30 or higher sunscreen": 
        "Used SPF30+ sunscreen \U0001F9F4",
    "Broad brimmed hat or cap with a back flap": 
        "Hat with back flap \U0001F452",
    "Sunglasses": 
        "Sunglasses \U0001F576",
    "Stayed in the shade": 
        "Shade \U0001F333",
    "Clothing or swimwear that covered three-quarters or more of arms": 
        "Covered arms \U0001F455",
    "Three or more sun protection measures used": 
        "More than 3 protections \U0001F3C3",
    "Clothing or swimwear that covered three-quarters or more of legs": 
        "Covered legs \U0001F456",
    "None of these measures": 
        "No measure \u274C"
}

df_5b_synthetic["Sun_Protection_Type"] = df_5b_synthetic["Used_Sun_Protection"].replace(rename_map)

# Build the sunburst figure dynamically in a callback => no figure here yet.

# 2. Outdoor Time Bar Chart
df_4b_synthetic["Spent_Time_Outdoor"] = df_4b_synthetic["Spent_Time_Outdoor"].replace(
    "Days last week outdoors for longer than 15 minutes during peak UV time_Monday", "Monday"
)
df_outdoor = df_4b_synthetic.groupby(["Spent_Time_Outdoor", "Age group"]).size().reset_index(name="Count")
day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

fig_outdoor = px.bar(
    df_outdoor,
    x="Spent_Time_Outdoor",
    y="Count",
    color="Age group",
    color_discrete_map=age_group_colors,
    title="Time Spent Outdoor by Day",
    category_orders={"Spent_Time_Outdoor": day_order},
    labels={"Spent_Time_Outdoor": "Day", "Count": "Count"}
)
fig_outdoor.update_layout(
    title_x=0.5,
    legend_title_text="Age group",
    margin=dict(l=20, r=20, t=60, b=20)
)

# Custom legend for emojis
legend_emojis = html.Div([
    html.H4("Legend: Sun Protection Measures"),
    html.Ul([
        html.Li(["Used SPF30+ sunscreen \U0001F9F4"]),
        html.Li(["Hat with back flap \U0001F452"]),
        html.Li(["Sunglasses \U0001F576"]),
        html.Li(["Shade \U0001F333"]),
        html.Li(["Covered arms \U0001F455"]),
        html.Li(["More than 3 protections \U0001F3C3"]),
        html.Li(["Covered legs \U0001F456"]),
        html.Li(["No measure \u274C"])
    ])
])

# Use flex layout again
sun_protection_outdoor_layout = html.Div([
    html.Div([
        # Dropdown for filtering
        dcc.Dropdown(
            id='sun-protection-filter',
            options=[
                {'label': 'Show All Measures', 'value': 'all'},
                {'label': 'Used SPF30+ sunscreen', 'value': 'Used SPF30+ sunscreen \U0001F9F4'},
                {'label': 'Hat with back flap', 'value': 'Hat with back flap \U0001F452'},
                {'label': 'Sunglasses', 'value': 'Sunglasses \U0001F576'},
                {'label': 'Shade', 'value': 'Shade \U0001F333'},
                {'label': 'Covered arms', 'value': 'Covered arms \U0001F455'},
                {'label': 'More than 3 protections', 'value': 'More than 3 protections \U0001F3C3'},
                {'label': 'Covered legs', 'value': 'Covered legs \U0001F456'},
                {'label': 'No measure', 'value': 'No measure \u274C'}
            ],
            value='all',
            clearable=False,
            style={
                'width': '80%', 
                'backgroundColor': 'white',  # override dark backgrounds
                'color': 'black'
            }
        ),
        dcc.Graph(id='sunburst-graph', style={'height': '100%', 'width': '100%'}),
        legend_emojis
    ], style={'flex': '1', 'margin': '10px', 'verticalAlign': 'top'}),

    html.Div([
        # Right column: Time Spent Outdoor chart
        dcc.Graph(figure=fig_outdoor, style={'height': '100%', 'width': '100%'})
    ], 
    # Add marginTop here to push the chart downward
    style={
        'flex': '1', 
        'margin': '10px', 
        'verticalAlign': 'top',
        'marginTop': '60px'  # <-- Adjust this value as needed
    })
], style={'display': 'flex', 'flexDirection': 'row', 'height': '700px'})

# TAB 3: Suntanning Visualization
df_suntanning = df_3b_synthetic.groupby("Age group").size().reset_index(name="Count")
fig_suntanning = px.bar(
    df_suntanning,
    x="Age group",
    y="Count",
    title="Suntanning in the Last 12 Months (by Age Group)",
    color="Age group",
    color_discrete_map=age_group_colors
)
fig_suntanning.update_layout(title_x=0.5, legend_title_text="Age group", margin=dict(l=20, r=20, t=60, b=20))

suntanning_layout = html.Div([
    dcc.Graph(figure=fig_suntanning, style={'height': '80%', 'width': '100%'}) ######
], style={'height': '600px', 'display': 'flex'})

# Main layout with Tabs
app2.layout = html.Div([
    html.H1("SunGuard Insights Dashboard", style={"textAlign": "center", "color": "darkblue"}),

    # Override tab colors or background if you want to remove black/dark areas
    dcc.Tabs(
        id="tabs",
        value="tab-1",
        children=[
            dcc.Tab(label="Sunscreen Use Overview", value="tab-1"),
            dcc.Tab(label="Sun Protection & Outdoor Time", value="tab-2"),
            dcc.Tab(label="Suntanning", value="tab-3")
        ],
        style={'backgroundColor': 'white'},  # Force tabs area to be white
        colors={
            "border": "white",
            "primary": "darkblue",
            "background": "lightgray"  # color for inactive tabs
        }
    ),
    html.Div(id="tabs-content")
], style={'backgroundColor': 'white'})  # overall background


# Callback to switch content based on the selected Tab
@app2.callback(
    Output("tabs-content", "children"),
    Input("tabs", "value")
)
def update_tab(tab):
    if tab == "tab-1":
        return html.Div([sunscreen_overview])
    elif tab == "tab-2":
        return html.Div([sun_protection_outdoor_layout])
    elif tab == "tab-3":
        return html.Div([suntanning_layout])
    else:
        return html.Div([html.H3("Tab not found")])

# Callback to update the Sunburst figure (for animation)
@app2.callback(
    Output('sunburst-graph', 'figure'),
    Input('sun-protection-filter', 'value')
)
def update_sunburst(selected_measure):
    """
    This callback updates the Sunburst chart based on the dropdown selection.
    If 'all' is chosen, show all measures. Otherwise, show only the selected measure.
    """
    if selected_measure == 'all':
        filtered_df = df_5b_synthetic
    else:
        filtered_df = df_5b_synthetic[df_5b_synthetic['Sun_Protection_Type'] == selected_measure]

    df_sunburst_filtered = filtered_df.groupby(["Age group", "Sun_Protection_Type"]).size().reset_index(name="Count")

    fig_sunburst = px.sunburst(
        df_sunburst_filtered,
        path=["Age group", "Sun_Protection_Type"],
        values="Count",
        color="Age group",
        title="Sun Protection Measures by Age Group (Sunburst)",
        color_discrete_map=age_group_colors
    )
    fig_sunburst.update_traces(
        textinfo="label+percent parent",
        textfont_size=14,
        insidetextorientation="radial"
    )
    fig_sunburst.update_traces(
        hovertemplate="Count: %{value}<extra></extra>"
    )
    fig_sunburst.update_layout(
        uniformtext=dict(minsize=12, mode="show"),
        legend_title_text="Age group",
        transition={'duration': 500, 'easing': 'cubic-in-out'},
        title_x=0.5,
        margin=dict(l=20, r=20, t=60, b=20)
    )
    return fig_sunburst


if __name__ == "__main__":
    app2.run_server(debug=True, port=8051)

