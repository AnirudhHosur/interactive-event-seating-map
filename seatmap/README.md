# SeatMap - Multi-Arena Seating System

A modern, interactive seating map application built with Next.js 15, React 19, and Material-UI 7 that allows users to browse multiple venues and select seats with an intuitive, professional interface.

## ✨ Features

### 🏟️ **Multi-Arena Support**
- **Metropolis Arena** - Modern indoor arena (2,500 capacity) - Downtown Metropolis
- **Starlight Stadium** - Outdoor stadium with luxury suites (4,500 capacity) - Riverside District
- **The Grand Hall** - Intimate concert hall (1,200 capacity) - Cultural Quarter

### 🎯 **Interactive Seating**
- **Visual Stage/Performance Area** - Prominent stage display with venue-specific colors
- **Color-Coded Seat Status**:
  - 🟢 **Green**: Available seats
  - 🟡 **Yellow**: Reserved seats
  - 🟣 **Purple**: Held seats
  - 🔴 **Red**: Sold seats
- **Price Tiers**: Different pricing levels (Premium $150, Standard $110, Economy $80, Budget $55)
- **Section Labels**: Clear identification of seating areas with professional typography

### 🧭 **Navigation & UX**
- **Home Page**: Browse and search available venues with beautiful SVG illustrations
- **Dynamic Routing**: `/arena/[venueId]` for individual venue pages with Next.js 15 App Router
- **Search & Filter**: Real-time search across venue names, locations, and descriptions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Arrow keys for seat-to-seat movement with roving tabindex
- **Zoom & Pan**: D3.js powered interactive map controls (0.5x to 6x zoom)
- **Navigation Controls**: Home button and back button for seamless venue browsing

### 🎨 **Modern UI Components**
- **Material-UI 7 Design**: Latest design system with professional, accessible interface
- **Interactive Cards**: Hover effects, smooth transitions, and visual feedback
- **Real-time Updates**: Live seat selection and pricing calculations
- **Selection Summary**: Track chosen seats, pricing, and total cost
- **Loading States**: Smooth loading indicators and error handling

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Run Development Server**
   ```bash
   pnpm dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

4. **Explore Venues**
   - Browse the home page to see all available venues
   - Use the search bar to filter venues by name, location, or description
   - Click on any venue card to enter the seating selection interface

5. **Select Seats**
   - Navigate using arrow keys or mouse
   - Zoom and pan the seating map
   - View real-time pricing and selection summary

## 🏗️ Architecture

### **File Structure**
```
src/
├── app/
│   ├── page.tsx              # Home page with venue list and search
│   ├── arena/[venueId]/      # Dynamic arena routes with Next.js 15
│   └── layout.tsx            # Root layout with providers
├── components/
│   ├── ArenaCard.tsx         # Interactive venue cards with hover effects
│   ├── ArenaList.tsx         # Venue browsing interface with search
│   ├── SeatMap.tsx           # Interactive seating map with D3.js
│   ├── Seat.tsx              # Individual seat component with keyboard support
│   ├── SeatDetails.tsx       # Seat information panel with pricing
│   ├── SelectionSummary.tsx  # Booking summary with real-time updates
│   └── TopBar.tsx            # Navigation header with home button
├── lib/
│   ├── types.ts              # TypeScript interfaces for venues and seats
│   ├── parseVenue.ts         # Venue data processing with type safety
│   └── price.ts              # Pricing utilities with locale-safe formatting
└── store/
    ├── focus.ts              # Focus management for keyboard navigation
    └── selection.ts          # Seat selection state with Zustand
