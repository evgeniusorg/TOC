import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

describe('check App', () => {
  test('render header', () => {
    render(<App />);
    const element = screen.getByText(/Table of Contents component/i);
    expect(element).toBeInTheDocument();
  });

  test('render search input', () => {
    render(<App />);
    const element = screen.getByRole('textbox');
    expect(element).toBeInTheDocument();
  });

  test('change value on search input', () => {
    render(<App />);
    const input: HTMLInputElement = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'test'}})
    expect(input.value).toBe('test');
  });

  test('render empty search result', async () => {
    render(<App />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, {target: {value: 'test'}})

    await waitFor(() => {
      expect(screen.getByText('Nothing found')).toBeInTheDocument();
    })
  });
});

