import { render, screen, fireEvent } from '@testing-library/react';
import { GameScreen } from '../pages/GameScreen';
import { MemoryRouter } from 'react-router-dom';

// Mock the services and context
jest.mock('../services/GameSessionService', () => ({
  GameSessionService: {
    useGetSession: (_sessionId: string) => ({
      data: null,
      isLoading: false,
      error: null,
    }),
    useStartSession: () => ({
      mutate: jest.fn(),
    }),
  },
}));

jest.mock('../services/ThemeService', () => ({
  ThemeService: {
    useGetThemeById: (_themeId: string) => ({
      data: {
        id: 'theme-1',
        name: 'Zombie Lab',
        description: 'Escape the zombie lab',
        playTime: 60,
        isActive: true,
        difficulty: '★★★★☆',
        hintCount: 10,
        createdAt: '2025-11-26T00:00:00.000Z',
        updatedAt: '2025-11-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    }),
  },
}));

jest.mock('../services/HintService', () => ({
  HintService: {
    useSubmitHint: () => ({
      mutate: jest.fn(),
    }),
  },
}));

jest.mock('../stores/ThemeContext', () => ({
  useTheme: () => ({
    darkMode: true,
  }),
}));

// Mock the formatTime function
jest.mock('../utils/helpers', () => ({
  formatTime: (seconds: number) => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
}));

const renderWithRouter = (themeId = 'theme-1') => {
  render(
    <MemoryRouter initialEntries={[`/game/${themeId}`]}>
      <GameScreen />
    </MemoryRouter>
  );
};

describe('GameScreen', () => {
  test('should render the game screen with theme info', () => {
    renderWithRouter();
    
    expect(screen.getByText('Zombie Lab')).toBeInTheDocument();
    expect(screen.getByText('진행률: 0%')).toBeInTheDocument();
    expect(screen.getByText('사용한 힌트: 0개')).toBeInTheDocument();
    
    // Check for hint input elements
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4); // 4 input boxes for hint code
  });

  test('should handle hint code input', () => {
    renderWithRouter();
    
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
    
    // Fill the first input with a character
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    expect(inputs[0]).toHaveValue('A');
    
    // The value should be automatically converted to uppercase
    fireEvent.change(inputs[1], { target: { value: 'b' } });
    expect(inputs[1]).toHaveValue('B');
  });

  test('should not allow more than one character per input', () => {
    renderWithRouter();

    const inputs = screen.getAllByRole('textbox');

    // Try to enter multiple characters in one input - component should ignore
    fireEvent.change(inputs[0], { target: { value: 'AB' } });
    // The component logic prevents more than one character
    expect(inputs[0]).not.toHaveValue('AB');
    // Initially should be empty because 'AB' is more than 1 character
    expect(inputs[0]).toHaveValue('');
  });

  test('should enable submit button when all 4 characters are entered', () => {
    renderWithRouter();
    
    const inputs = screen.getAllByRole('textbox');
    const submitButton = screen.getByRole('button', { name: /확인/i });
    
    // Initially disabled
    expect(submitButton).toBeDisabled();
    
    // Fill all 4 inputs
    fireEvent.change(inputs[0], { target: { value: 'A' } });
    fireEvent.change(inputs[1], { target: { value: 'B' } });
    fireEvent.change(inputs[2], { target: { value: 'C' } });
    fireEvent.change(inputs[3], { target: { value: 'D' } });
    
    // Now the button should be enabled
    expect(submitButton).not.toBeDisabled();
  });
});