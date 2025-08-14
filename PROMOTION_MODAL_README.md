# Promotion Modal Feature

## Overview
The promotion modal is a feature that displays homepage titles and content from the database as promotional content. It shows once when the user completes sign-in and can be closed by the user. **This modal only shows for authenticated users and only if content exists.**

## Features
- **One-Time Display**: Shows only once when user completes sign-in
- **User Control**: Can be closed with X button or "Got it!" button
- **Non-Intrusive**: Clicking outside the modal doesn't close it
- **Database Integration**: Fetches titles and content from `/settings/homepage-content/titles` and `/settings/homepage-content/title/{title}` APIs
- **Content Validation**: Only shows modal if content exists and is not empty
- **Rich Content Support**: Displays HTML content with proper formatting
- **Responsive Design**: Follows the existing modal design pattern
- **Error Handling**: Gracefully handles API failures
- **Authentication Required**: Only shows for signed-in users

## Components

### 1. PromotionContext (`src/contexts/promotionContext.jsx`)
Manages the state and logic for the promotion modal:
- Fetches titles from API
- Controls modal visibility
- Handles timing intervals
- Prevents too frequent displays

### 2. PromotionModal (`src/components/modals/PromotionModal.jsx`)
The actual modal component:
- Displays current title
- Provides close functionality
- Shows loading state
- Animated appearance

### 3. usePromotion Hook (`src/hooks/usePromotion.js`)
Custom hook for accessing promotion context:
```javascript
const { 
  isModalVisible, 
  currentTitle, 
  showPromotionModal, 
  hidePromotionModal 
} = usePromotion();
```

## API Requirements
The modal expects the following API endpoints:
- **GET** `/settings/homepage-content/titles`
  - **Response**: Array of title strings
- **GET** `/settings/homepage-content/title/{title}` or `/settings/homepage-content?title={title}`
  - **Response**: Object with `title` and `content` fields
  - **Content**: HTML content that will be displayed in the modal

## Usage

### Basic Implementation
The promotion modal is automatically included in the app when you wrap your components with `PromotionProvider`:

```jsx
import PromotionProvider from './contexts/promotionContext';
import PromotionModal from './components/modals/PromotionModal';

function App() {
  return (
    <PromotionProvider>
      <YourAppContent />
      <PromotionModal />
    </PromotionProvider>
  );
}
```

### Manual Control
You can manually control the modal using the `usePromotion` hook:

```jsx
import usePromotion from './hooks/usePromotion';

function MyComponent() {
  const { showPromotionModal, hidePromotionModal } = usePromotion();
  
  return (
    <div>
      <button onClick={showPromotionModal}>Show Promotion</button>
      <button onClick={hidePromotionModal}>Hide Promotion</button>
    </div>
  );
}
```

## Configuration

### Timing
- **Display**: 1 second after sign-in completion and titles are loaded
- **Frequency**: Only once per sign-in session
- **Reset**: Resets when user signs out and signs back in

### Styling
The modal uses the existing design system:
- Background: `#282D36`
- Text: `#E9D8C8`
- Accent: `#11B3AE`
- Z-index: `1201` (above other content)

## Authentication
The promotion modal only appears for authenticated users:
- Checks `isAuthenticated` state from auth context
- Won't fetch titles or show modal for non-authenticated users
- Shows once when user completes sign-in
- Resets when user signs out and signs back in

## Error Handling
- API failures are logged to console
- Modal won't show if no titles are available
- Graceful degradation when API is unavailable

## Future Enhancements
- User preference storage (don't show again)
- Customizable timing intervals
- Rich content support (images, links)
- A/B testing capabilities
- Analytics tracking 