import Home from '@/app/page';
import { render, screen } from '@testing-library/react';

// Mock Next.js font optimization
jest.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'inter',
  }),
}));

describe('Home Page', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText(/Protegemos y rescatamos/i)).toBeInTheDocument();
  });
});
