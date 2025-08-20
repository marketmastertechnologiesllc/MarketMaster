# Loading Context Documentation

This document explains how to use the loading context with react-loading-indicators in your MarketMaster application.

## Overview

The loading context provides a centralized way to manage loading states throughout your application using the `Atom` component from `react-loading-indicators`.

### Default Configuration

```jsx
const DEFAULT_SETTINGS = {
  text: 'Hang Tight',
  color: '#11B3AE',
  size: 'large',
  textColor: '#E9D8C8'
};
```

## Setup

The `LoadingProvider` is already integrated into your app in `src/App.jsx`. You can start using it immediately in any component.

## Basic Usage

### 1. Import the hook

```jsx
import { useLoading } from '../hooks/useLoading';
```

### 2. Simple Usage (Recommended)

```jsx
const MyComponent = () => {
  const { loading } = useLoading();

  const handleApiCall = async () => {
    loading(true); // Show loading with default settings
    try {
      await api.get('/some-endpoint');
    } finally {
      loading(false); // Hide loading
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>Load Data</button>
    </div>
  );
};
```

### 3. Advanced Usage with Custom Settings

```jsx
const MyComponent = () => {
  const { loading, LoadingSpinner, isLoading } = useLoading();

  const handleApiCall = async () => {
    loading(true, 'myApi', { text: 'Loading data...' });
    try {
      await api.get('/some-endpoint');
    } finally {
      loading(false, 'myApi');
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>Load Data</button>
      {isLoading('myApi') && <LoadingSpinner key="myApi" />}
    </div>
  );
};
```

## Available Methods

### `loading(show, key, options)` ⭐ **Recommended**
Simple boolean function to show/hide loading.

**Parameters:**
- `show` (boolean): `true` to show loading, `false` to hide
- `key` (string, optional): Unique identifier for this loading state (default: 'default')
- `options` (object, optional): Configuration options
  - `text` (string): Loading text (default: 'Hang Tight')
  - `color` (string): Color of the spinner (default: '#11B3AE')
  - `size` (string): Size of the spinner (default: 'large')
  - `textColor` (string): Color of the text (default: '#E9D8C8')

**Examples:**
```jsx
// Simple usage with default settings
loading(true);  // Shows loading with "Hang Tight"
loading(false); // Hides loading

// Custom settings
loading(true, 'userData', { 
  text: 'Fetching user data...', 
  color: '#FF6B6B',
  size: 'medium',
  textColor: '#FFFFFF'
});
```

### `showLoading(key, options)`
Shows a loading indicator with the specified key.

**Parameters:**
- `key` (string): Unique identifier for this loading state (default: 'default')
- `options` (object): Configuration options (same as above)

### `hideLoading(key)`
Hides the loading indicator with the specified key.

**Parameters:**
- `key` (string): The key of the loading state to hide (default: 'default')

### `setLoadingText(key, text)`
Updates the text of an existing loading indicator.

**Parameters:**
- `key` (string): The key of the loading state
- `text` (string): New text to display

### `isLoading(key)`
Checks if a loading state is active.

**Parameters:**
- `key` (string): The key of the loading state to check (default: 'default')

**Returns:** boolean

## Components

### `LoadingSpinner`
A simple loading spinner component.

**Props:**
- `key` (string): The key of the loading state to display (default: 'default')

**Example:**
```jsx
{isLoading('myApi') && <LoadingSpinner key="myApi" />}
```

### `LoadingOverlay`
A loading overlay that covers its children with a semi-transparent background.

**Props:**
- `key` (string): The key of the loading state to display (default: 'default')
- `children`: The content to overlay

**Example:**
```jsx
<LoadingOverlay key="formSubmit">
  <form onSubmit={handleSubmit}>
    {/* form content */}
  </form>
</LoadingOverlay>
```

## Usage Patterns

### 1. Simple API Calls (Recommended)

```jsx
const handleSubmit = async (formData) => {
  loading(true); // Uses default "Hang Tight" settings
  try {
    await api.post('/submit', formData);
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    loading(false);
  }
};
```

### 2. API Calls with Custom Settings

```jsx
const handleSubmit = async (formData) => {
  loading(true, 'submit', { text: 'Submitting form...' });
  try {
    await api.post('/submit', formData);
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    loading(false, 'submit');
  }
};
```

### 3. Multiple Loading States

```jsx
const MyComponent = () => {
  const { loading, isLoading, LoadingSpinner } = useLoading();

  const loadUserData = async () => {
    loading(true, 'userData', { text: 'Loading user data...' });
    await api.get('/user');
    loading(false, 'userData');
  };

  const loadSettings = async () => {
    loading(true, 'settings', { text: 'Loading settings...' });
    await api.get('/settings');
    loading(false, 'settings');
  };

  return (
    <div>
      <button onClick={loadUserData}>Load User</button>
      <button onClick={loadSettings}>Load Settings</button>
      
      {isLoading('userData') && <LoadingSpinner key="userData" />}
      {isLoading('settings') && <LoadingSpinner key="settings" />}
    </div>
  );
};
```

### 3. Form Submission with Overlay

```jsx
const MyForm = () => {
  const { showLoading, hideLoading, LoadingOverlay } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading('formSubmit', { text: 'Submitting...' });
    try {
      await api.post('/submit', formData);
    } finally {
      hideLoading('formSubmit');
    }
  };

  return (
    <LoadingOverlay key="formSubmit">
      <form onSubmit={handleSubmit}>
        {/* form fields */}
        <button type="submit">Submit</button>
      </form>
    </LoadingOverlay>
  );
};
```

### 4. Dynamic Text Updates

```jsx
const handleLongProcess = async () => {
  showLoading('process', { text: 'Starting process...' });
  
  await step1();
  setLoadingText('process', 'Processing data...');
  
  await step2();
  setLoadingText('process', 'Finalizing...');
  
  await step3();
  hideLoading('process');
};
```

## Integration with Existing Components

You can easily integrate this with your existing components. For example, in your Dashboard component:

```jsx
// In Dashboard.jsx
import { useLoading } from '../hooks/useLoading';

function Dashboard() {
  const { showLoading, hideLoading, LoadingOverlay } = useLoading();

  const handleDataRefresh = async () => {
    showLoading('dashboard', { text: 'Refreshing dashboard...' });
    try {
      // Your existing data fetching logic
      await fetchDashboardData();
    } finally {
      hideLoading('dashboard');
    }
  };

  return (
    <LoadingOverlay key="dashboard">
      <div className="w-auto text-[#E9D8C8] pb-[100px]">
        {/* Your existing dashboard content */}
      </div>
    </LoadingOverlay>
  );
}
```

## Best Practices

1. **Use descriptive keys**: Use meaningful keys like 'userData', 'formSubmit', 'dashboardRefresh' instead of generic ones.

2. **Always hide loading**: Use try/finally blocks to ensure loading states are properly cleaned up.

3. **Provide user feedback**: Use descriptive text that tells users what's happening.

4. **Use appropriate sizes**: Use 'small' for inline loading, 'medium' for section loading, and 'large' for full-page loading.

5. **Consistent colors**: Stick to your app's color scheme (#11B3AE for primary actions).

## Example Component

See `src/components/LoadingExample.jsx` for a comprehensive example of all loading patterns. 