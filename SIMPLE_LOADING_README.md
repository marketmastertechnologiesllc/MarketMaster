# Simple Loading Hook

A simple loading hook that uses `react-loading-indicators` with default settings.

## Usage

### Basic Usage

```jsx
import { useSimpleLoading } from '../hooks/useSimpleLoading';

const MyComponent = () => {
  const { loading, LoadingComponent } = useSimpleLoading();

  const handleApiCall = async () => {
    loading(true); // Show loading
    try {
      await api.get('/some-endpoint');
    } finally {
      loading(false); // Hide loading
    }
  };

  return (
    <div>
      <button onClick={handleApiCall}>Load Data</button>
      <LoadingComponent />
    </div>
  );
};
```

### Custom Settings

```jsx
const { loading, LoadingComponent } = useSimpleLoading({
  text: 'Processing...',
  color: '#FF6B6B',
  size: 'medium',
  textColor: '#FFFFFF'
});
```

## Default Settings

```jsx
const DEFAULT_SETTINGS = {
  text: 'Hang Tight',
  color: '#11B3AE',
  size: 'large',
  textColor: '#E9D8C8'
};
```

## API

### `useSimpleLoading(settings?)`

**Parameters:**
- `settings` (object, optional): Custom settings to override defaults

**Returns:**
- `loading(boolean)`: Function to show/hide loading
- `isLoading`: Current loading state
- `LoadingComponent`: React component to render

### `loading(show)`

**Parameters:**
- `show` (boolean): `true` to show loading, `false` to hide

## Examples

### API Call with Loading

```jsx
const handleSubmit = async (formData) => {
  loading(true);
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

### Multiple Loading Instances

```jsx
const MyComponent = () => {
  const { loading: loading1, LoadingComponent: Loading1 } = useSimpleLoading();
  const { loading: loading2, LoadingComponent: Loading2 } = useSimpleLoading({
    text: 'Processing...',
    color: '#FF6B6B'
  });

  const handleAction1 = async () => {
    loading1(true);
    await someAsyncOperation();
    loading1(false);
  };

  const handleAction2 = async () => {
    loading2(true);
    await anotherAsyncOperation();
    loading2(false);
  };

  return (
    <div>
      <button onClick={handleAction1}>Action 1</button>
      <button onClick={handleAction2}>Action 2</button>
      <Loading1 />
      <Loading2 />
    </div>
  );
};
```

## Features

- ✅ Simple boolean control: `loading(true)` / `loading(false)`
- ✅ Default settings with custom overrides
- ✅ Full-screen overlay with semi-transparent background
- ✅ Uses your app's color scheme by default
- ✅ No context provider needed
- ✅ Lightweight and easy to use

## Example Component

See `src/components/SimpleLoadingExample.jsx` for working examples. 