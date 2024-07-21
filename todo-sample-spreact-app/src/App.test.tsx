import React from 'react';
import { render, screen } from '@testing-library/react';
import { AppViewModel } from './ViewModels/AppViewModel';
// import App from './App';
const __AppVM = new AppViewModel(null,'');
test('renders learn react link', () => {
  render(__AppVM.App);
  const linkElement = screen.getByText(/MY NOTES/i);
  expect(linkElement).toBeInTheDocument();
});