```

### **Data Flow**
1. **Home Page** → Loads `arenas.json` → Displays venue cards with SVG illustrations
2. **Venue Selection** → Routes to `/arena/[venueId]` with dynamic routing
3. **Arena Page** → Loads specific venue data → Renders interactive seating map
4. **Seat Selection** → Updates Zustand store → Real-time UI updates across components

### **Key Technologies**
- **Next.js 15** - App Router, dynamic routing, and server-side rendering
- **React 19** - Modern React with hooks and concurrent features
- **Material-UI 7** - Latest design system with professional components
- **Zustand** - Lightweight state management with TypeScript support
- **D3.js** - Interactive data visualization with zoom/pan capabilities
- **TypeScript** - Full type safety with discriminated union types

## 🎭 **Venue Details**

### **Metropolis Arena** (arena-01)
- **Type**: Indoor Arena
- **Capacity**: 2,500
- **Location**: Downtown Metropolis
- **Features**: Premium lower bowl, multiple sections, excellent acoustics
- **Theme**: Dark blue (#2c3e50) with professional styling
- **Sections**: Lower Bowl A (Premium), Lower Bowl B (Standard)

### **Starlight Stadium** (arena-02)  
- **Type**: Outdoor Stadium
- **Capacity**: 4,500
- **Location**: Riverside District
- **Features**: Luxury VIP suites, panoramic views, main stand
- **Theme**: Purple (#8e44ad) with luxury aesthetic
- **Sections**: VIP Suites (Premium), Main Stand (Standard/Economy)

### **The Grand Hall** (arena-03)
- **Type**: Concert Hall
- **Capacity**: 1,200
- **Location**: Cultural Quarter
- **Features**: Intimate setting, perfect acoustics, orchestra and balcony seating
- **Theme**: Red (#e74c3c) with elegant concert hall styling
- **Sections**: Orchestra (Premium), Balcony (Standard)

## 🔧 **Customization**

### **Adding New Venues**
1. Update `public/arenas.json` with new venue data
2. Follow the existing data structure with proper types
3. Include stage and seating sections with unique IDs
4. Set appropriate pricing tiers and seat statuses
5. Create matching SVG illustration in `public/` directory

### **Modifying Seating Layouts**
- Edit section transforms and coordinates for proper positioning
- Adjust seat positioning and spacing for optimal user experience
- Update stage dimensions and colors to match venue theme
- Modify pricing tier assignments and seat availability

### **Data Structure**
```json
{
  "venueId": "unique-id",
  "name": "Venue Name",
  "description": "Detailed description",
  "capacity": 1000,
  "location": "City, District",
  "image": "/venue-image.svg",
  "map": { "width": 1000, "height": 800 },
  "sections": [
    {
      "id": "STAGE",
      "type": "stage",
      "width": 400,
      "height": 60,
      "color": "#hexcode"
    },
    {
      "id": "SECTION_A",
      "type": "seating",
      "rows": [...]
    }
  ]
}
```

## 📱 **Responsive Design**
- **Desktop**: Full-featured interface with side panels
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly seat selection and navigation

## 🚀 **Latest Improvements**

### **Multi-Arena System**
- **Dynamic Routing**: Next.js 15 App Router with `/arena/[venueId]` structure
- **Venue Browsing**: Interactive home page with search and filtering
- **SVG Illustrations**: Beautiful venue representations with custom themes
- **Navigation**: Seamless back/forward navigation between venues

### **Enhanced User Experience**
- **Real-time Search**: Instant filtering across venue names, locations, and descriptions
- **Interactive Cards**: Hover effects, smooth transitions, and visual feedback
- **Loading States**: Professional loading indicators and error handling
- **Responsive Design**: Optimized for all device sizes

### **Technical Enhancements**
- **Type Safety**: Discriminated union types for venues and sections
- **Performance**: Optimized data loading and state management
- **Accessibility**: Keyboard navigation with roving tabindex
- **Modern Stack**: Latest versions of Next.js, React, and Material-UI

### **Adjacent Seats Helper**
- **Smart Seat Finding**: Automatically find N adjacent available seats
- **Multiple Search Strategies**: Prioritizes horizontal groups, then vertical groups
- **One-Click Selection**: Automatically select and focus on found seat groups
- **Flexible Group Sizes**: Support for 1-20 seats with input validation
- **Real-Time Feedback**: Loading states, success messages, and error handling
- **Intelligent Algorithms**: BFS-based connected component analysis for complex layouts

## 🎯 **Future Enhancements**
- **Real-time Availability**: Live seat status updates with WebSocket
- **User Accounts**: Save preferences and booking history
- **Payment Integration**: Complete booking workflow with Stripe/PayPal
- **Event Management**: Schedule and event details integration
- **Accessibility**: Enhanced screen reader support and ARIA labels
- **Analytics**: Usage and booking statistics dashboard
- **Mobile App**: React Native companion application

---

Built with ❤️ using modern web technologies for the best user experience.
