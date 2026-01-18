
# Blueprint: Memory Test PWS

## Overview

This application is a memory test created for a high school final project (profielwerkstuk). It tests a user's ability to recall images and words in two phases. The application is designed to be simple, intuitive, and visually engaging.

## Project Outline & Features

### Core Functionality
- **Multi-Page Flow**: The app guides the user through a sequence of pages: Introduction, User Info, Image Phase 1, Recall Phase 1, Image Phase 2, Recall Phase 2, and Results.
- **Timers**: Each phase (image viewing, thinking, recalling) is time-limited using clear on-screen timers.
- **User Input**: The app collects user data (name, gender, age) and their recall responses via text areas.
- **Progress Tracker**: A visual progress bar at the top shows the user which stage of the test they are in.
- **Sound**: Background music is included with a toggle to mute/unmute.

### Design & Styling (Current Implementation)
- **Modern Sans-Serif Font**: Uses the "Poppins" font from Google Fonts.
- **Color Palette**: A vibrant, modern palette centered around a purple-blue gradient.
- **"Lifted" Card UI**: The main content is displayed in cards with rounded corners and soft, deep drop shadows.
- **Blob Background**: A dynamic, animated background composed of colorful "blobs" to create a gentle, ambient effect.
- **Responsive Design**: The layout adapts to various screen sizes, ensuring a good experience on both mobile and desktop.
- **Iconography**: Uses emoji icons for simple and clear UI elements like the sound toggle.

## Current Plan: Redesign and Responsiveness

Based on the user's request, the following changes will be implemented to enhance the visual appeal and responsiveness of the application, aligning it with the provided image.

1.  **Restyle the Progress Tracker**:
    *   The active step's dot will be a solid purple circle with a white number.
    *   Inactive steps will have a white background, a light grey border, and a dark number.
    *   The container will have a rounded white background with a subtle box shadow.

2.  **Update the Main Card**:
    *   Increase the roundness of the corners and refine the box shadow to create a more "lifted" appearance.
    *   Adjust the typography: Make the main title (`h1`) larger and bolder. Center-align all text.

3.  **Refine the "Start" Button**:
    *   Style the button with a vibrant purple-to-blue gradient background.
    *   Ensure the text is white, bold, and clear.
    *   Add a subtle glow/shadow effect on hover to improve interactivity.

4.  **Adjust the Background**:
    *   Modify the background blobs to be larger, more diffuse, and use the purple/pink color scheme from the image to create a softer, more ambient effect.

5.  **Improve Responsiveness**:
    *   Add/update media queries to ensure the layout, font sizes, and spacing adjust gracefully on smaller screens. The card and progress tracker should scale down appropriately.
