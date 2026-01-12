# Interactive Cartesian Geometry Application

An interactive 2D geometry exploration tool built with **React**, **TypeScript**, and **KonvaJS**. This application allows users to draw, manipulate, and analyze geometric shapes in a Cartesian coordinate system with real-time feedback.

## 🚀 Key Features

### 1. Object Creation & Manipulation
*   **Draw-to-Create**: Instantly create new shapes (rectangles) by **Clicking & Dragging** directly on the canvas.
*   **Drag & Drop**: Seamlessly reposition any object within the canvas area.
*   **Vertex Editing**: Hold the **`SHIFT`** key and drag individual corners to transform rectangles into complex polygons (trapezoids, parallelograms, etc.).
*   **Auto-Labeling**: Objects are automatically assigned a letter label (A, B, C...) and a unique color upon creation.

### 2. Intelligent Geometry Engine (Real-Time)
*   **Automatic Intersection**: Powered by the **Martinez Polygon Clipping** algorithm to detect and visualize overlapping areas between shapes accurately.
*   **Dynamic Intersection Objects**: Overlapping areas are rendered as distinct red shapes with their own geometric properties (area, coordinates).
*   **Mathematical Calculations**: Automatically computes:
    *   Side lengths (AB, BC, CD, DA).
    *   Interior angles (in both degrees and radians).
    *   Total surface area (using the Shoelace algorithm).

### 3. Interface & Visualization
*   **Precision Canvas**: Features **Grid Lines** and **X/Y Rulers** for accurate coordinate reference.
*   **Interactive Info Card**: A clean instruction panel (Create, Move, Modify, Inspect) with a conditional "Clear All" action.
*   **Detail Dialog**: Click any shape to open a modal displaying in-depth geometric data and a deletion option.
*   **Contextual Feedback**: Dynamic mouse cursors (crosshair for drawing, pointer for interaction) and visual highlights.

## 🛠️ Technical Stack
*   **Frontend**: React 19, TypeScript
*   **Canvas Library**: Konva & React-Konva
*   **Geometry Logic**: Martinez Polygon Clipping
*   **Styling**: Tailwind CSS, Lucide React
*   **Components**: Radix UI (shadcn/ui)
*   **Build Tool**: Vite

## 🏃 How to Run the Project

Follow these steps to get the project running locally:

### 1. Clone the repository
```bash
git clone <repository-url>
cd cartesian-coordinate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start the development server
```bash
npm run dev
```

### 4. Open in browser
Navigate to `http://localhost:5173` (or the port shown in your terminal) to view the application.

## 📁 Project Structure
The core geometry logic is modularized under `src/lib/konva/`:
*   `useShapeDrawing.tsx`: Custom hook for mouse input and drawing states.
*   `utils.tsx`: Mathematical functions and geometric type definitions.
*   `KonvaShape.tsx` & `IntersectionShape.tsx`: Specialized rendering components.
*   `components.tsx`: Supporting visual elements like Rulers and GridLines.
