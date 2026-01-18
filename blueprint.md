# Memory Test Application Blueprint

## Overview

This document outlines the plan for creating a memory test application. The application will guide the user through a series of timed image exposure and recall tests, and then present the results. The application will feature a fancy, visually rich, and modern design.

A key feature is the randomization of test content. For each test session, the application will randomly select a color theme (e.g., "black", "right", "wrong") and present a pair of images (one with animals, one with words) corresponding to that theme. The order of the animal and word images will also be randomized for each session.

## Project Structure

*   `index.html`: The main HTML file containing the structure for all pages of the application.
*   `style.css`: The stylesheet for the application.
*   `main.js`: The JavaScript file containing the application logic, using jQuery.
*   `src/imgs/`: A directory containing all image sets, named by type and color (e.g., `animal-black.jpeg`, `words-black.jpeg`).

## Feature Implementation Plan

1.  **Progress Tracker:**
    *   A visual indicator at the top of the application shows the user's current stage in the test (Intro, Fase 1, Fase 2, Resultaat).
    *   The tracker will dynamically update as the user progresses.

2.  **User Information Form:**
    *   Collects basic user data (name, gender, age) before the test begins.

3.  **Image Display Pages:**
    *   Each of the two images is displayed for 15 seconds.
    *   A timer is shown on the page.

4.  **Thinking & Recall Pages:**
    *   A 10-second "thinking" phase after each image.
    *   A 30-second "recall" phase where the user types what they remember.
    *   Timers are displayed, and the application automatically proceeds when time is up.

5.  **Randomization:**
    *   On starting a new test, the application randomly selects one of three image themes (`black`, `right`, `wrong`).
    *   The order of the "animal" and "words" images is also randomized for each session.

6.  **Results Page:**
    *   Displays the user's answers and the correct answers for both images.
    *   Shows the user's score for each image.

7.  **Animated Background:**
    *   Soft, animated blobs are in the background of the entire application to create a more dynamic and visually engaging experience.
    *   The blobs will float and morph gently behind the main content.

## Styling and Design

*   **Theme:** Modern, "fancy" aesthetic with a purple color scheme.
*   **Layout:** Centered, card-based UI.
*   **Typography:** Clean, modern, and readable fonts.
*   **Visual Effects:** Use of shadows, gradients, and rounded corners to create depth and a premium feel.
