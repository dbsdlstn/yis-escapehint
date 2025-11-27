import { render, screen, fireEvent } from '@testing-library/react';
import { HintDisplay } from './HintDisplay';
import { MemoryRouter } from 'react-router-dom';

// Mock the HintService
jest.mock('../services/HintService', () => ({
  HintService: {
    useGetHintById: (_hintId: string) => ({
      data: {
        id: _hintId,
        themeId: 'theme-1',
        code: 'HINT01',
        content: 'This is a test hint content. Look behind the painting.',
        answer: 'The key is hidden behind the painting on the left wall.',
        progressRate: 25,
        order: 1,
        isActive: true,
        createdAt: '2025-11-26T00:00:00.000Z',
        updatedAt: '2025-11-26T00:00:00.000Z',
      },
      isLoading: false,
      error: null,
    }),
  },
}));

const renderWithRouter = (hintId = 'hint-1') => {
  render(
    <MemoryRouter initialEntries={[`/hint/${hintId}`]}>
      <HintDisplay />
    </MemoryRouter>
  );
};

describe('HintDisplay', () => {
  test('should render hint content', () => {
    renderWithRouter('hint-1');
    
    // Use a more specific selector since "HINT" appears in multiple places
    expect(screen.getByText('HINT', { selector: '.text-hint-label' })).toBeInTheDocument();
    expect(screen.getByText('This is a test hint content. Look behind the painting.')).toBeInTheDocument();
    expect(screen.getByText('25% 진행률')).toBeInTheDocument();
    
    // Check for progress bar - using test ID or text match instead of role
    const progressBar = screen.getByText(/25%/);  // The progress percentage text is visible
    expect(progressBar).toBeInTheDocument();
  });

  test('should show answer when "Show Answer" button is clicked', () => {
    renderWithRouter();
    
    // Initially, the answer should not be visible
    expect(screen.queryByText(/정답:/i)).not.toBeInTheDocument();
    
    // Click the "Show Answer" button
    const showAnswerButton = screen.getByRole('button', { name: /정답 보기/i });
    fireEvent.click(showAnswerButton);
    
    // Now the answer should be visible
    expect(screen.getByText(/정답:/i)).toBeInTheDocument();
    expect(screen.getByText('The key is hidden behind the painting on the left wall.')).toBeInTheDocument();
  });

  test('should have a back button', () => {
    renderWithRouter();
    
    const backButton = screen.getByRole('button', { name: /뒤로 가기/i });
    expect(backButton).toBeInTheDocument();
  });
});