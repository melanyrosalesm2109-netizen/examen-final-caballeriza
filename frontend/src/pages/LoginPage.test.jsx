import {
    render,
    screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import {
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import LoginPage from './LoginPage';

vi.mock('../services/authService', () => ({
    default: {
        isAuthenticated: vi.fn(() => false),
        login: vi.fn(),
    },
}));

describe('LoginPage', () => {
    it('muestra el formulario de inicio de sesión', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>,
        );

        expect(
            screen.getByRole('heading', {
                name: /iniciar sesión/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(
                /correo electrónico/i,
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByLabelText(
                /^contraseña$/i,
            ),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('button', {
                name: /iniciar sesión/i,
            }),
        ).toBeInTheDocument();

        expect(
            screen.getByRole('link', {
                name: /registrate aquí/i,
            }),
        ).toBeInTheDocument();
    });
});