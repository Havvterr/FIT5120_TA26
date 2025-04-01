from dash.dependencies import Input, Output, State
import pandas as pd
import dash
from dash import dcc, html
import plotly.express as px
import numpy as np
import json

# ✅ Initialize Dash App
app1 = dash.Dash(__name__, suppress_callback_exceptions=True)
server1 = app1.server  # Needed for deployment

# Make sure that "processed_data.xlsx" contains a sheet named "UV_Filters"
processed_file = "processed_data.xlsx"
df_uv_filtered = pd.read_excel(processed_file, sheet_name="UV_Filters")

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

# ✅ Run the Dash App on port 8052
if __name__ == "__main__":
    app1.run_server(debug=True, port=8052)
