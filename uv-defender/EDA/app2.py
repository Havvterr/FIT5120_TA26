from dash.dependencies import Input, Output, State
import pandas as pd
import dash
from dash import dcc, html
import plotly.express as px
import numpy as np
import json

app2 = dash.Dash(__name__, suppress_callback_exceptions=True)
server = app2.server  # needed for deployment

# Load processed data from Excel
processed_file = "processed_data.xlsx"

# Load the synthetic survey data
df_1b_synthetic = pd.read_excel(processed_file, sheet_name="Table1b")
df_2b_synthetic = pd.read_excel(processed_file, sheet_name="Table2b")
df_3b_synthetic = pd.read_excel(processed_file, sheet_name="Table3b")
df_4b_synthetic = pd.read_excel(processed_file, sheet_name="Table4b")
df_5b_synthetic = pd.read_excel(processed_file, sheet_name="Table5b")

# Load the UV filtered data
df_uv_filtered = pd.read_excel(processed_file, sheet_name="UV_Filters")

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
    app2.run_server(debug=True, port=8053)