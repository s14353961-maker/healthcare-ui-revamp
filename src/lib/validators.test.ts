import { describe, expect, it } from 'vitest';
import { compose, email, pastDate, phone, required } from './validators';

describe('validators', () => {
  it('required', () => {
    expect(required('Name')('')).toBe('Name is required');
    expect(required('Name')('  ')).toBe('Name is required');
    expect(required('Name')('Ann')).toBeUndefined();
  });
  it('email', () => {
    expect(email('a@b.co')).toBeUndefined();
    expect(email('nope')).toMatch(/email/);
    expect(email('')).toBeUndefined();
  });
  it('phone', () => {
    expect(phone('(555) 014-2290')).toBeUndefined();
    expect(phone('123')).toMatch(/digits/);
  });
  it('pastDate', () => {
    expect(pastDate('Date of birth')('1990-01-01')).toBeUndefined();
    expect(pastDate('Date of birth')('2999-01-01')).toMatch(/future/);
  });
  it('compose returns first error', () => {
    const v = compose(required('Email'), email);
    expect(v('')).toBe('Email is required');
    expect(v('x')).toMatch(/email/);
  });
});
