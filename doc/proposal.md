# The Data
Data stored in the database will include information obtained from publicly available FCC microwave and millimeter wave data. The data will include attributes such as frequency band, assigned call sign, location of transmission, and ownership information of the transmitting entity.

# Functions
The basic functions of the web application will include the ability for users to search for and view communications related to high frequency trading in a visual format using Google Earth. Users will be able to filter the results based on attributes such as frequency band and location. Additionally, the application will have a feature to allow users to manually add HFT-related communications not found in the FCC data.

# Creative Component
To improve the functionality of the application, a creative component could be the ability for users to visualize HFT communication activity over time. This could be achieved by plotting the communications data on a timeline and allowing users to select a date range to view. The resulting visualization would show the concentration of HFT-related communications in a given area over a specified time period. (This sounds difficult). Also building the filtering features into the front end nicely and integrating them with the google API would improve our application greatly, but might be challenging.

# Title
HFTracer: Visualizing High Frequency Trading Communications

# Summary
HFTracer is a web application that allows users to visualize high frequency trading (HFT) communications data obtained from publicly available FCC microwave and millimeter wave data. The application integrates with Google Earth to provide a visual representation of HFT-related communications and allows users to filter the results based on frequency band and location. Additionally, users can manually add HFT-related communications not found in the FCC data. In other words, we can find the start and end locations of HFT communcations from data on the FCC website, which we will use to visualize what parts of the country are communicating with each other in the HFT world.

# Description
The purpose of the application is to make it easier for users to understand the extent and location of HFT-related communications. By providing a visual representation of the data, users can quickly identify the concentration of HFT activity in a given area and over a specified time period. The goal is to provide a tool that helps users make informed decisions about their own investments and market activity, or for others to visualize what other companies or traders are doing.

# Usefulness
There are no known/public similar websites or applications that provide a visual representation of HFT-related communications data. HFTracer offers a unique approach to understanding the extent and location of HFT activity, which is useful for investors, traders, and market analysts. By integrating with Google Earth, the application provides a user-friendly and interactive way to explore the data.

# Realness
The data for the application will be obtained from publicly available FCC microwave and millimeter wave data, which contains start and end locations and a list of the "entities" making the trades. The data will be regularly updated to ensure it remains accurate and relevant. Users will be able to manually add HFT-related communications not found in the FCC data, ensuring that the database remains up-to-date.

# Functionality
The website offers a user-friendly interface for searching and visualizing HFT-related communications data. A user can interact with the application in the following ways:
- **Search**: Users can search for HFT-related communications by frequency band, location, and date range. The results of the search will be displayed on a Google Earth map, showing the location and concentration of HFT activity in a given area.
- **Filter**: Users can filter the search results based on frequency band and location, allowing them to easily identify the concentration of HFT activity in a specific area.
- **Add Communications**: Users can manually add HFT-related communications not found in the FCC data. The added communications will be displayed on the Google Earth map and will be included in future searches.
- **View Communications Over Time**: Users can view the HFT-related communications data over a specified time period by plotting the communications data on a timeline. This allows users to see the concentration of HFT activity in a given area over time.
- **UI Mockup**: see mockup picture in docs folder

# Distribution
We will all work with the data and building a database out of it into something we can work with on the website. From there, Justin will build the "main" front end, as in drawing lines from the start to end locations and giving them their colors and integrating it with the google maps API. John will implement the frontend for the search as well as its functionality on the backend. Cheng-Han will implement a filter feature to sort the communications by their band or frequency, such that only the chosen "colors" will be displayed on the map. Amritesh will implement the adding communications feature to add new communications to the existing database and have them show up on the map. Then, because it's probably our loftiest goal, all of us will work together, time permitting, on implementing a feature to have the map be "animated" to show the timeline of communications.




